import React from "react";
import banner1 from "../assets/banner-1.jpg";
import banner2 from "../assets/banner-2.jpg";

const Offers = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 my-20">
      {/* 1 column on mobile, 60:40 split on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6">
        
        
        <div
          className="relative flex flex-col justify-center items-start text-black overflow-hidden w-full h-64 sm:h-80 md:h-[400px] bg-center bg-cover"
          style={{ backgroundImage: `url(${banner1})` }}
        >
          <div className="relative z-10 px-6 sm:px-10">
            <h3 className="text-lg sm:text-xl font-semibold uppercase mb-2 tracking-wide">
              New Collection
            </h3>
            <h2 className="text-2xl sm:text-3xl font-bold leading-snug mb-4">
              Discover Our Autumn Skincare
            </h2>
            <button className="border border-black text-black px-5 py-2 rounded-full font-medium hover:bg-black hover:text-white transition">
              Explore More
            </button>
          </div>
        </div>

        
        <div
          className="relative flex flex-col justify-center items-start text-black overflow-hidden w-full h-64 sm:h-80 md:h-[400px] bg-center bg-cover"
          style={{ backgroundImage: `url(${banner2})` }}
        >
          <div className="relative z-10 px-6 sm:px-10">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              25% Off Everything
            </h3>
            <p className="text-sm sm:text-base mb-4 max-w-md">
              Makeup with extended range in colors for every human.
            </p>
            <button className="border border-black text-black px-5 py-2 rounded-full font-medium hover:bg-black hover:text-white transition">
              Shop Sale
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers;
