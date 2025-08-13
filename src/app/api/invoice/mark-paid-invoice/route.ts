import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

import { getInvoiceByNumber } from "@/database/database";
import { prisma } from "@/database/prisma";

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json();
    const { invoiceNumber, paypalOrderId, paymentAmount } = paymentData;

    const invoice = await getInvoiceByNumber(invoiceNumber);
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    if (Math.abs(invoice.totalAmount - paymentAmount) > 0.01) {
      return NextResponse.json(
        { success: false, error: "Payment amount mismatch" },
        { status: 400 }
      );
    }

    const accessToken = generatePaymentToken(invoiceNumber, paypalOrderId);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.paymentToken.create({
      data: {
        token: accessToken,
        invoiceData: JSON.stringify({
          ...invoice,
          paidAt: new Date(),
          paypalOrderId,
        }),
        expiresAt,
      },
    });

    await prisma.invoice.delete({
      where: { invoiceNumber },
    });

    return NextResponse.json({
      success: true,
      accessToken,
      message: "Payment confirmed and invoice processed",
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}

function generatePaymentToken(
  invoiceNumber: string,
  paypalOrderId: string
): string {
  const secret =
    process.env.PAYMENT_SECRET ||
    "CA_PAY_2025_a3F#8jM$1nX@7qW*4eR!9tY&5hB^2cV+8zL";
  const timestamp = Date.now();
  return createHash("sha256")
    .update(`${invoiceNumber}-${paypalOrderId}-${timestamp}-${secret}`)
    .digest("hex")
    .substring(0, 32);
}
