import { createHash, randomBytes } from "crypto";

export function GenerateInvoiceNumber(): string {
  const timestamp = Date.now();
  const randomData = randomBytes(8);
  const secret =
    process.env.INVOICE_SECRET ||
    "CA_INV_2025_x9K#mP$7nQ@4wE*8uR!5tY&2hB^9cV+6zL";

  const hashInput = `${timestamp}-${randomData.toString("hex")}-${process.pid}`;
  const hash = createHash("sha256")
    .update(hashInput + secret)
    .digest("hex");

  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < 12; i++) {
    const byteValue = parseInt(hash.substr(i * 2, 2), 16);
    result += chars[byteValue % chars.length];
  }

  return `inv-${result.substr(0, 4)}-${result.substr(4, 4)}-${result.substr(
    8,
    4
  )}`;
}
