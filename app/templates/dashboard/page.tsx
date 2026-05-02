"use client"

import {
    Activity,
    CreditCard,
    DollarSign,
    Users,
    Search,
    MoreHorizontal,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <a href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                        <Activity className="h-6 w-6" />
                        <span className="sr-only">Acme Inc</span>
                    </a>
                    <a href="#" className="text-foreground transition-colors hover:text-foreground">
                        Dashboard
                    </a>
                    <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                        Orders
                    </a>
                    <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                        Products
                    </a>
                    <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                        Customers
                    </a>
                    <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                        Analytics
                    </a>
                </nav>
                <Sheet>
                    <SheetTrigger className={buttonVariants({ variant: "outline", size: "icon", className: "shrink-0 md:hidden" })}>
                        <Activity className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <a href="#" className="flex items-center gap-2 text-lg font-semibold">
                                <Activity className="h-6 w-6" />
                                <span className="sr-only">Acme Inc</span>
                            </a>
                            <a href="#" className="hover:text-foreground">
                                Dashboard
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground">
                                Orders
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground">
                                Products
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground">
                                Customers
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground">
                                Analytics
                            </a>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                            />
                        </div>
                    </form>
                    <DropdownMenu>
                        <DropdownMenuTrigger className={buttonVariants({ variant: "secondary", size: "icon", className: "rounded-full" })}>
                            <Users className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Subscriptions
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+2350</div>
                            <p className="text-xs text-muted-foreground">
                                +180.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12,234</div>
                            <p className="text-xs text-muted-foreground">
                                +19% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+573</div>
                            <p className="text-xs text-muted-foreground">
                                +201 since last hour
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                                <CardTitle>Transactions</CardTitle>
                                <CardDescription>
                                    Recent transactions from your store.
                                </CardDescription>
                            </div>
                            <a href="#" className={buttonVariants({ size: "sm", className: "ml-auto gap-1" })}>
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </a>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead className="hidden xl:table-cell">
                                            Type
                                        </TableHead>
                                        <TableHead className="hidden xl:table-cell">
                                            Status
                                        </TableHead>
                                        <TableHead className="hidden xl:table-cell">
                                            Date
                                        </TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <div className="font-medium">Liam Johnson</div>
                                            <div className="hidden text-sm text-muted-foreground md:inline">
                                                liam@example.com
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            Sale
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Approved</span>
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            2023-06-23
                                        </TableCell>
                                        <TableCell className="text-right">$250.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <div className="font-medium">Olivia Smith</div>
                                            <div className="hidden text-sm text-muted-foreground md:inline">
                                                olivia@example.com
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            Refund
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Declined</span>
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            2023-06-24
                                        </TableCell>
                                        <TableCell className="text-right">$150.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <div className="font-medium">Noah Williams</div>
                                            <div className="hidden text-sm text-muted-foreground md:inline">
                                                noah@example.com
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            Subscription
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Approved</span>
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            2023-06-25
                                        </TableCell>
                                        <TableCell className="text-right">$350.00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Sales</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-8">
                            <div className="flex items-center gap-4">
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none">
                                        Olivia Martin
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        olivia.martin@email.com
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">+$1,999.00</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none">
                                        Jackson Lee
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        jackson.lee@email.com
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">+$39.00</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none">
                                        Isabella Nguyen
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        isabella.nguyen@email.com
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">+$299.00</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

function ArrowUpRight(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
        </svg>
    )
}
