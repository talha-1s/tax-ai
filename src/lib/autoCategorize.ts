export function autoCategorize(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes("uber") || desc.includes("train")) return "Transport";
  if (desc.includes("tesco") || desc.includes("sainsbury")) return "Groceries";
  if (desc.includes("stripe") || desc.includes("client")) return "Income";
  if (desc.includes("rent") || desc.includes("mortgage")) return "Housing";
  return "Other";
}
