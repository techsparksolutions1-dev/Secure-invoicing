"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ProtectedRoutesProviderProps } from "@/interfaces/provider-interfaces";

import Loader from "@/components/ui/loader";

function ProtectedRoutesProvider({ children }: ProtectedRoutesProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Redirect to login page (/) instead of /login
          router.push("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        // Redirect to login page (/) instead of /login
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-svh flex-center bg-background">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex-center bg-background">
        <div className="text-center text-heading">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-paragraph">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoutesProvider;
