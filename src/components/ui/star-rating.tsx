"use client";

import { useState } from "react";
import { StarIcon } from "@/components/ui/minimal-graphics";

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 24,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayRating = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex items-center gap-1.5 select-none">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(null)}
            className={`transition-all ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}

          >
            <StarIcon
              size={size}
              className={`${
                isFilled
                  ? "text-amber-400 fill-amber-400"
                  : "text-navy/20 fill-transparent"
              } transition-colors duration-150`}
            />
          </button>
        );
      })}
    </div>
  );
}
