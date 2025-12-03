import React from "react";

const ReturnsRefunds = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-5 sm:px-10">
      {/* PAGE HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <p className="text-sm text-gray-500">Home / Returns & Refunds</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#970c10] mt-3">
          Returns & Refunds – Aspire Beauty
        </h1>
        <p className="text-gray-700 mt-3 text-lg">
          At Aspire Beauty, we aim to ensure your complete satisfaction with our
          products and services. If you are not fully happy with your purchase,
          please review our Returns & Refunds Policy below.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 sm:p-10 space-y-8 border border-gray-200">

        {/* 1. Eligibility */}
        <section>
          <h2 className="text-2xl font-semibold text-[#001B3D] flex items-center gap-2">
            <i className="fa-solid fa-check-circle text-[#970c10]"></i>
            1. Eligibility for Returns
          </h2>
          <ul className="mt-3 space-y-2 text-gray-700 list-disc list-inside">
            <li>The product is unused, unopened, and in its original packaging</li>
            <li>The return request is made within 7–14 days of delivery</li>
            <li>The product is in the same condition as delivered</li>
            <li>Proof of purchase (invoice or order number) is provided</li>
          </ul>
          <p className="mt-3 text-gray-700">
            Certain products such as personal care items, used cosmetics, opened
            skincare products, or hygiene-related items cannot be returned due
            to safety reasons.
          </p>
        </section>

        {/* 2. Non-Returnable Items */}
        <section>
          <h2 className="text-2xl font-semibold text-[#001B3D] flex items-center gap-2">
            <i className="fa-solid fa-ban text-[#970c10]"></i>
            2. Non-Returnable Items
          </h2>
          <ul className="mt-3 space-y-2 text-gray-700 list-disc list-inside">
            <li>Used or opened beauty products</li>
            <li>Items purchased during sale or promotional offers</li>
            <li>Gift cards or vouchers</li>
            <li>Products damaged due to customer misuse or mishandling</li>
          </ul>
        </section>

        {/* 3. Return Process */}
        <section>
          <h2 className="text-2xl font-semibold text-[#001B3D] flex items-center gap-2">
            <i className="fa-solid fa-rotate-left text-[#970c10]"></i>
            3. Return Process
          </h2>
          <ol className="mt-3 space-y-2 text-gray-700 list-decimal list-inside">
            <li>Provide your order number and reason for return</li>
            <li>Our support team will review and approve eligible requests</li>
            <li>Ship the product back to our provided return address</li>
            <li>
              Once inspected, we will update you on the refund status
            </li>
          </ol>
          <p className="mt-3 text-gray-700">
            Customers are responsible for return shipping charges unless the
            item received was damaged or incorrect.
          </p>
        </section>

        {/* 4. Damaged or Wrong Product */}
        <section>
          <h2 className="text-2xl font-semibold text-[#001B3D] flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation text-[#970c10]"></i>
            4. Damaged or Wrong Product Delivery
          </h2>
          <ul className="mt-3 space-y-2 text-gray-700 list-disc list-inside">
            <li>Contact us within 48 hours of delivery</li>
            <li>Share clear photos or videos of the issue</li>
            <li>
              We will process a replacement or full refund at no extra cost
            </li>
          </ul>
        </section>

        {/* 5. Refunds */}
        <section>
          <h2 className="text-2xl font-semibold text-[#001B3D] flex items-center gap-2">
            <i className="fa-solid fa-money-bill-wave text-[#970c10]"></i>
            5. Refunds
          </h2>
          <p className="mt-3 text-gray-700">
            Once your returned product is inspected and approved, your refund
            will be processed to your:
          </p>
          <ul className="mt-3 space-y-2 text-gray-700 list-disc list-inside">
            <li>Original payment method</li>
            <li>Bank account</li>
            <li>Wallet/Store credit (if applicable)</li>
          </ul>
          <p className="mt-3 text-gray-700">
            Refund processing may take 5–7 business days, depending on your
            payment provider.
          </p>
        </section>

        {/* 6. Cancellation Policy */}
        <section>
          <h2 className="text-2xl font-semibold text-[#001B3D] flex items-center gap-2">
            <i className="fa-solid fa-circle-xmark text-[#970c10]"></i>
            6. Cancellation Policy
          </h2>
          <ul className="mt-3 space-y-2 text-gray-700 list-disc list-inside">
            <li>You may cancel an order before it is shipped.</li>
            <li>
              Once shipped, cancellations are not possible, but you may initiate
              a return after delivery (if eligible).
            </li>
            <li>
              Appointments for services must be cancelled at least 24 hours in
              advance.
            </li>
          </ul>
        </section>

        {/* CONTACT SECTION */}
        <section className="pt-5 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-[#001B3D] flex items-center gap-2">
            <i className="fa-solid fa-headset text-[#970c10]"></i>
            Contact Us
          </h2>

          <p className="text-gray-700 mt-3">
            If you have any questions about this Returns & Refunds Policy, you
            can contact us:
          </p>

          <div className="mt-3 space-y-2 text-gray-800">
            <p>
              <i className="fa-solid fa-envelope text-[#970c10] mr-2"></i>
              <strong>Email:</strong> info@aspirebeauty.com
            </p>

            <p>
              <i className="fa-solid fa-phone text-[#970c10] mr-2"></i>
              <strong>Phone:</strong> 040-4519-5642
            </p>
          </div>
        </section>
      </div>

      {/* FONT AWESOME */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
    </div>
  );
};

export default ReturnsRefunds;
