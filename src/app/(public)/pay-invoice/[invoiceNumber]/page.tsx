import React from "react";
import { Metadata } from "next";

import PayInvoicePage from "@/containers/pay-invoice-page";

import { GetPageMetadata } from "@/utils/meta-data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const invoiceNumber = params?.invoiceNumber;

  return GetPageMetadata({
    title: `Pay Invoice #${invoiceNumber} | Code Aura - Secure Invoicing`,
    description:
      "Secure invoice payment processing. Complete your payment quickly and safely through our encrypted checkout system.",
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PayInvoice({ params }: any) {
  const invoiceNumber = params?.invoiceNumber;

  return <PayInvoicePage invoiceNumber={invoiceNumber} />;
}
