import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/database/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { invoiceNumber: string } }
) {
  try {
    const { invoiceNumber } = params;

    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    await prisma.invoice.delete({
      where: { invoiceNumber },
    });

    return NextResponse.json({
      success: true,
      message: "Invoice deleted successfully",
      deletedInvoice: existingInvoice,
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
