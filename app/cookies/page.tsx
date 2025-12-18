import { Cookie } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Cookie Policy
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
                1. What Are Cookies?
              </h2>
              <p className="text-slate-600 mb-4">
                Cookies are small text files that are stored on your device when you visit a website.
                They help websites remember your preferences and improve your browsing experience.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                2. How We Use Cookies
              </h2>
              <p className="text-slate-600 mb-4">
                GreenLine AI uses cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Keep you signed in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve our services and user experience</li>
                <li>Provide relevant content and features</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                3. Types of Cookies We Use
              </h2>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                Essential Cookies
              </h3>
              <p className="text-slate-600 mb-4">
                These cookies are necessary for the website to function properly. They enable
                core functionality such as security, account access, and session management.
                You cannot opt out of these cookies.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                Functional Cookies
              </h3>
              <p className="text-slate-600 mb-4">
                These cookies remember your choices and preferences to provide enhanced features.
                For example, they remember your login information and language preferences.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                Analytics Cookies
              </h3>
              <p className="text-slate-600 mb-4">
                We use analytics cookies to understand how visitors interact with our website.
                This helps us improve our services and user experience. These cookies collect
                anonymous information about page visits, traffic sources, and user behavior.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                Marketing Cookies
              </h3>
              <p className="text-slate-600 mb-4">
                These cookies may be used to deliver relevant advertisements and track the
                effectiveness of our marketing campaigns. They remember that you have visited
                our website and may share this information with advertising partners.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                4. Third-Party Cookies
              </h2>
              <p className="text-slate-600 mb-4">
                Some cookies are placed by third-party services that appear on our pages.
                These may include:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Google Analytics for website analytics</li>
                <li>Stripe for payment processing</li>
                <li>Supabase for authentication</li>
                <li>Other service providers we use to operate our platform</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                5. Managing Cookies
              </h2>
              <p className="text-slate-600 mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>
                  <strong>Browser settings:</strong> Most browsers allow you to refuse or
                  delete cookies through their settings menu
                </li>
                <li>
                  <strong>Opt-out tools:</strong> You can opt out of analytics and advertising
                  cookies through industry opt-out tools
                </li>
                <li>
                  <strong>Device settings:</strong> Mobile devices offer settings to limit
                  tracking and ad targeting
                </li>
              </ul>
              <p className="text-slate-600 mb-4">
                Please note that disabling cookies may affect the functionality of our website
                and prevent certain features from working properly.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                6. Cookie Retention
              </h2>
              <p className="text-slate-600 mb-4">
                Different cookies are retained for different periods:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>
                  <strong>Session cookies:</strong> Deleted when you close your browser
                </li>
                <li>
                  <strong>Persistent cookies:</strong> Remain on your device for a set period
                  (typically 30 days to 2 years) or until you delete them
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                7. Updates to This Policy
              </h2>
              <p className="text-slate-600 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our
                practices or for legal, operational, or regulatory reasons. We encourage you
                to review this page periodically.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                8. Contact Us
              </h2>
              <p className="text-slate-600 mb-4">
                If you have questions about our use of cookies, please contact us at:
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
