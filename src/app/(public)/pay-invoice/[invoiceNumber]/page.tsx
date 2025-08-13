import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { InvoiceData } from "@/interfaces/containers.pay-invoice-page-interfaces";

import PayInvoicePage from "@/containers/pay-invoice-page";
import { getInvoiceByNumber } from "@/database/database";
import { GetPageMetadata } from "@/utils/meta-data";

interface PageProps {
  params: {
    invoiceNumber: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { invoiceNumber } = params;
  const invoice = await getInvoiceByNumber(invoiceNumber);

  if (!invoice) {
    return GetPageMetadata({
      title: "Invoice Not Found | Code Aura",
      description: "The requested invoice could not be found.",
      robots: { index: false, follow: false },
    });
  }

  return GetPageMetadata({
    title: `Pay Invoice #${invoiceNumber} | Code Aura - Secure Invoicing`,
    description: `Secure payment for invoice #${invoiceNumber}. Complete your payment quickly and safely through our encrypted checkout system.`,
  });
}

export default async function PayInvoice({ params }: PageProps) {
  const { invoiceNumber } = params;
  const invoice = await getInvoiceByNumber(invoiceNumber);

  if (!invoice) {
    notFound();
  }

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
      invoiceNumber={invoiceNumber}
      invoice={transformedInvoice}
    />
  );
} 
