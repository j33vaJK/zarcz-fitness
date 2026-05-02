"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, PieChart, BarChart, Activity, Box } from "lucide-react";
import { useInvoiceStats } from "@/hooks/use-invoices";
import { useProducts } from "@/hooks/use-products";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function AdminReportsPage() {
  const { data: stats } = useInvoiceStats();
  const { data: productsData } = useProducts();
  
  const totalProducts = productsData?.total || 0;
  const totalStock = productsData?.products.reduce((acc, p) => acc + p.stock, 0) || 0;

  const downloadReport = (type: 'daily' | 'monthly' | 'yearly') => {
    if (!stats) return;
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(30, 58, 138);
      doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Financial Report`, 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Generated on: ${format(new Date(), 'MMM d, yyyy')}`, 14, 32);
      
      const data = stats[type];
      
      autoTable(doc, {
        startY: 40,
        head: [["Metric", "Value"]],
        body: [
          ["Total Revenue", `Rs. ${data.revenue.toFixed(2)}`],
          ["Invoices Generated", data.invoices.toString()],
          ["Items Sold", data.itemsSold.toString()],
          ...(type === 'yearly' ? [["Best Selling Category", (data as any).bestSellingCategory || "N/A"]] : [])
        ],
        theme: "striped",
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      });

      const finalY = (doc as any).lastAutoTable.finalY || 40;

      if (type === 'monthly' && 'timeSeries' in data) {
        doc.setFontSize(14);
        doc.text("Daily Revenue Breakdown", 14, finalY + 12);
        autoTable(doc, {
          startY: finalY + 16,
          head: [["Date", "Revenue"]],
          body: data.timeSeries.map((item: any) => [item.date, `Rs. ${item.revenue.toFixed(2)}`]),
          theme: "grid",
          headStyles: { fillColor: [100, 100, 100], textColor: 255 },
        });
      } else if (type === 'yearly' && 'timeSeries' in data) {
        doc.setFontSize(14);
        doc.text("Monthly Revenue Breakdown", 14, finalY + 12);
        autoTable(doc, {
          startY: finalY + 16,
          head: [["Month", "Revenue"]],
          body: data.timeSeries.map((item: any) => [item.month, `Rs. ${item.revenue.toFixed(2)}`]),
          theme: "grid",
          headStyles: { fillColor: [100, 100, 100], textColor: 255 },
        });
      }
      
      doc.save(`${type}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded!`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate report PDF.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">View detailed breakdowns of your store's performance.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Daily Summary */}
        <Card className="border-primary/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Activity className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Daily Summary
            </CardTitle>
            <CardDescription>Performance for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Invoices</p>
                <p className="text-2xl font-bold">{stats?.daily.invoices || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                <p className="text-2xl font-bold">{stats?.daily.itemsSold || 0}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹{(stats?.daily.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
            <Button onClick={() => downloadReport('daily')} className="w-full gap-2 font-bold" variant="outline">
              <Download className="w-4 h-4" /> Export Daily (PDF)
            </Button>
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        <Card className="border-primary/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <PieChart className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Monthly Summary
            </CardTitle>
            <CardDescription>Performance for this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Invoices</p>
                <p className="text-2xl font-bold">{stats?.monthly.invoices || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                <p className="text-2xl font-bold">{stats?.monthly.itemsSold || 0}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹{(stats?.monthly.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
            <Button onClick={() => downloadReport('monthly')} className="w-full gap-2 font-bold" variant="outline">
              <Download className="w-4 h-4" /> Export Detailed Monthly (PDF)
            </Button>
          </CardContent>
        </Card>

        {/* Yearly Summary */}
        <Card className="border-primary/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <BarChart className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" /> Yearly Summary
            </CardTitle>
            <CardDescription>Performance for this year</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Best Selling Category</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold text-primary">{stats?.yearly.bestSellingCategory || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                <p className="text-2xl font-bold">{stats?.yearly.itemsSold || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Avg. Monthly</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{((stats?.yearly.revenue || 0) / (new Date().getMonth() + 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            <Button onClick={() => downloadReport('yearly')} className="w-full gap-2 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="w-4 h-4" /> Export Detailed Yearly (PDF)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Visual breakdown of your store's performance over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="monthly">This Month (Daily)</TabsTrigger>
              <TabsTrigger value="yearly">This Year (Monthly)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly" className="h-[400px]">
              {stats?.monthly.timeSeries ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={stats.monthly.timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
                      tickFormatter={(value) => value >= 1000 ? `₹${(value/1000).toFixed(0)}k` : `₹${value}`}
                      domain={[0, 15000]}
                      ticks={[0, 3000, 6000, 9000, 12000, 15000]}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <ReferenceLine 
                      y={5000} 
                      label={{ value: 'Daily Goal', position: 'right', fill: '#10b981', fontSize: 10 }} 
                      stroke="#10b981" 
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading data...</div>
              )}
            </TabsContent>
            
            <TabsContent value="yearly" className="h-[400px]">
              {stats?.yearly.timeSeries ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={stats.yearly.timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                      tickFormatter={(value) => value >= 1000 ? `₹${(value/1000).toFixed(0)}k` : `₹${value}`}
                      domain={[0, 450000]}
                      ticks={[0, 90000, 180000, 270000, 360000, 450000]}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <ReferenceLine 
                      y={150000} 
                      label={{ value: 'Monthly Goal', position: 'right', fill: '#10b981', fontSize: 10 }} 
                      stroke="#10b981" 
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading data...</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Inventory Overview */}
      <Card className="border-primary/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Box className="w-32 h-32" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" /> Global Inventory Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Unique Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Stock Remaining</p>
              <p className="text-2xl font-bold">{totalStock}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Yearly Revenue</p>
              <p className="text-2xl font-bold text-primary">₹{(stats?.yearly.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Yearly Invoices</p>
              <p className="text-2xl font-bold">{stats?.yearly.invoices || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
