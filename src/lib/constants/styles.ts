export interface ArtStyle {
  id: string;
  previewImage: string;
}

export const ART_STYLES: ArtStyle[] = [
  { id: "cartoon", previewImage: "/styles/cartoon.png" },
  { id: "clay", previewImage: "/styles/clay.png" },
  { id: "watercolor", previewImage: "/styles/watercolor.png" },
  { id: "disney", previewImage: "/styles/disney.png" },
  { id: "pixel", previewImage: "/styles/pixel.png" },
  { id: "comic", previewImage: "/styles/comic.png" },
  { id: "ghibli", previewImage: "/styles/ghibli.png" },
  { id: "minimal", previewImage: "/styles/minimal.png" },
];
