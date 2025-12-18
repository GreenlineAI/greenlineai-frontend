import { FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Terms of Service
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
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 mb-4">
                By accessing or using GreenLine AI's services, website, or AI voice agent platform
                ("Services"), you agree to be bound by these Terms of Service. If you do not agree
                to these terms, please do not use our Services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                2. Description of Services
              </h2>
              <p className="text-slate-600 mb-4">
                GreenLine AI provides AI-powered voice agent services designed for landscaping
                and home service businesses. Our Services include:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>24/7 AI phone answering</li>
                <li>Lead capture and management</li>
                <li>Appointment scheduling</li>
                <li>CRM dashboard and analytics</li>
                <li>Integration with third-party services</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                3. Account Registration
              </h2>
              <p className="text-slate-600 mb-4">
                To use our Services, you must create an account and provide accurate, complete
                information. You are responsible for maintaining the confidentiality of your
                account credentials and for all activities under your account.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                4. Subscription and Payment
              </h2>
              <p className="text-slate-600 mb-4">
                Our Services are offered on a subscription basis. By subscribing, you agree to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Pay all applicable fees according to your selected plan</li>
                <li>Provide valid payment information</li>
                <li>Authorize recurring billing for subscription renewals</li>
                <li>Pay for usage exceeding your plan's included minutes</li>
              </ul>
              <p className="text-slate-600 mb-4">
                Subscriptions automatically renew unless cancelled before the renewal date.
                Refunds are provided according to our refund policy.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                5. Acceptable Use
              </h2>
              <p className="text-slate-600 mb-4">
                You agree not to use our Services to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Transmit harmful, threatening, or harassing content</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our Services</li>
                <li>Use the Services for spam or unsolicited communications</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-slate-600 mb-4">
                All content, features, and functionality of our Services are owned by GreenLine AI
                and protected by intellectual property laws. You may not copy, modify, distribute,
                or create derivative works without our express written permission.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                7. Data and Privacy
              </h2>
              <p className="text-slate-600 mb-4">
                Your use of our Services is also governed by our Privacy Policy. By using our
                Services, you consent to the collection and use of information as described in
                our Privacy Policy.
              </p>
              <p className="text-slate-600 mb-4">
                You retain ownership of your business data and customer information. You grant
                us a limited license to use this data solely to provide and improve our Services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                8. Service Availability
              </h2>
              <p className="text-slate-600 mb-4">
                We strive to maintain high availability of our Services but do not guarantee
                uninterrupted access. We may perform maintenance or updates that temporarily
                affect availability. We are not liable for any downtime or service interruptions.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-slate-600 mb-4">
                To the maximum extent permitted by law, GreenLine AI shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages, including
                loss of profits, data, or business opportunities, arising from your use of our Services.
              </p>
              <p className="text-slate-600 mb-4">
                Our total liability shall not exceed the amount you paid for the Services in
                the twelve months preceding the claim.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                10. Indemnification
              </h2>
              <p className="text-slate-600 mb-4">
                You agree to indemnify and hold harmless GreenLine AI, its officers, directors,
                employees, and agents from any claims, damages, or expenses arising from your
                use of the Services or violation of these Terms.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                11. Termination
              </h2>
              <p className="text-slate-600 mb-4">
                Either party may terminate this agreement at any time. You may cancel your
                subscription through your account settings. We may suspend or terminate your
                account for violation of these Terms or for any other reason at our discretion.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                12. Governing Law
              </h2>
              <p className="text-slate-600 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of
                the State of California, without regard to conflict of law principles.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                13. Changes to Terms
              </h2>
              <p className="text-slate-600 mb-4">
                We reserve the right to modify these Terms at any time. We will notify you of
                significant changes via email or through our Services. Continued use after
                changes constitutes acceptance of the modified Terms.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                14. Contact Information
              </h2>
              <p className="text-slate-600 mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-slate-600 mb-4">
                <strong>GreenLine AI</strong><br />
                3129 S. Hacienda Blvd #524<br />
                Hacienda Heights, CA 91745<br />
                Email: contact@greenline-ai.com<br />
                Phone: (626) 225-8141
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
