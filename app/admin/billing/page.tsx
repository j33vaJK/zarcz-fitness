"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { FileText, Download, Plus, Trash2 } from "lucide-react";
import { useProducts, Product } from "@/hooks/use-products";
import { useInvoices, useCreateInvoice } from "@/hooks/use-invoices";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

type InvoiceItem = {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
};

export default function AdminBillingPage() {
  const { data: productsData } = useProducts();
  const products = productsData?.products || [];

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-CUSTOMER-YYYYMMDD-001");
  const [todayCount, setTodayCount] = useState(0);
  const [discountType, setDiscountType] = useState<"percent" | "amount">("amount");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const { data: recentInvoices = [] } = useInvoices(5);
  const { mutateAsync: createInvoiceAsync } = useCreateInvoice();

  useEffect(() => {
    setInvoiceDate(format(new Date(), "yyyy-MM-dd"));

    // Fetch today's count
    fetch('/api/invoices/count-today')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTodayCount(data.data.count);
        }
      });
  }, []);

  useEffect(() => {
    const customerPart = customerName ? customerName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) : "CUSTOMER";
    const datePart = format(new Date(), "yyyyMMdd");
    const increment = (todayCount + 1).toString().padStart(3, '0');
    setInvoiceNumber(`INV-${customerPart}-${datePart}-${increment}`);
  }, [customerName, todayCount]);

  const handleAddItem = () => {
    if (!selectedProductId) return;

    const productToAdd = products.find(p => p.id === selectedProductId);
    if (!productToAdd) return;

    const newItemId = Math.random().toString(36).substring(2, 9);
    setItems([...items, {
      id: newItemId,
      product: productToAdd,
      quantity: selectedQuantity,
      unitPrice: productToAdd.price
    }]);

    setIsDialogOpen(false);
    setSelectedProductId("");
    setSelectedQuantity(1);
    toast.success("Item added to invoice");
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item));
  };

  const getGstRate = (item: InvoiceItem) => {
    const catName = item.product.category?.name?.toLowerCase() || "";
    const prodName = item.product.name.toLowerCase();
    const isJerseyOrShirt = catName.includes("jersey") || catName.includes("shirt") || prodName.includes("jersey") || prodName.includes("shirt") || catName.includes("t-shirt") || prodName.includes("t-shirt");

    if (isJerseyOrShirt && item.unitPrice > 2500) {
      return 18;
    }
    return 5;
  };

  const calculatedItems = useMemo(() => {
    return items.map(item => {
      const amount = item.quantity * item.unitPrice;
      const gstRate = getGstRate(item);
      const taxAmount = amount * (gstRate / 100);
      const cgst = taxAmount / 2;
      const sgst = taxAmount / 2;

      return {
        ...item,
        amount,
        gstRate,
        cgst,
        sgst,
        totalWithTax: amount + taxAmount
      };
    });
  }, [items]);

  const subtotal = calculatedItems.reduce((acc, item) => acc + item.amount, 0);
  const totalCgst = calculatedItems.reduce((acc, item) => acc + item.cgst, 0);
  const totalSgst = calculatedItems.reduce((acc, item) => acc + item.sgst, 0);
  const totalAmountBeforeDiscount = subtotal + totalCgst + totalSgst;

  const discountAmount = discountType === "percent"
    ? totalAmountBeforeDiscount * (discountValue / 100)
    : discountValue;

  const totalAmount = Math.max(0, totalAmountBeforeDiscount - discountAmount);

  const downloadPDF = async () => {
    if (calculatedItems.length === 0) {
      toast.error("Please add items to the invoice before generating a PDF");
      return;
    }
    if (!customerName.trim()) {
      toast.error("Customer name is required to generate an invoice");
      return;
    }
    try {
      await createInvoiceAsync({
        invoiceNumber,
        customerName: customerName || undefined,
        date: new Date(invoiceDate),
        subtotal,
        taxAmount: totalCgst + totalSgst,
        discountAmount,
        grandTotal: totalAmount,
        items: calculatedItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
          taxRate: item.gstRate
        }))
      });

      const doc = new jsPDF();

      doc.setFontSize(22);
      doc.setTextColor(30, 58, 138);
      doc.text("INVOICE", 14, 22);

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Invoice Number: ${invoiceNumber}`, 14, 32);
      doc.text(`Date: ${invoiceDate}`, 14, 37);
      doc.text(`Customer: ${customerName || 'Walk-in Customer'}`, 14, 42);

      const tableData = calculatedItems.map((item, index) => [
        index + 1,
        item.product.name,
        `Rs. ${item.unitPrice.toFixed(2)}`,
        item.quantity,
        `${item.gstRate}%`,
        `Rs. ${item.amount.toFixed(2)}`,
        `Rs. ${(item.cgst + item.sgst).toFixed(2)}`,
        `Rs. ${item.totalWithTax.toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: 50,
        head: [["#", "Product", "Unit Price", "Qty", "GST %", "Amount", "Tax", "Total"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
        styles: { fontSize: 9 },
      });

      const finalY = (doc as any).lastAutoTable.finalY || 50;

      doc.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, 140, finalY + 10);
      doc.text(`Total GST: Rs. ${(totalCgst + totalSgst).toFixed(2)}`, 140, finalY + 16);

      if (discountValue > 0) {
        doc.text(`Discount (${discountType === 'percent' ? discountValue + '%' : 'Rs.'}): -Rs. ${discountAmount.toFixed(2)}`, 140, finalY + 22);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 58, 138);
        doc.text(`Grand Total: Rs. ${totalAmount.toFixed(2)}`, 140, finalY + 32);
      } else {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 58, 138);
        doc.text(`Grand Total: Rs. ${totalAmount.toFixed(2)}`, 140, finalY + 26);
      }

      doc.save(`${invoiceNumber}.pdf`);
      toast.success("Invoice PDF generated & saved successfully!");

      setTodayCount(prev => prev + 1);
      setItems([]);
      setCustomerName("");
      setDiscountValue(0);
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Make sure jspdf is installed correctly.");
    }
  };

  const columns = [
    {
      header: "Product",
      accessorKey: "product",
      cell: (item: any) => <span className="font-medium text-sm">{item.product.name}</span>
    },
    {
      header: "Unit Price (₹)",
      accessorKey: "unitPrice",
      cell: (item: any) => <span className="text-sm">₹{(item.unitPrice).toFixed(2)}</span>
    },
    {
      header: "Qty",
      accessorKey: "quantity",
      cell: (item: any) => (
        <Input
          type="number"
          value={item.quantity}
          min={1}
          onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
          className="w-20 h-8 text-sm"
        />
      )
    },
    {
      header: "Amount (₹)",
      accessorKey: "amount",
      cell: (item: any) => <span className="text-sm font-medium">₹{(item.amount).toFixed(2)}</span>
    },
    {
      header: "GST",
      accessorKey: "gst",
      cell: (item: any) => (
        <div className="flex flex-col text-xs text-muted-foreground">
          <span className="font-semibold">{item.gstRate}%</span>
          <span>C: ₹{item.cgst.toFixed(2)}</span>
          <span>S: ₹{item.sgst.toFixed(2)}</span>
        </div>
      )
    },
    {
      header: "",
      accessorKey: "actions",
      cell: (item: any) => (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveItem(item.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">ITR Filing & Billing</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">Generate invoices and manage tax filings.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle>Invoice Details</CardTitle>
              <div className="text-sm font-medium text-muted-foreground">
                {invoiceNumber}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input
                    placeholder="Enter customer name"
                    value={customerName}
                    required
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              </div>

              <div className="px-6 pb-4 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Items</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" /> Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Item to Invoice</DialogTitle>
                      <DialogDescription>
                        Select a product from your catalog to add it to the current invoice.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Product</Label>
                        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} - ₹{product.price.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={selectedQuantity}
                          onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddItem} disabled={!selectedProductId}>Add to Invoice</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="border-y">
                {calculatedItems.length > 0 ? (
                  <DataTable columns={columns} data={calculatedItems} />
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No items added yet. Click "Add Item" to begin.
                  </div>
                )}
              </div>

              <div className="p-6 bg-muted/20 border-t flex justify-end">
                <div className="w-[300px] space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total GST</span>
                    <span className="font-medium text-muted-foreground">₹{(totalCgst + totalSgst).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm py-2">
                    <span className="text-muted-foreground">Discount</span>
                    <div className="flex items-center gap-2">
                      <Select value={discountType} onValueChange={(val: "amount" | "percent") => setDiscountType(val)}>
                        <SelectTrigger className="w-16 h-8 text-xs px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="amount">₹</SelectItem>
                          <SelectItem value="percent">%</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={discountValue === 0 ? '' : discountValue}
                        onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                        className="w-20 h-8 text-right text-xs"
                      />
                    </div>
                  </div>
                  {discountValue > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Discount Applied</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total</span>
                    <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted border-t p-6 flex justify-end gap-4 rounded-b-lg">
              <Button className="gap-2 font-bold shadow-lg" onClick={downloadPDF}>
                <FileText className="h-4 w-4" /> Generate Bill/Invoice
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvoices.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No recent invoices generated yet.
                  </div>
                ) : (
                  recentInvoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer bg-card">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{inv.invoiceNumber}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(inv.date), 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">₹{inv.grandTotal.toFixed(2)}</p>
                        <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">{inv.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
