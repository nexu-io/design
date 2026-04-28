import { ImageGallery } from "@nexu-design/ui-web";

const images = Array.from({ length: 6 }).map((_, index) => ({
  src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23${["dbeafe", "e9d5ff", "dcfce7", "fee2e2", "fef3c7", "e2e8f0"][index]}"/><text x="100" y="108" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="%230f172a">${index + 1}</text></svg>`,
  alt: `Screenshot ${index + 1}`,
}));

export function ImageGalleryBasicExample() {
  return <ImageGallery images={images} />;
}
