import Image from "next/image";
import { CameraIcon } from "@/components/ui/minimal-graphics";

interface GalleryImage {
  id: string;
  image_url: string;
  caption?: string | null;
}

interface EventGalleryProps {
  images: GalleryImage[];
  title?: string;
}

export default function EventGallery({
  images,
  title = "Good times, documented.",
}: EventGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-10">
      <div className="flex items-center gap-2 mb-6">
        <CameraIcon size={20} className="text-pink" />
        <h3 className="font-display text-2xl font-bold text-navy">{title}</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-navy/10 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <Image
              src={img.image_url}
              alt={img.caption || "Event moment"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3 text-cream text-xs font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
