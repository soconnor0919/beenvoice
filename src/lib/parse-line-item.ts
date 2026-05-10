export interface ParsedLineItem {
  description: string;
  hours: number | null;
  rate: number | null;
}

export function parseLineItem(input: string): ParsedLineItem {
  let text = input.trim();
  let hours: number | null = null;
  let rate: number | null = null;

  // Extract hours: "3h", "3hr", "3hrs", "3 hours", "3.5hours"
  const hoursMatch = /(\d+\.?\d*)\s*h(?:ours?|rs?)\b/i.exec(text);
  if (hoursMatch?.[0] && hoursMatch[1]) {
    hours = parseFloat(hoursMatch[1]);
    text = text.replace(hoursMatch[0], " ").trim();
  }

  // Extract rate: "@120", "@$120", "at 120", "at $120", "$120/hr", "$120ph"
  const rateMatch = /(?:@\s*\$?|at\s+\$?)(\d+\.?\d*)|(\$\d+\.?\d*)(?:\/h(?:rs?)?|ph)?\b/i.exec(text);
  if (rateMatch?.[0]) {
    const rawRate = rateMatch[1] ?? rateMatch[2] ?? "";
    rate = parseFloat(rawRate.replace("$", ""));
    text = text.replace(rateMatch[0], " ").trim();
  }

  const description = text.replace(/\s+/g, " ").replace(/^[\s,]+|[\s,]+$/g, "").trim();

  return { description: description || input.trim(), hours, rate };
}
