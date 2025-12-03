import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Terms & Conditions
      </h1>

      <p className="text-gray-700 leading-relaxed mb-6">
        Welcome to Aspire Beauty. By accessing or using our website and services,
        you agree to the terms and conditions outlined below. Please read them
        carefully. If you do not agree with any part of these terms, kindly stop
        using our website immediately.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Use of Our Website
      </h2>
      <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6">
        <li>Engage in any activity that may harm the website or its users.</li>
        <li>Attempt to access restricted areas without authorization.</li>
        <li>Use our content for commercial purposes without permission.</li>
        <li>Introduce viruses, malware, or harmful code.</li>
      </ul>

      {/* Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Products & Services
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Aspire Beauty offers beauty-related services and products. All
        descriptions, pricing, and availability are subject to change at any
        time without prior notice.
      </p>
      <p className="text-gray-700 leading-relaxed mb-6">
        We reserve the right to:
      </p>
      <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6">
        <li>Modify or discontinue any product or service.</li>
        <li>Limit orders or refuse service at our discretion.</li>
      </ul>

      {/* Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        User Accounts
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        If you create an account on our website, you are responsible for:
      </p>
      <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6">
        <li>Maintaining the confidentiality of your login details.</li>
        <li>All activities that occur under your account.</li>
      </ul>
      <p className="text-gray-700 leading-relaxed mb-6">
        We reserve the right to suspend or terminate accounts that violate our
        policies.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Intellectual Property
      </h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        All content on this website—including logos, images, text, graphics,
        videos, and design—is the property of Aspire Beauty. You may not copy,
        reproduce, distribute, or use our content without written permission.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Third-Party Links
      </h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        Our website may include links to third-party websites. We are not
        responsible for the content, accuracy, or policies of those websites.
        Accessing them is at your own risk.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Pricing & Payments
      </h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        Prices for services or products are listed on the website and may be
        updated at any time. By making a purchase, you agree to provide accurate
        payment information and authorize the transaction.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Appointments & Cancellations
      </h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        If you book an appointment, you agree to follow our booking and
        cancellation policy. Missed or late cancellations may result in a fee.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Limitation of Liability
      </h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        Aspire Beauty is not liable for any direct or indirect damages, loss of
        data, service interruptions, or issues resulting from unauthorized
        access. Your use of the website is entirely at your own risk.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Disclaimer
      </h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        All beauty services, recommendations, and product information are
        provided for general purposes. Results may vary depending on skin type,
        usage, and other factors. Always consult a professional if needed.
      </p>

      {/* Contact Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">
        Contact Us
      </h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        If you have any questions about these Terms & Conditions, you can
        contact us:
      </p>
      <ul className="list-disc list-inside text-gray-700 leading-relaxed">
        <li>Email: info@aspirebeauty.com</li>
        <li>Phone: 040-4519-5642</li>
      </ul>
    </div>
  );
};

export default TermsAndConditions;
