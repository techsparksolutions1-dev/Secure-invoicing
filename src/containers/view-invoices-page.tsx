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
} from "lucide-react";

function ViewInvoicesPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [hoveredInvoice, setHoveredInvoice] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setCurrentPage(1);

      const response = await fetch(`/api/invoice/get-all-invoices`);
      const result = await response.json();

      if (result.success) {
        setInvoices(result.invoices);
        setFilteredInvoices(result.invoices);
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
        "Are you sure you want to delete this invoice? This action cannot be undone."
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
        setFilteredInvoices((prev) =>
          prev.filter((inv) => inv.invoiceNumber !== invoiceNumber)
        );

        const newTotalItems = filteredInvoices.length - 1;
        const maxPage = Math.ceil(newTotalItems / itemsPerPage);
        if (currentPage > maxPage && maxPage > 0) {
          setCurrentPage(maxPage);
        }

        toast.success("Invoice Deleted", {
          description: "Invoice has been permanently deleted.",
          icon: <CheckCircle2 className="text-green-600" size={20} />,
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

  const handleViewInvoice = (invoiceNumber: string) => {
    window.open(`/pay-invoice/${invoiceNumber}`, "_blank");
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

  const truncateDescription = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

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
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-heading">
                View invoices
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage & view all the unpaid invoices and their payment URLs.
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

        <div className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-4 w-32 bg-muted" />
          ) : (
            `Showing ${startIndex + 1}-${Math.min(
              endIndex,
              filteredInvoices.length
            )} of ${filteredInvoices.length} invoice${
              filteredInvoices.length !== 1 ? "s" : ""
            }`
          )}
        </div>

        <Card className="border-border">
          <CardHeader>
            <h2 className="text-xl font-semibold text-heading">Invoice List</h2>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-muted" />
                ))}
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-heading mb-2">
                  No Invoices Found
                </h3>
                <p className="text-muted-foreground">
                  No invoices have been created yet.
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
                          Service
                        </th>
                        <th className="p-4 font-medium text-muted-foreground">
                          Amount
                        </th>
                        <th className="p-4 font-medium text-muted-foreground">
                          Created
                        </th>
                        <th className="p-4 font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentInvoices.map((invoice) => (
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
                            <div className="max-w-xs">
                              <div className="font-medium text-heading truncate">
                                {invoice.serviceTitle}
                              </div>
                              <div
                                className="text-sm text-muted-foreground cursor-help relative"
                                onMouseEnter={() =>
                                  setHoveredInvoice(invoice.id)
                                }
                                onMouseLeave={() => setHoveredInvoice(null)}
                              >
                                {truncateDescription(
                                  invoice.serviceDescription
                                )}

                                {hoveredInvoice === invoice.id &&
                                  invoice.serviceDescription.length > 50 && (
                                    <div className="absolute z-50 bottom-full left-0 mb-2 p-3 bg-muted text-white text-sm rounded-lg shadow-lg max-w-sm break-words h-[200px] overflow-y-auto">
                                      <div className="font-medium mb-1">
                                        {invoice.serviceTitle}
                                      </div>
                                      <div>{invoice.serviceDescription}</div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-heading">
                            {formatCurrency(invoice.totalAmount)}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatDate(invoice.createdAt)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() =>
                                  handleViewInvoice(invoice.invoiceNumber)
                                }
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                title="View Invoice"
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
                                title="Delete Invoice"
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
                      ))}
                    </tbody>
                  </table>
                </div>

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

export default ViewInvoicesPage;
