import { renderMark } from "./_assets/mark";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return renderMark(size.width);
}
