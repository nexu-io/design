import { ImageAttachment } from "@nexu-design/ui-web";

const image =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect width="640" height="400" fill="%23e2e8f0"/><circle cx="180" cy="140" r="44" fill="%2394a3b8"/><path d="M60 320l120-120 90 90 70-60 120 90H60z" fill="%2364748b"/></svg>';

export function ImageAttachmentBasicExample() {
  return (
    <ImageAttachment
      src={image}
      alt="Latency chart"
      width={360}
      height={220}
      caption="P99 latency jumped during the deploy window."
    />
  );
}
