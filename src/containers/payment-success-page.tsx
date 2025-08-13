"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import { InvoiceData } from "@/interfaces/containers.payment-success-page-interfaces";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { FaCheckCircle, FaDownload, FaEnvelope, FaPhone } from "react-icons/fa";
import Logo from "../../public/favicons/logo.svg";

function PaymentSuccessPage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const invoiceNumber = searchParams.get("invoice");
  const accessToken = searchParams.get("token");

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!accessToken) {
        setError("No access token provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/payment/get-receipt/${accessToken}`);
        const result = await response.json();

        if (!response.ok) {
          if (response.status === 410) {
            setError("This receipt has expired and is no longer accessible");
          } else {
            throw new Error(result.error || "Failed to fetch receipt");
          }
          return;
        }

        if (result.success && result.invoiceData) {
          setInvoiceData(result.invoiceData);
        }
      } catch (error) {
        console.error("Error fetching receipt:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceData();
  }, [accessToken]);

  const handleDownloadReceipt = () => {
    if (!invoiceData) return;

    toast.success("Receipt Download", {
      description:
        "PDF receipt generation will be implemented soon. Please save this page for your records.",
    });
  };

  const handleEmailUs = () => {
    window.location.href =
      "mailto:info@codeaura.us?subject=Payment Inquiry - Invoice " +
      invoiceNumber;
  };

  const handleCallUs = () => {
    window.location.href = "tel:+172733714317";
  };

  if (error) {
    return (
      <main className="layout-standard h-[80vh] flex-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Receipt Not Found
          </h1>
          <p className="text-paragraph mb-6">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="layout-standard section-margin-standard section-padding-standard flex flex-col gap-8">
      {/* SUCCESS HEADER */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-4">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>
        </div>
        <h1 className="md:text-4xl text-3xl font-bold text-heading mb-2">
          Payment Successful!
        </h1>
        <p className="text-paragraph text-lg">
          Thank you for your payment. Your transaction has been completed.
        </p>
      </div>

      {/* INVOICE RECEIPT */}
      <Card className="border-border max-w-4xl mx-auto w-full">
        <CardHeader className="text-center border-b border-border">
          <div className="flex justify-center mb-4">
            <Image src={Logo} alt="Code Aura" width={140} />
          </div>
          <h2 className="text-2xl font-semibold text-heading">
            Payment Receipt
          </h2>
          {isLoading ? (
            <Skeleton className="h-6 w-48 mx-auto bg-muted" />
          ) : (
            <p className="text-muted-foreground">
              Invoice #{invoiceData?.invoiceNumber}
            </p>
          )}
        </CardHeader>

        <CardContent className="p-8">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full bg-muted" />
              ))}
            </div>
          ) : invoiceData ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-heading mb-3">From:</h3>
                  <div className="text-paragraph">
                    <p className="font-medium text-heading">Code Aura</p>
                    <p>info@codeaura.us</p>
                    <p>www.codeaura.us</p>
                    <p>(727) 371-4317</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-heading mb-3">Bill To:</h3>
                  <div className="text-paragraph">
                    <p className="font-medium text-heading">
                      {invoiceData.clientName}
                    </p>
                    <p>Client ID: {invoiceData.clientId}</p>
                    <p>{invoiceData.clientEmailAddress}</p>
                    {invoiceData.clientPhoneNumber && (
                      <p>{invoiceData.clientPhoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Invoice Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-heading mb-3">
                    Payment Details:
                  </h3>
                  <div className="space-y-2 text-paragraph">
                    <div className="flex justify-between">
                      <span>Invoice Number:</span>
                      <span className="font-medium">
                        {invoiceData.invoiceNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issue Date:</span>
                      <span>
                        {new Date(invoiceData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span>
                        {new Date(invoiceData.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paid Date:</span>
                      <span className="text-green-600 font-medium">
                        {invoiceData.paidAt
                          ? new Date(invoiceData.paidAt).toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <span className="text-green-600 font-bold">PAID</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <Separator className="my-8 border-border" />

          {/* SERVICE DETAILS */}
          {!isLoading && invoiceData && (
            <div className="space-y-4">
              <h3 className="font-semibold text-heading">Service Details:</h3>
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium text-heading mb-2">
                  {invoiceData.serviceTitle}
                </h4>
                <p className="text-paragraph text-sm mb-4">
                  {invoiceData.serviceDescription}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-paragraph">Total Amount:</span>
                  <span className="text-2xl font-bold text-heading">
                    ${invoiceData.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Separator className="my-8 border-border" />

          {/* PAYMENT CONFIRMATION */}
          <div className="text-center bg-green-50 rounded-lg p-6">
            <FaCheckCircle className="text-green-600 text-3xl mx-auto mb-3" />
            <h3 className="font-semibold text-green-800 mb-2">
              Payment Confirmed
            </h3>
            <p className="text-green-700 text-sm">
              Your payment has been successfully processed and this invoice is
              now marked as PAID. A confirmation email has been sent to your
              registered email address.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ACTION BUTTONS */}
      <div className="w-full flex flex-col gap-4 max-w-md mx-auto mt-12">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleEmailUs}
            className="flex-1 h-[50px] bg-secondary text-secondary-foreground hover:bg-secondary-hover"
          >
            <FaEnvelope className="mr-2" />
            Email Us
          </Button>
          <Button
            onClick={handleCallUs}
            className="flex-1 h-[50px] bg-secondary text-secondary-foreground hover:bg-secondary-hover"
          >
            <FaPhone className="mr-2" />
            Call Us
          </Button>
        </div>

        <Button
          onClick={handleDownloadReceipt}
          className="w-full h-[50px] bg-primary text-primary-foreground hover:bg-primary-hover"
          disabled={isLoading || !invoiceData}
        >
          <FaDownload className="mr-2" />
          Download Receipt (PDF)
        </Button>
      </div>
    </main>
  );
}

export default PaymentSuccessPage;
