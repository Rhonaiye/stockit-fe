import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background py-20">
            <div className="container max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-12">
                    <FiArrowLeft /> Back to Home
                </Link>

                <h1 className="h1 mb-8">Privacy Policy</h1>
                <p className="text-foreground-muted mb-12 text-lg">Last updated: January 2026</p>

                <div className="space-y-12 text-lg leading-relaxed text-foreground/80">
                    <section>
                        <h2 className="h3 mb-4 text-foreground">1. Introduction</h2>
                        <p>
                            At StockIt, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our inventory management platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="h3 mb-4 text-foreground">2. Information We Collect</h2>
                        <p className="mb-4">We collect information that helps us provide you with the best experience:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Personal Data:</strong> Name, email address, phone number, and business details provided during registration.</li>
                            <li><strong>Financial Data:</strong> Payment information processed through our secure payment providers (we do not store credit card details).</li>
                            <li><strong>Operational Data:</strong> Inventory levels, sales records, supplier details, and employee information you upload to the system.</li>
                            <li><strong>Usage Data:</strong> Information about how you interact with our platform, including IP address, browser type, and access times.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="h3 mb-4 text-foreground">3. How We Use Your Data</h2>
                        <p>
                            We use the collected data to operate, maintain, and improve the Service. Specifically, to process transactions, send administrative notifications, provide customer support, and generate aggregated (non-identifiable) analytics to improve our technology.
                        </p>
                    </section>

                    <section>
                        <h2 className="h3 mb-4 text-foreground">4. Data Isolation & Security</h2>
                        <p>
                            StockIt employs a multi-tenant architecture where your business data is logically isolated. We use robust encryption (AES-256) for data at rest and strictly enforce SSL/TLS for data in transit. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="h3 mb-4 text-foreground">5. Sharing of Information</h2>
                        <p>
                            We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and advertisers.
                        </p>
                    </section>

                    <section>
                        <h2 className="h3 mb-4 text-foreground">6. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal data stored on our platform. You can export your inventory and sales data at any time via the dashboard.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-border">
                        <h2 className="h3 mb-4 text-foreground">Contact Us</h2>
                        <p>
                            If you have any questions or concerns about this Privacy Policy, please contact us at privacy@stockit.ng.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
