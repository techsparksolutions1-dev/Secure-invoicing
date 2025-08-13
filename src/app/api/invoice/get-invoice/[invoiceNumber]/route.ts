import { NextRequest, NextResponse } from "next/server";

import { getInvoiceByNumber } from "@/database/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { invoiceNumber: string } }
) {
  try {
    const invoice = await getInvoiceByNumber(params.invoiceNumber);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}
