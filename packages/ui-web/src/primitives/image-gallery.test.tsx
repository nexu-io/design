import { fireEvent, render, screen } from "@testing-library/react";

import { ImageGallery } from "./image-gallery";

const images = Array.from({ length: 9 }).map((_, i) => ({
  src: `https://example.com/${i}.png`,
  alt: `shot ${i + 1}`,
}));

describe("ImageGallery", () => {
  it("folds overflow into a +N tile based on maxVisible", () => {
    render(<ImageGallery images={images} />);

    expect(screen.getAllByRole("img")).toHaveLength(6);
    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  it("calls onSelect with image and index when a tile is clicked", () => {
    const onSelect = vi.fn();

    render(<ImageGallery images={images.slice(0, 4)} onSelect={onSelect} />);

    fireEvent.click(screen.getAllByRole("button")[2]);
    expect(onSelect).toHaveBeenCalledWith(images[2], 2);
  });
});
