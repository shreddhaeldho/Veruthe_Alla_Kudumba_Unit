import Image from "next/image";
import { cn } from "@/lib/cn";

interface CutoutGraphicProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  animate?: "float" | "float-alt" | "none";
}

export function CutoutGraphic({
  src,
  alt,
  width = 80,
  height = 80,
  className,
  animate = "none",
}: CutoutGraphicProps) {
  return (
    <div
      className={cn(
        "select-none pointer-events-none",
        animate === "float" && "animate-float",
        animate === "float-alt" && "animate-float-alt",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain drop-shadow-md"
        draggable={false}
      />
    </div>
  );
}
