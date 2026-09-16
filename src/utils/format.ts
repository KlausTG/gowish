export function formatPrice(priceMinor: number, currency: string): string {
  const major = priceMinor / 100;
  try {
    return new Intl.NumberFormat("da-DK", {
      style: "currency",
      currency,
    }).format(major);
  } catch {
    const formatted = major.toFixed(2).replace(".", ",");
    return `${formatted} ${currency}`;
  }
}

export function reservedByLabel(reservedBy: string | null): string | null {
  if (!reservedBy) return null;
  if (reservedBy === "you") return "Reserved by you";
  const name = reservedBy.charAt(0).toUpperCase() + reservedBy.slice(1);
  return `Reserved by ${name}`;
}
