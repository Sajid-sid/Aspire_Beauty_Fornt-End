import React from "react";
import aboutImg from "../assets/about-banner.png"; // <-- Add any beauty banner image

const AboutUs = () => {

    console.log(new Date());

  return (
    <div className="bg-white text-[#001B3D]">

      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full h-[60vh] flex items-center justify-center">
        <img
          src={aboutImg}
          alt="about Aspire Beauty"
          className="absolute inset-0 w-full h-full object-cover "
        />

        <div className="relative z-10 backdrop-blur-sm bg-white/40 px-6 py-4 rounded-xl shadow-lg">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#001B3D] text-center">
            About Aspire Beauty
          </h1>
          <p className="text-center mt-3 text-lg text-[#001B3D]/80">
            Where Confidence Meets Beauty
          </p>
        </div>
      </section>

      {/* ---------- MAIN CONTENT ---------- */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-16 leading-relaxed">

        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <p className="text-lg text-[#001B3D]/80 mb-8">
          Here at Aspire Beauty, confidence and beauty go hand in hand. To us, 
          self-care is not just a routine—it is a celebration of uniqueness, 
          empowerment, and self-expression. Our passion lies in creating beauty 
          experiences that help you feel radiant from the inside out.
        </p>

        <p className="text-lg text-[#001B3D]/80 mb-8">
          Every product we offer—from luxurious skincare to vibrant makeup 
          essentials—is made with love, using safe, cruelty-free ingredients 
          that nourish your skin and enhance your natural glow. We believe beauty 
          should never compromise ethics, which is why sustainability, 
          responsibility, and innovation are at the heart of everything we do.
        </p>

        <p className="text-lg text-[#001B3D]/80 mb-8">
          Aspire Beauty stands for more than what meets the eye. It’s about 
          embracing individuality, boosting confidence, and celebrating the art 
          of self-expression. Whether you're experimenting with new looks or 
          elevating your daily routine, we’re here to support your beauty 
          journey.
        </p>

        <p className="text-lg text-[#001B3D]/80">
          Thank you for being a part of our community. Let’s continue this 
          beautiful journey of wellness, confidence, and self-love—together.
        </p>
      </section>

      {/* ---------- VALUES SECTION ---------- */}
      <section className="bg-[#FFF5F5] py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <h2 className="text-3xl font-bold text-center mb-10">What We Stand For</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Cruelty-Free Beauty</h3>
              <p className="text-[#001B3D]/70">
                Every product is made without harming animals — because beauty 
                should never come with cruelty.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Safe & Clean Ingredients</h3>
              <p className="text-[#001B3D]/70">
                We prioritize clean, skin-friendly formulations that nourish, 
                protect, and enhance your natural radiance.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Sustainability</h3>
              <p className="text-[#001B3D]/70">
                From packaging to production, we focus on eco-friendly practices 
                to protect our planet.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ---------- JOIN US Section ---------- */}
      <section className="py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Join Our Beauty Journey</h2>
        <p className="text-lg text-[#001B3D]/80 max-w-2xl mx-auto mb-8">
          Discover a world where beauty embraces confidence, individuality, and 
          self-love. Aspire Beauty is here to celebrate you—every step of the way.
        </p>

        <a
          href="/products"
          className="inline-block bg-[#FF5757] text-white px-10 py-3 rounded-full shadow-lg text-lg hover:bg-[#e14a4a] transition"
        >
          Explore Products
        </a>
      </section>

    </div>
  );
};

export default AboutUs;
