import { Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Privacy Policy
              </h1>
            </div>
            <p className="text-slate-600">
              Last updated: December 2024
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                1. Introduction
              </h2>
              <p className="text-slate-600 mb-4">
                GreenLine AI ("we," "our," or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our AI voice agent services and website.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                Personal Information
              </h3>
              <p className="text-slate-600 mb-4">
                We may collect personal information that you voluntarily provide, including:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Business information (company name, industry, size)</li>
                <li>Account credentials</li>
                <li>Payment and billing information</li>
                <li>Communications with our team</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                Call Data
              </h3>
              <p className="text-slate-600 mb-4">
                When using our AI voice agent services, we collect:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Phone numbers of callers</li>
                <li>Call recordings and transcripts</li>
                <li>Information provided during calls (names, addresses, service requests)</li>
                <li>Call duration and timestamps</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-slate-600 mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Provide and maintain our AI voice agent services</li>
                <li>Process and manage your account</li>
                <li>Send you leads and call notifications</li>
                <li>Improve our services and develop new features</li>
                <li>Communicate with you about updates and support</li>
                <li>Process payments and billing</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <p className="text-slate-600 mb-4">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Service providers who assist in operating our services</li>
                <li>Professional advisors (lawyers, accountants)</li>
                <li>Law enforcement when required by law</li>
                <li>Business partners with your consent</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                5. Data Security
              </h2>
              <p className="text-slate-600 mb-4">
                We implement appropriate technical and organizational security measures to protect
                your information, including encryption, secure data storage, and access controls.
                However, no method of transmission over the Internet is 100% secure.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                6. Data Retention
              </h2>
              <p className="text-slate-600 mb-4">
                We retain your information for as long as necessary to provide our services and
                comply with legal obligations. Call recordings are typically retained for 90 days
                unless you request earlier deletion or longer retention.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                7. Your Rights
              </h2>
              <p className="text-slate-600 mb-4">
                Depending on your location, you may have rights to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to or restrict certain processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                8. Contact Us
              </h2>
              <p className="text-slate-600 mb-4">
                If you have questions about this Privacy Policy or our data practices,
                please contact us at:
              </p>
              <p className="text-slate-600 mb-4">
                <strong>GreenLine AI</strong><br />
                3129 S. Hacienda Blvd #524<br />
                Hacienda Heights, CA 91745<br />
                Email: contact@greenline-ai.com<br />
                Phone: (626) 225-8141
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-slate-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of
                significant changes by posting the new policy on this page and updating the
                "Last updated" date.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
