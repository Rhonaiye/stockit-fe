import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background py-20">
            <div className="container max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-12">
                    <FiArrowLeft /> Back to Home
                </Link>

                <h1 className="h1 mb-8">Terms of Service</h1>
                <p className="text-foreground-muted mb-12 text-lg">Last updated: January 2026</p>

                <div className="space-y-12 text-lg leading-relaxed text-foreground/80">
                    <section>
                        <h2 className="h3 mb-4 text-foreground">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using StockIt (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. These terms constitute a legally binding agreement between you and StockIt regarding your use of the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="h3 mb-4 text-foreground">2. Description of Service</h2>
                        <p>
                            StockIt provides a cloud-based inventory management and point-of-sale system for retail businesses. We offer tools for stock tracking, sales reporting, supplier management, and multi-branch operations. We reserve the right to modify, suspend, or discontinue any part of the Service at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="h3 mb-4 text-foreground">3. Account Registration & Security</h2>
                        <p>
                            To use StockIt, you must register for an account. You agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your password and account details. You are fully responsible for all activities that occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="h3 mb-4 text-foreground">4. Subscription & Payments</h2>
                        <p>
                            Usage of StockIt is subject to subscription fees based on your selected plan (Starter, Business Pro, or Enterprise). Payments are billed in advance on a monthly or yearly basis. All fees are non-refundable unless otherwise stated by law. Failure to pay may result in temporary suspension of your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="h3 mb-4 text-foreground">5. Data Ownership & Privacy</h2>
                        <p>
                            You retain ownership of all data you upload to the Service. By using StockIt, you grant us a license to host, copy, and display your data strictly as required to provide the Service. We implement industry-standard security measures to protect your data, but we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="h3 mb-4 text-foreground">6. Limitation of Liability</h2>
                        <p>
                            StockIt shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="h3 mb-4 text-foreground">7. Termination</h2>
                        <p>
                            We may terminate or suspend your account immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-border">
                        <h2 className="h3 mb-4 text-foreground">Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at legal@stockit.ng.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
