"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import { Invoice } from "@/interfaces/containers.view-invoices-page-interfaces";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

import {
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  LinkIcon,
  AlertTriangle,
} from "lucide-react";

function DeleteURLPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [hoveredInvoice, setHoveredInvoice] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/invoice/get-all-invoices`);
      const result = await response.json();

      if (result.success) {
        setInvoices(result.invoices || []);
      } else {
        throw new Error(result.error || "Failed to fetch invoices");
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to Load Invoices", {
        description: "Unable to fetch invoice data. Please try again.",
        icon: <AlertCircle className="text-red-600" size={20} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceNumber: string) => {
    if (
      !confirm(
        `Are you sure you want to delete invoice ${invoiceNumber}?\n\nThis will:\n• Permanently delete the invoice\n• Free up the payment URL\n• Allow the URL to be reused\n\nThis action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(invoiceNumber);
      const response = await fetch(
        `/api/invoice/delete-invoice/${invoiceNumber}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        setInvoices((prev) =>
          prev.filter((inv) => inv.invoiceNumber !== invoiceNumber)
        );

        const newTotalItems = invoices.length - 1;
        const maxPage = Math.ceil(newTotalItems / itemsPerPage);
        if (currentPage > maxPage && maxPage > 0) {
          setCurrentPage(maxPage);
        }

        toast.success("Invoice Deleted & URL Freed", {
          description: `Invoice ${invoiceNumber} deleted successfully. The payment URL is now available for reuse.`,
          icon: <CheckCircle2 className="text-green-600" size={20} />,
          duration: 5000,
        });
      } else {
        throw new Error(result.error || "Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Delete Failed", {
        description: "Unable to delete invoice. Please try again.",
        icon: <AlertCircle className="text-red-600" size={20} />,
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleViewPaymentURL = (invoiceNumber: string) => {
    window.open(`/pay-invoice/${invoiceNumber}`, "_blank");
  };

  const copyPaymentURL = (invoiceNumber: string) => {
    const url = `${window.location.origin}/pay-invoice/${invoiceNumber}`;
    navigator.clipboard.writeText(url);
    toast.success("Payment URL Copied", {
      description: "Payment URL has been copied to clipboard.",
      icon: <CheckCircle2 className="text-green-600" size={20} />,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysOverdue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPaymentURL = (invoiceNumber: string) => {
    return `${window.location.origin}/pay-invoice/${invoiceNumber}`;
  };

  const truncateURL = (url: string, maxLength: number = 40) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = invoices.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <main className="layout-standard section-padding-standard section-margin-standard">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-heading">
                URL Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage unpaid invoices and their payment URLs. Delete unpaid
                invoices to free up URLs for reuse.
              </p>
            </div>
            <Button
              onClick={fetchInvoices}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          <Separator />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Unpaid Invoices
                  </p>
                  <p className="text-xl font-semibold text-heading">
                    {loading ? "..." : invoices.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <LinkIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active URLs</p>
                  <p className="text-xl font-semibold text-heading">
                    {loading ? "..." : invoices.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-xl font-semibold text-heading">
                    {loading
                      ? "..."
                      : invoices.filter(
                          (inv) => getDaysOverdue(inv.dueDate) > 0
                        ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-4 w-32 bg-muted" />
          ) : (
            `Showing ${startIndex + 1}-${Math.min(
              endIndex,
              invoices.length
            )} of ${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}`
          )}
        </div>

        <Card className="border-border">
          <CardHeader>
            <h2 className="text-xl font-semibold text-heading">
              Unpaid Invoices & URLs
            </h2>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-muted" />
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-lg font-medium text-heading mb-2">
                  No Unpaid Invoices
                </h3>
                <p className="text-muted-foreground">
                  Great! All invoices have been paid. No URLs need to be freed
                  up.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr className="text-left">
                        <th className="p-4 font-medium text-muted-foreground">
                          Invoice #
                        </th>
                        <th className="p-4 font-medium text-muted-foreground">
                          Client
                        </th>
                        <th className="p-4 font-medium text-muted-foreground">
                          Payment URL
                        </th>
                        <th className="p-4 font-medium text-muted-foreground">
                          Amount
                        </th>
                        <th className="p-4 font-medium text-muted-foreground">
                          Due Date
                        </th>
                        <th className="p-4 font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentInvoices.map((invoice) => {
                        const daysOverdue = getDaysOverdue(invoice.dueDate);
                        const paymentURL = getPaymentURL(invoice.invoiceNumber);

                        return (
                          <tr
                            key={invoice.id}
                            className="border-b border-border hover:bg-muted/50"
                          >
                            <td className="p-4">
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {invoice.invoiceNumber}
                              </code>
                            </td>
                            <td className="p-4">
                              <div>
                                <div className="font-medium text-heading">
                                  {invoice.clientName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {invoice.clientEmailAddress}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div
                                className="relative cursor-pointer"
                                onMouseEnter={() =>
                                  setHoveredInvoice(invoice.id)
                                }
                                onMouseLeave={() => setHoveredInvoice(null)}
                                onClick={() =>
                                  copyPaymentURL(invoice.invoiceNumber)
                                }
                              >
                                <code className="text-sm text-blue-600 hover:text-blue-800 underline">
                                  {truncateURL(paymentURL)}
                                </code>

                                {/* URL Tooltip */}
                                {hoveredInvoice === invoice.id && (
                                  <div className="absolute z-50 bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap">
                                    <div className="font-medium mb-1">
                                      Click to copy
                                    </div>
                                    <div className="break-all">
                                      {paymentURL}
                                    </div>
                                    <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 font-medium text-heading">
                              {formatCurrency(invoice.totalAmount)}
                            </td>
                            <td className="p-4">
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(invoice.dueDate)}
                                </div>
                                {daysOverdue > 0 && (
                                  <div className="text-xs text-red-600 font-medium">
                                    {daysOverdue} day
                                    {daysOverdue !== 1 ? "s" : ""} overdue
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() =>
                                    handleViewPaymentURL(invoice.invoiceNumber)
                                  }
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                  title="View Payment Page"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleDeleteInvoice(invoice.invoiceNumber)
                                  }
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                  title="Delete Invoice & Free URL"
                                  disabled={
                                    deleteLoading === invoice.invoiceNumber
                                  }
                                >
                                  {deleteLoading === invoice.invoiceNumber ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((pageNum, index) => (
                          <React.Fragment key={index}>
                            {pageNum === "..." ? (
                              <span className="px-2 py-1 text-sm text-muted-foreground">
                                ...
                              </span>
                            ) : (
                              <Button
                                onClick={() => goToPage(pageNum as number)}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className={cn(
                                  "h-8 w-8 p-0 text-sm",
                                  currentPage === pageNum &&
                                    "bg-secondary hover:bg-secondary-hover text-secondary-foreground"
                                )}
                              >
                                {pageNum}
                              </Button>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      <Button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default DeleteURLPage;
