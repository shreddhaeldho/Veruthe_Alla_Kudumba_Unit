import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { img: 46, text: "text-base" },
  md: { img: 58, text: "text-lg" },
  lg: { img: 76, text: "text-xl" },
  xl: { img: 96, text: "text-2xl" },
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const s = sizes[size];

  return (
    <Link href="/" className={cn("flex items-center gap-3 group", className)}>
      <Image
        src="/images/logo.png"
        alt="Veruthe Alla Kudumba Unit"
        width={s.img}
        height={s.img}
        className="rounded-xl object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
        priority
      />
      {showText && (
        <div className="leading-tight">
          <span
            className={cn(
              "font-logo font-bold block text-navy tracking-wide",
              s.text
            )}
          >
            Véruthe Alla
          </span>
          <span
            className={cn(
              "font-logo font-bold block text-brown tracking-wide",
              s.text === "text-base"
                ? "text-sm"
                : s.text === "text-lg"
                ? "text-base"
                : s.text === "text-xl"
                ? "text-lg"
                : "text-xl"
            )}
          >
            Kudumba Unit
          </span>
        </div>
      )}
    </Link>
  );
}
