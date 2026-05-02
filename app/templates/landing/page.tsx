import Link from "next/link"
import { Check, CreditCard, Github, Globe, Layout } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="container sticky top-0 z-40 bg-background">
                <div className="flex h-16 items-center justify-between border-b py-4">
                    <div className="flex gap-6 md:gap-10">
                        <Link href="#" className="flex items-center space-x-2">
                            <span className="inline-block font-bold">Acme Inc</span>
                        </Link>
                        <nav className="flex gap-6">
                            <Link
                                href="#"
                                className="flex items-center text-sm font-medium text-muted-foreground"
                            >
                                Features
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center text-sm font-medium text-muted-foreground"
                            >
                                Pricing
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center text-sm font-medium text-muted-foreground"
                            >
                                About
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm">
                            Log in
                        </Button>
                        <Button size="sm">Sign up</Button>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                    <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                            An example landing page built with efficient components.
                        </h1>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            I&apos;m building a web app with Next.js 13 and Tailwind CSS.
                            Follow along as we figure this out together.
                        </p>
                        <div className="space-x-4">
                            <Link href="#" className={buttonVariants({ size: "lg" })}>
                                Get Started
                            </Link>
                            <Link
                                href="#"
                                target="_blank"
                                rel="noreferrer"
                                className={buttonVariants({ variant: "outline", size: "lg" })}
                            >
                                GitHub
                            </Link>
                        </div>
                    </div>
                </section>
                <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                            Features
                        </h2>
                        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                            This project is an experiment to see how a modern app, with features like auth, subscriptions, API routes, and static pages would work in Next.js 13 app dir.
                        </p>
                    </div>
                    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                                <Layout className="h-12 w-12" />
                                <div className="space-y-2">
                                    <h3 className="font-bold">Next.js 13</h3>
                                    <p className="text-sm text-muted-foreground">
                                        App dir, Routing, Layouts, Loading UI and API routes.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                                <CreditCard className="h-12 w-12" />
                                <div className="space-y-2">
                                    <h3 className="font-bold">React 18</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Server and Client Components. Use new features.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                                <Globe className="h-12 w-12" />
                                <div className="space-y-2">
                                    <h3 className="font-bold">Components</h3>
                                    <p className="text-sm text-muted-foreground">
                                        UI components built using Radix UI and styled with Tailwind CSS.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                                <CreditCard className="h-12 w-12" />
                                <div className="space-y-2">
                                    <h3 className="font-bold">Authentication</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Authentication using NextAuth.js and middlewares.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                                <Layout className="h-12 w-12" />
                                <div className="space-y-2">
                                    <h3 className="font-bold">Database</h3>
                                    <p className="text-sm text-muted-foreground">
                                        ORM using Prisma and deployed on PlanetScale.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                                <Globe className="h-12 w-12" />
                                <div className="space-y-2">
                                    <h3 className="font-bold">Subscriptions</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Free and paid subscriptions using Stripe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto text-center md:max-w-[58rem]">
                        <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                            Taxonomy also includes a blog and a full-featured documentation site built using Contentlayer and MDX.
                        </p>
                    </div>
                </section>
            </main>
            <footer className="container">
                <div className="flex flex-col items-center justify-between gap-4 border-t py-10 md:h-24 md:flex-row md:py-0">
                    <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                        <p className="text-center text-sm leading-loose md:text-left">
                            Built by <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">mick</a>. The source code is available on <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">GitHub</a>.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
