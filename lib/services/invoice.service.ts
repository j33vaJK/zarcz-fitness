import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, format, eachDayOfInterval, eachMonthOfInterval, subDays } from 'date-fns';

export async function createInvoice(data: {
  invoiceNumber: string;
  customerName?: string;
  date: Date;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxRate: number;
  }[];
}) {
  return await prisma.$transaction(async (tx) => {
    // Create the invoice
    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        customerName: data.customerName,
        date: data.date,
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        discountAmount: data.discountAmount,
        grandTotal: data.grandTotal,
        items: {
          create: data.items,
        },
      },
      include: {
        items: true,
      },
    });

    // Update product stock
    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return invoice;
  });
}

export async function getRecentInvoices(limit = 10) {
  return await prisma.invoice.findMany({
    orderBy: { date: 'desc' },
    take: limit,
  });
}

export async function countTodayInvoices() {
  const now = new Date();
  const start = startOfDay(now);
  const end = endOfDay(now);
  
  return await prisma.invoice.count({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
  });
}

export async function getFinancialStats() {
  const now = new Date();

  // Daily
  const dailyStart = startOfDay(now);
  const dailyEnd = endOfDay(now);

  // Weekly
  const weeklyStart = subDays(startOfDay(now), 6);
  const weeklyEnd = endOfDay(now);

  // Monthly
  const monthlyStart = startOfMonth(now);
  const monthlyEnd = endOfMonth(now);

  // Yearly
  const yearlyStart = startOfYear(now);
  const yearlyEnd = endOfYear(now);

  const [dailyData, monthlyData, yearlyData, bestSelling] = await Promise.all([
    // Daily Stats
    prisma.invoice.aggregate({
      where: { date: { gte: dailyStart, lte: dailyEnd } },
      _sum: { grandTotal: true },
      _count: { id: true }
    }),
    
    // Monthly Stats
    prisma.invoice.aggregate({
      where: { date: { gte: monthlyStart, lte: monthlyEnd } },
      _sum: { grandTotal: true },
      _count: { id: true }
    }),
    
    // Yearly Stats
    prisma.invoice.aggregate({
      where: { date: { gte: yearlyStart, lte: yearlyEnd } },
      _sum: { grandTotal: true },
      _count: { id: true }
    }),
    
    // Best selling products
    prisma.invoiceItem.groupBy({
      by: ['productId'],
      where: { invoice: { date: { gte: yearlyStart, lte: yearlyEnd } } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 4,
    })
  ]);

  // Get items sold aggregates
  const [dailyItems, monthlyItems, yearlyItems] = await Promise.all([
    prisma.invoiceItem.aggregate({
      where: { invoice: { date: { gte: dailyStart, lte: dailyEnd } } },
      _sum: { quantity: true }
    }),
    prisma.invoiceItem.aggregate({
      where: { invoice: { date: { gte: monthlyStart, lte: monthlyEnd } } },
      _sum: { quantity: true }
    }),
    prisma.invoiceItem.aggregate({
      where: { invoice: { date: { gte: yearlyStart, lte: yearlyEnd } } },
      _sum: { quantity: true }
    }),
  ]);

  const totalItemsYear = yearlyItems._sum.quantity || 1;
  const topPerformers = [];
  
  for (const item of bestSelling) {
    if (!item._sum.quantity) continue;
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { category: true }
    });
    
    if (product) {
      topPerformers.push({
        name: product.name,
        percentage: Math.round((item._sum.quantity / totalItemsYear) * 100)
      });
    }
  }

  let bestSellingCategoryName = "N/A";
  if (bestSelling.length > 0 && bestSelling[0]) {
    const product = await prisma.product.findUnique({
      where: { id: bestSelling[0].productId },
      include: { category: true }
    });
    if (product?.category) {
      bestSellingCategoryName = product.category.name;
    }
  }
  


  // Fetch all invoices for grouping
  const [weeklyInvoices, monthlyInvoices, yearlyInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: { date: { gte: weeklyStart, lte: weeklyEnd } },
      select: { date: true, grandTotal: true },
    }),
    prisma.invoice.findMany({
      where: { date: { gte: monthlyStart, lte: monthlyEnd } },
      select: { date: true, grandTotal: true },
    }),
    prisma.invoice.findMany({
      where: { date: { gte: yearlyStart, lte: yearlyEnd } },
      select: { date: true, grandTotal: true },
    })
  ]);

  // Calculate weekly time series (last 7 days)
  const daysInWeek = eachDayOfInterval({ start: weeklyStart, end: weeklyEnd });
  const weeklyTimeSeries = daysInWeek.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const revenue = weeklyInvoices
      .filter(inv => format(inv.date, 'yyyy-MM-dd') === dayStr)
      .reduce((sum, inv) => sum + inv.grandTotal, 0);
    return { date: format(day, 'EEE'), revenue }; // Mon, Tue, etc.
  });

  // Calculate monthly time series (each day)
  const daysInMonth = eachDayOfInterval({ start: monthlyStart, end: monthlyEnd });
  const monthlyTimeSeries = daysInMonth.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const revenue = monthlyInvoices
      .filter(inv => format(inv.date, 'yyyy-MM-dd') === dayStr)
      .reduce((sum, inv) => sum + inv.grandTotal, 0);
    return { date: format(day, 'MMM dd'), revenue };
  });

  // Calculate yearly time series (each month)
  const monthsInYear = eachMonthOfInterval({ start: yearlyStart, end: yearlyEnd });
  const yearlyTimeSeries = monthsInYear.map(month => {
    const monthStr = format(month, 'yyyy-MM');
    const revenue = yearlyInvoices
      .filter(inv => format(inv.date, 'yyyy-MM') === monthStr)
      .reduce((sum, inv) => sum + inv.grandTotal, 0);
    return { month: format(month, 'MMM'), revenue };
  });

  return {
    daily: {
      revenue: dailyData._sum.grandTotal || 0,
      invoices: dailyData._count.id || 0,
      itemsSold: dailyItems._sum.quantity || 0,
    },
    weekly: {
      timeSeries: weeklyTimeSeries,
    },
    monthly: {
      revenue: monthlyData._sum.grandTotal || 0,
      invoices: monthlyData._count.id || 0,
      itemsSold: monthlyItems._sum.quantity || 0,
      timeSeries: monthlyTimeSeries,
    },
    yearly: {
      revenue: yearlyData._sum.grandTotal || 0,
      invoices: yearlyData._count.id || 0,
      itemsSold: yearlyItems._sum.quantity || 0,
      bestSellingCategory: bestSellingCategoryName,
      timeSeries: yearlyTimeSeries,
      topPerformers,
    }
  };
}
