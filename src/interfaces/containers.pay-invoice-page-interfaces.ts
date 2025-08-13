export interface PayInvoicePageInterface {
  invoiceNumber?: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientPhoneNumber?: string;
  clientEmailAddress: string;
  serviceTitle: string;
  serviceDescription: string;
  dueDate: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}
