// Server Action requests are capped at 1MB, so photos are shrunk in the browser.
export const MAX_PHOTO_DATA_URL_LENGTH = 700_000;

export async function resizeImageToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not supported.");

  for (let maxSide = 1000; maxSide >= 250; maxSide /= 2) {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    // JPEG has no transparency, so paint a white background first
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
    if (dataUrl.length <= MAX_PHOTO_DATA_URL_LENGTH) {
      bitmap.close();
      return dataUrl;
    }
  }

  bitmap.close();
  throw new Error("Image is too large.");
}
