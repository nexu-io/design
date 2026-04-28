import { VideoAttachment } from "@nexu-design/ui-web";

const thumbnail =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="%230f172a"/><circle cx="320" cy="180" r="42" fill="%23ffffff" fill-opacity="0.85"/><path d="M305 155l42 25-42 25z" fill="%230f172a"/></svg>';

export function VideoAttachmentBasicExample() {
  return (
    <VideoAttachment
      thumbnail={thumbnail}
      duration="02:37"
      title="Bug-2174-repro.mp4"
      meta="8.4 MB"
    />
  );
}
