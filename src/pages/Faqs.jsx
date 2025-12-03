import React, { useState } from "react";

const Faqs = () => {
  const [active, setActive] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is Aspire Beauty?",
      description:
        "Aspire Beauty is a beauty service and product brand offering premium skincare, makeup, grooming, and beauty treatments designed to enhance your natural glow.",
    },
    {
      id: 2,
      question: "What is your return and refund policy?",
      description:
        "We accept returns for unused and unopened products within 7–14 days of purchase. Refunds are processed after inspection. Full policy is available on our Returns & Refunds page.",
    },
    {
      id: 3,
      question: "Do you offer gift cards or vouchers?",
      description:
        "Yes, Aspire Beauty offers digital and physical gift cards that can be used for services or products.",
    },
    {
      id: 4,
      question: "Where is Aspire Beauty located?",
      description:
        "We operate from Hyderabad, and also offer online booking for services. You can find all contact details on our Contact page.",
    },
    {
      id: 5,
      question: "Do I need to register to book a service?",
      description:
        "Registration is not mandatory. You can book directly without creating an account. However, creating an account helps you track appointments and receive offers.",
    },
    {
      id: 6,
      question: "Are your products safe for all skin types?",
      description:
        "Yes, our products are carefully selected and suitable for most skin types. For sensitive skin, we recommend a patch test or consultation before use.",
    },
    {
      id: 7,
      question: "How do I track my product order?",
      description:
        "Once your order is placed, you will receive an email/SMS with tracking details until your package is delivered.",
    },
    {
      id: 8,
      question: "How can I contact customer support?",
      description:
        "You can reach us by email: info@aspirebeauty.com or by phone: 040-4519-5642.",
    },
  ];

  const toggle = (id) => {
    setActive(active === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto my-20 px-4">
      <h3 className="text-3xl font-semibold text-center mb-10 text-gray-800">
        Frequently Asked Questions
      </h3>

      <div className="space-y-5">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className={`rounded-2xl border transition-all duration-300 p-5 shadow-sm hover:shadow-lg cursor-pointer ${
              active === faq.id
                ? "border-[#03619E] bg-white"
                : "border-gray-200 bg-gradient-to-br from-gray-50 to-white"
            }`}
            onClick={() => toggle(faq.id)}
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-800">
                {faq.question}
              </p>

              {/* Arrow */}
              <span
                className={`text-[#03619E] font-bold transform transition-transform duration-300 text-xl ${
                  active === faq.id ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </div>

            {/* Description */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                active === faq.id ? "max-h-40 mt-3" : "max-h-0"
              }`}
            >
              <p className="text-gray-600 leading-relaxed">
                {faq.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
