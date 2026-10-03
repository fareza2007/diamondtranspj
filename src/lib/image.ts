import sharp from "sharp";

const MAX_BYTES = 4 * 1024 * 1024;

export async function processCarImage(file: File) {
  if (!file || file.size === 0) {
    throw new Error("Foto tidak ditemukan.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran foto maksimal 4 MB.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  const output = await sharp(input)
    .rotate()
    .resize(1400, 900, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 72 })
    .toBuffer();

  return `data:image/webp;base64,${output.toString("base64")}`;
}

export function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (value == null || value === "") return null;
  const n = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function parseRequiredNumber(value: FormDataEntryValue | null, fallback = 0) {
  const n = parseOptionalNumber(value);
  return n ?? fallback;
}

export function startingPrice(input: {
  price_lepas_kunci: number | null;
  price_dengan_sopir: number | null;
  price_lepas_kunci_gp: number | null;
  price_dengan_sopir_gp: number | null;
}) {
  const prices = [
    input.price_lepas_kunci,
    input.price_dengan_sopir,
    input.price_lepas_kunci_gp,
    input.price_dengan_sopir_gp,
  ].filter((n): n is number => typeof n === "number" && n > 0);
  return prices.length ? Math.min(...prices) : 0;
}
