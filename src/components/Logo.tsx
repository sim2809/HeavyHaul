import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import logoImg from "@/assets/logo-hhg-white.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, size = "md" }: LogoProps) => {
  const h = size === "sm" ? "h-12" : size === "lg" ? "h-28 sm:h-32" : "h-16 sm:h-20 lg:h-24";
  return (
    <Link to="/" className={cn("inline-flex items-center select-none", className)} aria-label="Heavy Haul Group home">
      <img
        src={logoImg}
        alt="Heavy Haul Group logo"
        className={cn(h, "w-auto object-contain")}
        width={600}
        height={360}
      />
    </Link>
  );
};

export default Logo;
