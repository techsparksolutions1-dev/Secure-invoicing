import { NextRequest, NextResponse } from "next/server";

import { createInvoice } from "@/database/database";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const invoiceData = {
      invoiceNumber: data.invoiceNumber,
      clientId: data.clientId,
      clientName: data.clientName,
      clientPhoneNumber: data.clientPhoneNumber,
      clientEmailAddress: data.clientEmailAddress,
      serviceTitle: data.serviceTitle,
      serviceDescription: data.serviceDescription,
      dueDate: new Date(data.dueDate),
      totalAmount: parseFloat(data.totalAmount),
    };

    const invoice = await createInvoice(invoiceData);

    return NextResponse.json({
      success: true,
      invoice,
      shareableUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/pay-invoice/${invoice.invoiceNumber}`,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
