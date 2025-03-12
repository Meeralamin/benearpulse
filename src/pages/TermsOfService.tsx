import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";

const TermsOfService = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the ParentConnect application and related
                services (collectively, the "Service"), you agree to be bound by
                these Terms of Service. If you do not agree to these terms,
                please do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. Description of Service
              </h2>
              <p>
                ParentConnect provides a real-time video monitoring solution
                that allows parents to initiate secure video connections with
                their children's devices. The Service includes features such as
                instant video connections, background activation, privacy
                controls, and activity logging.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. Account Registration
              </h2>
              <p>
                To use certain features of the Service, you must register for an
                account. You agree to provide accurate, current, and complete
                information during the registration process and to update such
                information to keep it accurate, current, and complete.
              </p>
              <p>
                You are responsible for safeguarding your password and for all
                activities that occur under your account. You agree to notify us
                immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. Subscription and Payment
              </h2>
              <p>
                Some features of the Service require a paid subscription. By
                subscribing to our Service, you agree to pay all fees in
                accordance with the pricing and payment terms presented to you
                at the time of purchase.
              </p>
              <p>
                Subscriptions automatically renew unless canceled at least 24
                hours before the end of the current billing period. You can
                cancel your subscription at any time through your account
                settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
              <p>
                You agree to use the Service only for lawful purposes and in
                accordance with these Terms. You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  For monitoring individuals without their knowledge or consent,
                  except for your minor children for whom you are the legal
                  guardian
                </li>
                <li>
                  In any way that violates any applicable federal, state, local,
                  or international law or regulation
                </li>
                <li>
                  To transmit, or procure the sending of, any advertising or
                  promotional material, including any "junk mail", "chain
                  letter", "spam", or any other similar solicitation
                </li>
                <li>
                  To impersonate or attempt to impersonate another person or
                  entity
                </li>
                <li>
                  To engage in any other conduct that restricts or inhibits
                  anyone's use or enjoyment of the Service
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Privacy</h2>
              <p>
                Your privacy is important to us. Our{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>{" "}
                explains how we collect, use, and protect your personal
                information. By using our Service, you agree to the collection
                and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                7. Intellectual Property
              </h2>
              <p>
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                ParentConnect and its licensors. The Service is protected by
                copyright, trademark, and other laws of both the United States
                and foreign countries.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice or liability, for any
                reason whatsoever, including without limitation if you breach
                these Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will immediately
                cease. If you wish to terminate your account, you may simply
                discontinue using the Service or delete your account through the
                account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                9. Limitation of Liability
              </h2>
              <p>
                In no event shall ParentConnect, its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                10. Changes to Terms
              </h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will provide at least 30 days' notice prior to any new terms
                taking effect. What constitutes a material change will be
                determined at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-disc pl-6">
                <li>
                  By email:{" "}
                  <a
                    href="mailto:terms@parentconnect.com"
                    className="text-blue-600 hover:underline"
                  >
                    terms@parentconnect.com
                  </a>
                </li>
                <li>
                  By visiting our{" "}
                  <Link to="/contact" className="text-blue-600 hover:underline">
                    contact page
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
