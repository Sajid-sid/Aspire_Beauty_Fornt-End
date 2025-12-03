import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ScrollContainer = ({ children }) => {
  const containerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [canCenter, setCanCenter] = useState(true);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const contentWidth = el.scrollWidth;
    const containerWidth = el.clientWidth;

    // 👉 If content fits inside container, center it
    setCanCenter(contentWidth <= containerWidth);

    // 👉 Show arrows only if overflow
    setShowLeft(el.scrollLeft > 0);
    setShowRight(contentWidth > containerWidth + el.scrollLeft);
  };

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 350, behavior: "smooth" });
  };

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;

    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div className="relative w-full">

      {/* Left Arrow */}
      {!canCenter && showLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-20"
        >
          <FaChevronLeft size={18} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className={`
          flex gap-8 px-10 py-2 overflow-x-auto scrollbar-hide scroll-smooth
          ${canCenter ? "justify-center" : "justify-start"}
        `}
      >
        {children}
      </div>

      {/* Right Arrow */}
      {!canCenter && showRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-20"
        >
          <FaChevronRight size={18} />
        </button>
      )}
    </div>
  );
};

export default ScrollContainer;
