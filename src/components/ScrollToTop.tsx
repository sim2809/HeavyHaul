import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-20 right-5 md:bottom-6 md:right-6 z-50 h-12 w-12 rounded-full bg-gradient-amber text-secondary shadow-cta hover:brightness-110 transition flex items-center justify-center border-2 border-secondary/20"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
};

export default ScrollToTop;
