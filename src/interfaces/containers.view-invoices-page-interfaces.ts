export interface Invoice {
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
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
