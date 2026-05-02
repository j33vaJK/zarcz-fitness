import Link from "next/link"
import { ArrowRight, LayoutDashboard, Lock, FileText, Database, CreditCard } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const templates = [
    {
        title: "Authentication",
        description: "Login and registration forms with social auth options.",
        href: "/templates/auth",
        icon: Lock,
    },
    {
        title: "Dashboard",
        description: "Admin dashboard with sidebar, charts, and activity feed.",
        href: "/templates/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Landing Page",
        description: "Modern landing page with hero, features, and footer.",
        href: "/templates/landing",
        icon: CreditCard,
    },
    {
        title: "Forms & Inputs",
        description: "Comprehensive showcase of form elements and validations.",
        href: "/templates/forms",
        icon: FileText,
    },
    {
        title: "Data Display",
        description: "Tables, lists, and other ways to display data.",
        href: "/templates/data-display",
        icon: Database,
    },
]

export default function TemplatesPage() {
    return (
        <div className="container py-10">
            <div className="mx-auto max-w-[58rem] text-center">
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                    Templates & Examples
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    A collection of ready-to-use templates and examples built with our UI components.
                    Copy and paste into your apps.
                </p>
            </div>
            <div className="mx-auto grid max-w-[64rem] grid-cols-1 gap-4 pt-12 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                    <Card key={template.href} className="flex flex-col justify-between">
                        <CardHeader>
                            <template.icon className="h-8 w-8 text-primary mb-2" />
                            <CardTitle>{template.title}</CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Link href={template.href as any} className={buttonVariants({ variant: "ghost", className: "w-full justify-start pl-0" })}>
                                View Template
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
