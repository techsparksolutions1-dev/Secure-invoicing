"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

import {
  InvoiceData,
  PayInvoicePageInterface,
} from "@/interfaces/containers.pay-invoice-page-interfaces";

import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  SendInvoiceReceiptToClient,
  SendInvoiceNotificationToAdmin,
} from "@/services/invoice-email.service";

import { IoMdCloseCircle } from "react-icons/io";

function PayInvoicePage({
  invoiceNumber,
  invoice: prefetchedInvoice,
}: PayInvoicePageInterface) {
  const [isLoading, setIsLoading] = useState(!prefetchedInvoice);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(
    prefetchedInvoice || null
  );
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if (!clientId) {
    console.error("PayPal client ID is missing");
  }

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/invoice/get-invoice/${invoiceNumber}`
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch invoice");
        }

        if (result.success && result.invoice) {
          setInvoiceData(result.invoice);
        } else {
          throw new Error("Invoice not found");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        toast.error("Invoice Not Found", {
          description:
            "We couldn't find the invoice you're looking for. Please check the invoice number and try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (prefetchedInvoice) {
      setIsLoading(false);
      return;
    }

    if (invoiceNumber && !prefetchedInvoice) {
      fetchInvoiceData();
    }
  }, [invoiceNumber, prefetchedInvoice]);

  // HANDLE PAYPAL ORDER CREATION
  const createOrder = async (
    _data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    if (!invoiceData?.totalAmount) {
      throw new Error("Invoice data is not available");
    }

    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: invoiceData.serviceTitle,
          reference_id: invoiceData.invoiceNumber,
          amount: {
            value: invoiceData.totalAmount.toFixed(2),
            currency_code: "USD",
            breakdown: {
              item_total: {
                value: invoiceData.totalAmount.toFixed(2),
                currency_code: "USD",
              },
            },
          },
          items: [
            {
              name: invoiceData.serviceTitle,
              quantity: "1",
              unit_amount: {
                value: invoiceData.totalAmount.toFixed(2),
                currency_code: "USD",
              },
              category: "DIGITAL_GOODS",
            },
          ],
        },
      ],
      application_context: {
        brand_name: "Code Aura",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    });
  };

  // HANDLE SUCCESSFUL PAYMENT
  const onApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ): Promise<void> => {
    try {
      setPaymentProcessing(true);

      if (!actions.order) {
        throw new Error("Order actions not available");
      }

      const orderDetails = await actions.order.capture();
      console.log("Payment successful:", orderDetails);

      const paymentConfirmationData = {
        invoiceNumber: invoiceNumber,
        paypalOrderId: orderDetails.id,
        paymentStatus: orderDetails.status,
        paymentAmount: invoiceData?.totalAmount,
        payerEmail: orderDetails.payer?.email_address,
        transactionId:
          orderDetails.purchase_units?.[0]?.payments?.captures?.[0]?.id,
      };

      const response = await fetch("/api/invoice/mark-paid-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentConfirmationData),
      });

      const result = await response.json();

      if (result.success && invoiceData) {
        const invoiceWithPaymentData = {
          ...invoiceData,
          paidAt: new Date().toISOString(),
          paypalOrderId: orderDetails.id,
        };

        setInvoiceData(invoiceWithPaymentData);

        const [clientEmailSent, adminEmailSent] = await Promise.allSettled([
          SendInvoiceReceiptToClient(invoiceWithPaymentData),
          SendInvoiceNotificationToAdmin(invoiceWithPaymentData),
        ]);

        if (clientEmailSent.status === "fulfilled" && clientEmailSent.value) {
          console.log("Receipt email sent to client successfully");
        } else {
          console.error("Failed to send receipt email to client");
        }

        if (adminEmailSent.status === "fulfilled" && adminEmailSent.value) {
          console.log("Notification email sent to admin successfully");
        } else {
          console.error("Failed to send notification email to admin");
        }

        toast.success("Payment Successful", {
          description:
            "Thank you! Your payment has been received and a receipt has been sent to your email.",
        });

        router.push(`/payment-success?token=${result.accessToken}`);
      } else {
        throw new Error(result.error || "Failed to confirm payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment Failed", {
        description:
          "There was an issue processing your payment. Please try again or contact support.",
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <main className="layout-standard section-margin-standard">
      <h1 className="md:text-5xl text-4xl tracking-tighter font-medium font-poppins text-heading !leading-[120%]">
        Invoice Payment -{" "}
        <span className="text-primary">Complete Your Checkout</span>
      </h1>

      <Separator className="mt-7 border-border max-md:mb-7" />

      <div className="grid xl:grid-cols-3 grid-cols-1 md:mt-8 gap-16 md:items-center">
        <div className="xl:col-span-2 col-span-1 xl:order-1 order-2">
          <div className="mb-8 max-xl:hidden">
            <h2 className="text-2xl font-semibold mb-4 text-heading">
              Pay for Your Invoice
            </h2>
            <p className="text-paragraph mb-6">
              You are making a secure payment to <strong>Code Aura</strong>.
              Please review the invoice details on the right before proceeding.
              Once payment is confirmed, a receipt will be emailed to you.
            </p>
          </div>

          {/* PAYPAL MERCHANT */}
          <div className="w-full flex justify-center">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full bg-muted" />
            ) : (
              <div className="w-[800px]">
                {clientId && invoiceData ? (
                  <PayPalScriptProvider
                    options={{
                      clientId,
                      components: "buttons",
                      currency: "USD",
                    }}
                  >
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                      }}
                      disabled={paymentProcessing}
                      createOrder={createOrder}
                      onApprove={onApprove}
                    />
                  </PayPalScriptProvider>
                ) : error ? (
                  <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-red-800">
                      <IoMdCloseCircle /> Unable to load payment options
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <p className="text-paragraph text-sm">
              Once your payment is successfully completed, we will send you a
              digital receipt along with a confirmation email. Your service will
              be marked as paid in our system, and our team will immediately
              begin work based on the service details mentioned in your invoice.
              For any questions, feel free to contact us at{" "}
              <strong>info@codeaura.us</strong>.
            </p>
          </div>
        </div>

        <div className="col-span-1 xl:order-2 order-1">
          <div className="mb-8 xl:hidden">
            <h2 className="text-2xl font-semibold mb-2 text-heading">
              Pay for Your Invoice
            </h2>
            <p className="text-paragraph mb-6 text-sm">
              You are making a secure payment to <strong>Code Aura</strong>.
              Please review the invoice details on the right before proceeding.
              Once payment is confirmed, a receipt will be emailed to you.
            </p>
          </div>

          <Card className="border-border sticky top-6 max-xl:w-[500px] max-md:w-full">
            <CardHeader>
              <h3 className="text-2xl font-semibold text-heading">
                Order Summary
              </h3>
              {isLoading ? (
                <Skeleton className="h-6 w-full bg-muted" />
              ) : invoiceData ? (
                <p className="text-sm text-muted-foreground">
                  Invoice #{invoiceData.invoiceNumber}
                </p>
              ) : (
                <p className="text-sm text-red-500">Invoice not found</p>
              )}
            </CardHeader>

            <Separator className="border-border w-[95%] mx-auto mb-4" />

            <CardContent className="space-y-4 md:text-base text-sm">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-full bg-muted" />
                  <Skeleton className="h-6 w-full bg-muted" />
                  <Skeleton className="h-6 w-full bg-muted" />
                  <Skeleton className="h-6 w-full bg-muted" />
                  <Skeleton className="h-6 w-full bg-muted" />
                  <Skeleton className="h-6 w-full bg-muted" />
                </>
              ) : invoiceData ? (
                <>
                  <div className="flex justify-between">
                    <span>Client ID:</span>
                    <span className="font-medium text-heading">
                      {invoiceData.clientId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Client Name:</span>
                    <span className="font-medium text-heading">
                      {invoiceData.clientName}
                    </span>
                  </div>
                  {invoiceData.clientPhoneNumber && (
                    <div className="flex justify-between">
                      <span>Phone Number:</span>
                      <span className="text-heading">
                        {invoiceData.clientPhoneNumber}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Email Address:</span>
                    <span className="text-heading">
                      {invoiceData.clientEmailAddress}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Providing:</span>
                    <span className="text-heading">
                      {invoiceData.serviceTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span>
                      {new Date(invoiceData.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center text-red-500">
                  <p>Invoice not found or error loading data</p>
                </div>
              )}
            </CardContent>

            <Separator className="border-border w-[95%] mx-auto mb-4" />

            <CardFooter className="flex justify-between md:text-lg text-base font-semibold text-heading">
              {isLoading ? (
                <Skeleton className="h-6 w-full bg-muted" />
              ) : invoiceData ? (
                <>
                  <span>Total Amount:</span>
                  <span>${invoiceData.totalAmount.toLocaleString()}</span>
                </>
              ) : (
                <span className="text-red-500">Amount unavailable</span>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default PayInvoicePage;
