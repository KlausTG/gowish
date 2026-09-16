export type ValidationResult<T = void> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function validateTitle(value: string): ValidationResult<string> {
  const trimmed = value.trim();
  if (trimmed.length < 1) {
    return { ok: false, error: "Title is required" };
  }
  if (trimmed.length > 75) {
    return { ok: false, error: "Title must be 75 characters or less" };
  }
  return { ok: true, value: trimmed };
}

/** Hard ceiling in major units. High enough for real gifts, low enough to reject impractical prices. */
const MAX_PRICE_MAJOR = 1_000_000;

export function parsePriceMajorInput(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const major = Number.parseFloat(normalized);
  if (!Number.isFinite(major)) return null;
  return major;
}

export function validatePriceInput(value: string): ValidationResult<number> {
  const major = parsePriceMajorInput(value);
  if (major === null) {
    return { ok: false, error: "Enter a valid price" };
  }
  if (major <= 0) {
    return { ok: false, error: "Price must be greater than zero" };
  }
  if (major > MAX_PRICE_MAJOR) {
    return { ok: false, error: "Price must be 1.000.000 or less" };
  }
  const priceMinor = Math.round(major * 100);
  if (priceMinor < 1) {
    return { ok: false, error: "Price must be at least 0,01" };
  }
  return { ok: true, value: priceMinor };
}

export function validateUrl(
  value: string
): ValidationResult<string | undefined> {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: true, value: undefined };
  }

  let candidate = trimmed;
  if (/^www\./i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { ok: false, error: "URL must start with http:// or https://" };
    }
    if (!parsed.hostname.includes(".")) {
      return { ok: false, error: "Enter a valid web address" };
    }
    return { ok: true, value: parsed.toString() };
  } catch {
    return { ok: false, error: "Enter a valid web address" };
  }
}
