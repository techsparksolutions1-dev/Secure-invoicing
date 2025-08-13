"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Eye, Trash2, LogOut, Plus, LoaderCircle } from "lucide-react";

function HomePage() {
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Logged out successfully", {
          description: "You have been securely logged out.",
        });

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout Failed", {
        description: "There was an issue logging out. Please try again.",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <main className="layout-standard h-[80vh] flex-center">
      <div className="grid md:grid-cols-2 gap-4">
        <Button
          onClick={() => handleNavigation("/generate-invoice")}
          className="h-[50px] w-[300px] font-semibold bg-secondary hover:bg-secondary-hover text-secondary-foreground text-base"
        >
          <Plus className="mr-2 h-5 w-5" />
          Generate Invoice
        </Button>

        <Button
          onClick={() => handleNavigation("/view-invoices")}
          className="h-[50px] w-[300px] font-semibold bg-secondary hover:bg-secondary-hover text-secondary-foreground text-base"
        >
          <Eye className="mr-2 h-5 w-5" />
          View Invoices
        </Button>

        <Button
          onClick={() => handleNavigation("/delete-url")}
          className="h-[50px] w-[300px] font-semibold bg-secondary hover:bg-secondary-hover text-secondary-foreground text-base"
        >
          <Trash2 className="mr-2 h-5 w-5" />
          Delete URL
        </Button>

        <Button
          onClick={handleLogout}
          disabled={loggingOut}
          className="h-[50px] w-[300px] font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground text-base"
        >
          {loggingOut ? (
            <>
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              Logging Out
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </>
          )}
        </Button>
      </div>
    </main>
  );
}

export default HomePage;
