export interface PayInvoicePageInterface {
  invoiceNumber: string;
  invoice?: InvoiceData;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientPhoneNumber: string | null;
  clientEmailAddress: string;
  serviceTitle: string;
  serviceDescription: string;
  dueDate: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
