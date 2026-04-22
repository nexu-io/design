import { Button } from "@nexu-design/ui-web";
import { X } from "lucide-react";
import { useEffect } from "react";

import type { ContentBlock } from "@/types";

interface ContentDetailOverlayProps {
  block: ContentBlock | null;
  onClose: () => void;
}

export function ContentDetailOverlay({
  block,
  onClose,
}: ContentDetailOverlayProps): React.ReactElement | null {
  useEffect(() => {
    if (!block) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [block, onClose]);

  if (!block) return null;

  if (block.type === "image") {
    return <ImageLightbox url={block.url} alt={block.alt} onClose={onClose} />;
  }

  if (block.type === "video") {
    return (
      <VideoLightbox
        url={block.url}
        thumbnail={block.thumbnail}
        title={block.title}
        onClose={onClose}
      />
    );
  }

  return null;
}

function VideoLightbox({
  url,
  thumbnail,
  title,
  onClose,
}: {
  url?: string;
  thumbnail: string;
  title: string;
  onClose: () => void;
}): React.ReactElement {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
      >
        <X className="h-5 w-5" />
      </Button>
      <div className="max-w-[90vw] max-h-[85vh] p-4" onMouseDown={(e) => e.stopPropagation()}>
        {url ? (
          <video
            src={url}
            poster={thumbnail}
            controls
            autoPlay
            className="max-w-[88vw] max-h-[80vh] rounded-lg shadow-2xl bg-black"
          />
        ) : (
          <img
            src={thumbnail}
            alt={title}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        )}
        <p className="text-sm text-white/50 text-center mt-3">{title}</p>
      </div>
    </div>
  );
}

function ImageLightbox({
  url,
  alt,
  onClose,
}: { url: string; alt?: string; onClose: () => void }): React.ReactElement {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
      >
        <X className="h-5 w-5" />
      </Button>
      <div className="max-w-[90vw] max-h-[85vh] p-4" onMouseDown={(e) => e.stopPropagation()}>
        <img
          src={url}
          alt={alt ?? ""}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />
        {alt && <p className="text-sm text-white/50 text-center mt-3">{alt}</p>}
      </div>
    </div>
  );
}
