import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { InvoiceData } from "@/interfaces/containers.pay-invoice-page-interfaces";
import { getInvoiceByNumber } from "@/database/database";
import PayInvoicePage from "@/containers/pay-invoice-page";

export const metadata: Metadata = {
  title: "Pay Invoice | Code Aura - Secure Invoicing",
  description:
    "Securely pay your invoice through our encrypted checkout system.",
};

interface PayInvoiceProps {
  params: { invoiceNumber: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function PayInvoice({ params }: PayInvoiceProps) {
  const invoice = await getInvoiceByNumber(params.invoiceNumber);

  if (!invoice) notFound();

  const transformedInvoice: InvoiceData = {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    clientId: invoice.clientId,
    clientName: invoice.clientName,
    clientPhoneNumber: invoice.clientPhoneNumber,
    clientEmailAddress: invoice.clientEmailAddress,
    serviceTitle: invoice.serviceTitle,
    serviceDescription: invoice.serviceDescription,
    dueDate: invoice.dueDate.toISOString(),
    totalAmount: invoice.totalAmount,
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
  };

  return (
    <PayInvoicePage
      invoiceNumber={params.invoiceNumber}
      invoice={transformedInvoice}
    />
  );
}
