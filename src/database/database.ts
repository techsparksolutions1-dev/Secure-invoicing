import { prisma } from "./prisma";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export async function createInvoice(data: any) {
  return await prisma.invoice.create({ data });
}

export async function getInvoiceByNumber(invoiceNumber: string) {
  return await prisma.invoice.findUnique({
    where: { invoiceNumber },
  });
}
