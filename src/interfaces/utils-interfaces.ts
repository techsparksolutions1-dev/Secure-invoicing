export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments?: any[];
}

export interface InvoiceEmailData {
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
  paidAt?: string;
}
