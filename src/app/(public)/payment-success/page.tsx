import React from "react";
import { Metadata } from "next";
import { Suspense } from "react";

import PaymentSuccessPage from "@/containers/payment-success-page";

import Loader from "@/components/ui/loader";

import { GetPageMetadata } from "@/utils/meta-data";

export const metadata: Metadata = GetPageMetadata({
  title: "Payment Successful | Code Aura - Receipt & Confirmation",
  description:
    "Your payment has been processed successfully. Download your receipt and view invoice details.",
  robots: {
    index: false,
    follow: false,
  },
});

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <main className="w-screen h-svh flex-center">
          <Loader />
        </main>
      }
    >
      <PaymentSuccessPage />
    </Suspense>
  );
}
