import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/database/prisma";

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  try {
    const { token } = params;

    const paymentToken = await prisma.paymentToken.findUnique({
      where: { token },
    });

    if (!paymentToken) {
      return NextResponse.json(
        { success: false, error: "Invalid access token" },
        { status: 404 }
      );
    }

    if (new Date() > paymentToken.expiresAt) {
      await prisma.paymentToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { success: false, error: "Access token expired" },
        { status: 410 }
      );
    }

    const invoiceData = JSON.parse(paymentToken.invoiceData);

    return NextResponse.json({
      success: true,
      invoiceData,
    });
  } catch (error) {
    console.error("Error fetching payment receipt:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch receipt" },
      { status: 500 }
    );
  }
}
