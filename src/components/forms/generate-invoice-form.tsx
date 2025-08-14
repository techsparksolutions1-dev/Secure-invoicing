"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { GenerateInvoiceFormType } from "@/interfaces/components.form-interfaces";

import { GenerateInvoiceFormSchema } from "@/schemas/generate-invoice-form-schema";

import { Form } from "@/components/ui/form";
import CustomInput from "@/components/common/custom-input";
import CustomTextarea from "@/components/common/custom-textarea";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import CustomCalendar from "../common/custom-calendar";

import { GenerateClientId } from "@/utils/generate-client-id";
import { GenerateInvoiceNumber } from "@/utils/generate-invoice-number";
import { cn } from "@/lib/utils";

import { LoaderCircle } from "lucide-react";
import { FaCircleXmark } from "react-icons/fa6";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { IoIosCopy } from "react-icons/io";
import { TbCopyCheckFilled } from "react-icons/tb";

function GenerateInvoiceForm() {
  const [loading, setLoading] = useState(false);
  const [shareableUrl, setShareableUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const form = useForm<GenerateInvoiceFormType>({
    resolver: zodResolver(GenerateInvoiceFormSchema),
    defaultValues: {
      clientId: GenerateClientId(),
      clientName: "",
      clientPhoneNumber: "",
      clientEmailAddress: "",
      serviceTitle: "",
      serviceDescription: "",
      invoiceNumber: "",
      dueDate: new Date(),
      totalAmount: "",
    },
  });

  const { handleSubmit, control, reset } = form;

  const handleReset = async () => {
    try {
      const response = await fetch("/api/invoice/next-number");
      const data = await response.json();

      reset({
        clientId: GenerateClientId(),
        clientName: "",
        clientPhoneNumber: "",
        clientEmailAddress: "",
        serviceTitle: "",
        serviceDescription: "",
        invoiceNumber: data.invoiceNumber || GenerateInvoiceNumber(),
        dueDate: new Date(),
        totalAmount: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      reset({
        clientId: GenerateClientId(),
        clientName: "",
        clientPhoneNumber: "",
        clientEmailAddress: "",
        serviceTitle: "",
        serviceDescription: "",
        invoiceNumber: GenerateInvoiceNumber(),
        dueDate: new Date(),
        totalAmount: "",
      });
    }
  };

  const onSubmit = async (data: GenerateInvoiceFormType) => {
    setLoading(true);

    if (
      !data.clientName?.trim() ||
      !data.clientEmailAddress?.trim() ||
      !data.serviceTitle?.trim() ||
      !data.serviceDescription?.trim() ||
      !data.dueDate ||
      !data.totalAmount
    ) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields before submitting.",
        icon: <FaTimesCircle className="text-red-600" size={20} />,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/invoice/generate-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setShareableUrl(result.shareableUrl);

        toast.success("Invoice generated successfully", {
          description: "The invoice has been saved and shareable URL is ready.",
          icon: <FaCheckCircle className="text-green-600" size={20} />,
          duration: 5000,
          style: {
            border: "1px solid #d1fae5",
            background: "#f0fdf4",
            color: "#065f46",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          },
          className: "rounded-lg px-4 py-3 text-sm font-medium",
        });

        handleReset();
      } else {
        throw new Error(result.error || "Failed to create invoice");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Submission Failed", {
          description: `Error: ${error.message}`,
          icon: <FaCircleXmark className="text-red-600" size={24} />,
        });
      } else {
        toast.error("Something went wrong", {
          description: "Please try again later or contact support.",
          icon: <FaTimesCircle className="text-red-600" size={20} />,
          duration: 6000,
          style: {
            border: "1px solid #fee2e2",
            background: "#fef2f2",
            color: "#991b1b",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast.success("URL copied to clipboard", {
      description: "Share this link with your client for payment.",
      icon: <FaCheckCircle className="text-green-600" size={20} />,
    });
  };

  useEffect(() => {
    const loadInvoiceNumber = async () => {
      try {
        const response = await fetch("/api/invoice/next-number");
        const data = await response.json();
        if (data.invoiceNumber) {
          form.setValue("invoiceNumber", data.invoiceNumber);
        }
      } catch (error) {
        console.error("Failed to load invoice number:", error);
      }
    };

    loadInvoiceNumber();
  }, [form]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-12"
        >
          {/* CLIENT DETAILS */}
          <div className="flex flex-col gap-4 md:mt-12">
            <div className="flex flex-col gap-2">
              <h1 className="text-heading text-3xl font-semibold">
                Client Details
              </h1>
              <Separator />
            </div>

            <div className="md:grid-cols-2 grid gap-4">
              <CustomInput
                control={control}
                name="clientId"
                label="Client ID"
                placeholder="Auto-generated client ID"
                disabled
              />
              <CustomInput
                control={control}
                name="clientName"
                label="Full Name"
                placeholder="Enter client's full name"
              />
            </div>

            <CustomInput
              control={control}
              name="clientPhoneNumber"
              label="Phone Number"
              placeholder="Enter client's phone number"
            />

            <CustomInput
              control={control}
              name="clientEmailAddress"
              label="Email Address"
              placeholder="Enter client's email address"
            />
          </div>

          {/* SERVICE DETAILS */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-heading text-3xl font-semibold">
                Service Details
              </h1>
              <Separator />
            </div>

            <CustomInput
              control={control}
              name="serviceTitle"
              label="Service Title"
              placeholder="Provide a tile of the service you are providing"
            />

            <CustomTextarea
              control={control}
              name="serviceDescription"
              label="Service Description"
              placeholder="Provide a detailed description of the service you are providing"
              rows={8}
            />
          </div>

          {/* INVOICE DETAILS */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-heading text-3xl font-semibold">
                Invoice Details
              </h1>
              <Separator />
            </div>

            <div className="md:grid-cols-2 grid gap-4">
              <CustomInput
                control={control}
                name="invoiceNumber"
                label="Invoice Number"
                placeholder="Auto-generated invoice number"
                disabled
              />

              <CustomCalendar
                control={control}
                name="dueDate"
                label="Due Date"
              />
            </div>

            <CustomInput
              control={control}
              name="totalAmount"
              label="Total Amount (USD)"
              placeholder="Enter the total amount due"
            />
          </div>

          {/* FUNCTIONAL BUTTONS */}
          <div className="w-full flex md:flex-row flex-col items-center gap-2 justify-end">
            <Button
              type="button"
              onClick={handleReset}
              className={cn(
                "md:w-[300px] w-full md:h-[60px] h-[46px] text-base !rounded-[5px] hover:bg-secondary-hover bg-secondary text-secondary-foreground md:order-1 order-2"
              )}
            >
              Reset Form
            </Button>

            <Button
              className={cn(
                "md:w-[300px] w-full md:h-[60px] h-[46px] text-base text-primary-foreground !rounded-[5px] hover:bg-primary-hover bg-primary md:order-2 order-1"
              )}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="w-full h-full flex items-center justify-center gap-2">
                  <p>Generating</p>
                  <LoaderCircle className="animate-spin text-white" />
                </div>
              ) : (
                "Generate Invoice"
              )}
            </Button>
          </div>
        </form>
      </Form>

      {shareableUrl && (
        <div className="w-full md:mt-[5rem] mt-12 bg-muted rounded-lg p-4 flex items-center justify-between gap-4">
          <div className="flex md:items-center md:flex-row flex-col gap-2 flex-1 min-w-0">
            <h1 className="font-bold uppercase tracking-wide flex-shrink-0">
              SHAREABLE URL:
            </h1>
            <code
              className="break-all overflow-x-auto scrollbar-thin"
              aria-label="Shareable invoice link"
            >
              {shareableUrl}
            </code>
          </div>

          <Button
            size="icon"
            variant="outline"
            onClick={copyToClipboard}
            aria-label="Copy shareable URL"
            className="hover:bg-primary flex-shrink-0"
          >
            {copied ? <TbCopyCheckFilled /> : <IoIosCopy />}
          </Button>
        </div>
      )}
    </>
  );
}

export default GenerateInvoiceForm;
