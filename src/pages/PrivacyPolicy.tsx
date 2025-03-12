import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p>
                ParentConnect ("we", "our", or "us") is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                parent-child monitoring application and related services
                (collectively, the "Service").
              </p>
              <p>
                Please read this Privacy Policy carefully. By using the Service,
                you agree to the collection and use of information in accordance
                with this policy. If you do not agree with our policies and
                practices, do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Information We Collect
              </h2>
              <p>
                We collect several types of information from and about users of
                our Service:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Personal Information:</strong> We may collect
                  personally identifiable information such as your name, email
                  address, phone number, and payment information when you
                  register for an account or subscribe to our Service.
                </li>
                <li>
                  <strong>Device Information:</strong> We collect information
                  about the devices you register with our Service, including
                  device names, identifiers, and connection status.
                </li>
                <li>
                  <strong>Usage Data:</strong> We collect information about how
                  you use the Service, including monitoring sessions, feature
                  usage, and activity logs.
                </li>
                <li>
                  <strong>Video and Audio Data:</strong> During active
                  monitoring sessions, video and audio data is transmitted
                  between parent and child devices. This data is transmitted in
                  real-time and is not stored on our servers unless specifically
                  requested as part of a recording feature.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and send related information</li>
                <li>
                  Send you technical notices, updates, security alerts, and
                  support messages
                </li>
                <li>Respond to your comments, questions, and requests</li>
                <li>
                  Monitor and analyze trends, usage, and activities in
                  connection with our Service
                </li>
                <li>Detect, prevent, and address technical issues</li>
                <li>
                  Protect the safety and security of children using our Service
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect the security of your personal information. However,
                please be aware that no method of transmission over the Internet
                or method of electronic storage is 100% secure.
              </p>
              <p>
                Video and audio streams between devices are encrypted end-to-end
                using WebRTC technology, meaning the content of these streams
                cannot be accessed by us or third parties during transmission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Children's Privacy
              </h2>
              <p>
                Our Service is designed to allow parents to monitor their
                children. We are committed to protecting the privacy of children
                and comply with all applicable laws and regulations regarding
                children's privacy.
              </p>
              <p>
                We do not knowingly collect personal information from children
                under 13 without parental consent. If you are a parent or
                guardian and believe we have collected information from your
                child without your consent, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="list-disc pl-6">
                <li>
                  By email:{" "}
                  <a
                    href="mailto:privacy@parentconnect.com"
                    className="text-blue-600 hover:underline"
                  >
                    privacy@parentconnect.com
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

export default PrivacyPolicy;
