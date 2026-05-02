"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Package, Receipt, DollarSign, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useInvoiceStats } from "@/hooks/use-invoices";
import { useProducts } from "@/hooks/use-products";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function AdminDashboardPage() {
  const { data: stats } = useInvoiceStats();
  const { data: productsData } = useProducts();
  
  const totalProducts = productsData?.total || 0;
  const totalStock = productsData?.products.reduce((acc, p) => acc + p.stock, 0) || 0;

  const topPerformers = stats?.yearly.topPerformers || [];
  const monthlyRevenue = stats?.monthly.revenue || 0;
  const monthlyItems = stats?.monthly.itemsSold || 0;

  // Colors for top performers progress bars
  const colors = [
    "bg-primary",
    "bg-primary/80",
    "bg-primary/60",
    "bg-primary/40",
    "bg-primary/20",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue (Monthly)"
          value={`₹${monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend="up"
          trendValue="Active"
          description="Current month revenue"
        />
        <StatCard
          title="Items Sold (Monthly)"
          value={monthlyItems.toLocaleString()}
          icon={Receipt}
          trend="up"
          trendValue="Active"
          description="Current month volume"
        />
        <StatCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          icon={Package}
          description="Active products in catalog"
        />
        <StatCard
          title="Total Inventory Stock"
          value={totalStock.toLocaleString()}
          icon={Activity}
          description="Items currently in warehouse"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="pb-2 md:pb-6">
            <CardTitle className="text-lg md:text-xl">Recent Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] md:h-[300px]">
              {stats?.weekly?.timeSeries ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.weekly.timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                      tickFormatter={(value) => `₹${value}`}
                      domain={[0, 15000]}
                      ticks={[0, 3000, 6000, 9000, 12000, 15000]}
                    />
                    <RechartsTooltip 
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }} 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                    <ReferenceLine y={5000} stroke="#10b981" label={{ position: 'right', value: 'Goal (5k)', fill: '#10b981', fontSize: 10 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
                  Loading activity...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader className="pb-2 md:pb-6">
            <CardTitle className="text-lg md:text-xl">Top Selling Products (Yearly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-8">
              {topPerformers.length > 0 ? (
                topPerformers.map((item, index) => (
                  <div key={item.name} className="flex items-center">
                    <div className="ml-2 md:ml-4 space-y-1 flex-1">
                      <p className="text-xs md:text-sm font-medium leading-none">{item.name}</p>
                      <div className="w-full bg-muted rounded-full h-1.5 md:h-2.5 mt-1 md:mt-2">
                        <div 
                          className={`${colors[Math.min(index, colors.length - 1)]} h-1.5 md:h-2.5 rounded-full`} 
                          style={{ width: `${Math.max(item.percentage, 2)}%` }} // At least 2% so it's visible
                        ></div>
                      </div>
                    </div>
                    <div className="ml-auto font-medium text-xs md:text-sm pl-4">{item.percentage}%</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No sales data available yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
