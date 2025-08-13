export interface Invoice {
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
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
