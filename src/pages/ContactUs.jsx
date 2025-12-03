import React from "react";
// import Contactlogo from "./images/Contactlogo.webp";

const ContactUs = () => {
  return (
    <>
      {/* HERO IMAGE */}
      {/* <div className="w-full h-[45vh] overflow-hidden mt-3 sm:h-[50vh]">
        <img
          src={Contactlogo}
          alt="Welcome"
          className="w-full h-full object-cover object-center"
        />
      </div> */}

      {/* TOP TEXT SECTION */}
      <div className="text-center px-4 max-w-4xl mx-auto my-10">
        <p className="text-3xl font-bold mb-4 text-[#001B3D]">
          Let’s Work Together
        </p>

        <p className="text-lg text-gray-700 leading-relaxed">
          Working together to use standardized systems for creating
          customer-aligned strategies and client-focused solutions.
          Look for us at
          <a
            href="https://aspireths.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#970c10] font-semibold ml-1 hover:underline"
          >
            Aspire Tekhub Solutions
          </a>
        </p>
      </div>

      {/* FORM + MAP WRAPPER */}
      <div className="flex flex-col lg:flex-row justify-center gap-10 px-5 lg:px-20 mb-16">

        {/* CONTACT FORM */}
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
          <form className="space-y-4">

            {/* Name */}
            <div>
              <label className="font-semibold block mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold block mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-200"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="font-semibold block mb-1">Phone</label>
              <div className="flex gap-3 max-sm:flex-col">
                <select className="border border-gray-300 rounded-lg px-3 py-2 w-32 max-sm:w-full">
                  <option value="+91">IND +91</option>
                  <option value="+971">AE +971</option>
                  <option value="+65">SG +65</option>
                  <option value="+61">AUS +61</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+33">FRA +33</option>
                </select>

                <input
                  type="tel"
                  placeholder="Phone number"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-200"
                />
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="font-semibold block mb-1">Select a Service</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-200">
                <option value="">Choose a service</option>
                <option value="web">Website Development</option>
                <option value="mobile">Mobile App Development</option>
                <option value="uiux">UI/UX Design</option>
                <option value="dm">Digital Marketing</option>
                <option value="wp">WordPress Development</option>
                <option value="consulting">IT Consulting</option>
                <option value="ecom">E-Commerce Development</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="font-semibold block mb-1">
                Comment or Message
              </label>
              <textarea
                rows="5"
                placeholder="Write your message here..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-200"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-1/2 max-sm:w-3/4 bg-[#c1a37f] hover:bg-[#a89272] text-[#970c10] font-semibold py-2 rounded-lg block mx-auto"
            >
              Submit
            </button>
          </form>
        </div>

        {/* MAP SECTION */}
        <div className="w-full max-w-lg text-center">

          {/* MAP */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.096609824811!2d78.4770754750791!3d17.443239383942746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91cfa64620af%3A0x77e498cab170fc7a!2sAspire%20Tekhub%20Solutions%20Pvt%20Limited!5e0!3m2!1sen!2sin!4v1732017431103!5m2!1sen!2sin"
            className="w-full h-72 rounded-xl border-0 shadow-md"
            loading="lazy"
          ></iframe>

          {/* INFO TEXT */}
          <div className="mt-4">
            <p className="text-lg font-semibold">
              Current Location:{" "}
              <span className="font-bold">
                Aspire Tekhub Solutions Pvt Ltd
              </span>
            </p>

            <p className="text-blue-600 text-xl mt-2 font-medium">
              Contact Us for Quick Support...
            </p>

            <p className="text-gray-700 mt-2 font-medium">Telangana, INDIA</p>

            <p className="text-gray-600 max-w-md mx-auto mt-1">
              VK Towers, Sardar Patel Road, Rasoolpura, Secunderabad, Telangana
              500003
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex justify-center gap-6 mt-6 text-3xl">
              <a
                href="https://www.instagram.com/aspireths/?hl=en"
                target="_blank"
                className="text-pink-600 hover:scale-110 transition"
              >
                <i className="fab fa-instagram"></i>
              </a>

              <a
                href="https://www.facebook.com/people/Aspire-TekHub-Solutions/61565362786512/"
                target="_blank"
                className="text-blue-600 hover:scale-110 transition"
              >
                <i className="fab fa-facebook"></i>
              </a>

              <a
                href="https://www.linkedin.com/company/aspire-tekhub-solutions/?originalSubdomain=in"
                target="_blank"
                className="text-blue-700 hover:scale-110 transition"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FONT AWESOME CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
    </>
  );
};

export default ContactUs;
