import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 py-16 text-gray-800">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-[#03619E] mb-6">
        Privacy Policy
      </h1>

      <p className="text-center text-gray-600 mb-10 leading-relaxed">
        At Aspire Beauty, we are committed to protecting your privacy and ensuring a safe online experience.
        This Privacy Policy explains how we collect, use, store, and safeguard your information when you visit
        our website or interact with our services.
      </p>

      {/* Sections */}
      <div className="space-y-8">

        {/* 1. Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold text-[#03619E] mb-3">
            1. Information We Collect
          </h2>

          <p className="mb-2 font-medium">a. Personal Information</p>
          <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Contact details submitted through forms</li>
          </ul>

          <p className="mb-2 font-medium">b. Non-Personal Information</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Browser type</li>
            <li>IP address</li>
            <li>Device information</li>
            <li>Pages visited</li>
            <li>Time spent on the website</li>
          </ul>
        </section>

        {/* 2. How We Use Your Information */}
        <section>
          <h2 className="text-2xl font-semibold text-[#03619E] mb-3">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Provide and improve our services</li>
            <li>Respond to your inquiries</li>
            <li>Personalize your browsing experience</li>
            <li>Enhance website performance</li>
            <li>Send updates, offers, or newsletters (only with your consent)</li>
            <li>Maintain website security</li>
          </ul>
        </section>

        {/* 3. Sharing of Information */}
        <section>
          <h2 className="text-2xl font-semibold text-[#03619E] mb-3">
            3. Sharing of Information
          </h2>
          <p className="text-gray-700 mb-3">
            We do not sell or trade your personal information.  
            We may share data only with:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Trusted service providers who help us operate our website</li>
            <li>Legal authorities when required by law</li>
            <li>Analytics tools for website performance monitoring</li>
          </ul>

          <p className="text-gray-600 mt-2">
            All third parties are required to maintain confidentiality and data security.
          </p>
        </section>

        {/* 4. Data Security */}
        <section>
          <h2 className="text-2xl font-semibold text-[#03619E] mb-3">
            4. Data Security
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We use advanced security measures to protect your information from unauthorized access, loss, or misuse.
            However, no online transmission is 100% secure, and we cannot guarantee absolute protection.
          </p>
        </section>

        {/* 5. Your Rights */}
        <section>
          <h2 className="text-2xl font-semibold text-[#03619E] mb-3">
            5. Your Rights
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Access your personal information</li>
            <li>Request corrections or updates</li>
            <li>Ask for deletion of your data</li>
            <li>Opt out of marketing communications</li>
          </ul>
          <p className="text-gray-600 mt-2">
            You may contact us anytime for assistance.
          </p>
        </section>

        {/* 6. External Links */}
        <section>
          <h2 className="text-2xl font-semibold text-[#03619E] mb-3">
            6. External Links
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Our website may contain links to third-party sites. We are not responsible for their privacy
            practices or content. Please review their privacy policies separately.
          </p>
        </section>

        {/* 7. Children’s Privacy */}
        <section>
          <h2 className="text-2xl font-semibold text-[#03619E] mb-3">
            7. Children’s Privacy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We do not knowingly collect personal information from children under 13. If you believe a child
            has provided data, please contact us for immediate removal.
          </p>
        </section>

        {/* 8. Changes */}
        <section>
          <h2 className="text-2xl font-semibold text-[#03619E] mb-3">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy occasionally. Any changes will be posted on this page with an
            updated “Last Updated” date.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-[#03619E] mb-3">
            Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy, you can contact us:
          </p>

          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            <li>
              <strong>Email:</strong> info@aspirebeauty.com
            </li>
            <li>
              <strong>Phone:</strong> 040-4519-5642
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
