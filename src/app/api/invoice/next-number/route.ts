import { NextResponse } from "next/server";

import { prisma } from "@/database/prisma";

import { GenerateInvoiceNumber } from "@/utils/generate-invoice-number";

async function ensureUniqueInvoiceNumber(): Promise<string> {
  let invoiceNumber: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    invoiceNumber = GenerateInvoiceNumber();
    attempts++;

    const existing = await prisma.invoice.findUnique({
      where: { invoiceNumber },
    });

    if (!existing) {
      return invoiceNumber;
    }

    if (attempts >= maxAttempts) {
      throw new Error(
        "Unable to generate unique invoice number after multiple attempts"
      );
    }
  } while (true);
}

export async function GET() {
  try {
    const invoiceNumber = await ensureUniqueInvoiceNumber();
    return NextResponse.json({ invoiceNumber });
  } catch (error) {
    console.error("Invoice number generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice number" },
      { status: 500 }
    );
  }
}
