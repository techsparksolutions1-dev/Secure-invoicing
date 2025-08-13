"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { LoginFormType } from "@/interfaces/components.form-interfaces";
import { LoginFormSchema } from "@/schemas/login-form-schema";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import CustomInput from "../common/custom-input";

import { cn } from "@/lib/utils";

import {
  LoaderCircle,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Logo from "../../../public/favicons/logo.svg";

function LoginForm() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit = async (data: LoginFormType) => {
    setLoading(true);

    if (!data.username?.trim() || !data.password?.trim()) {
      toast.error("Authentication Required", {
        description: "Please enter both username and password to continue.",
        icon: <AlertCircle className="text-red-600" size={20} />,
      });
      setLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Login Successful", {
          description: "Welcome back! Redirecting to dashboard...",
          icon: <CheckCircle2 className="text-green-600" size={20} />,
          duration: 2000,
        });

        setTimeout(() => {
          router.push("/home");
        }, 1500);
      } else {
        throw new Error(result.error || "Login failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";

      toast.error("Login Failed", {
        description: errorMessage,
        icon: <AlertCircle className="text-red-600" size={20} />,
        duration: 4000,
        style: {
          border: "1px solid #fee2e2",
          background: "#fef2f2",
          color: "#991b1b",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex-center">
      <Card className="w-full max-w-md border-border shadow-2xl">
        <CardHeader className="text-center border-b border-border pb-8 pt-10">
          <div className="flex justify-center mb-4">
            <Image
              src={Logo}
              alt="Code Aura"
              width={200}
              className="h-auto"
              priority
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-heading">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to access your invoice management system
            </p>
          </div>
        </CardHeader>

        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
            <CardContent className="space-y-6 pt-8 pb-6">
              <div className="relative">
                <CustomInput
                  control={control}
                  name="username"
                  label="Username"
                  placeholder="Enter your username"
                  type="text"
                />
                <User className="absolute right-3 top-[49px] h-4 w-4 text-muted-foreground" />
              </div>

              <div className="relative">
                <CustomInput
                  control={control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
                <Lock className="absolute right-3 top-[49px] h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>

            <CardFooter className="pt-4 pb-8">
              <Button
                className={cn(
                  "w-full h-12 text-base font-semibold rounded-lg",
                  "bg-secondary hover:bg-secondary-hover text-secondary-foreground",
                  loading && "opacity-80 cursor-not-allowed"
                )}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>

        <div className="border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Code Aura. Secure invoice management
            system.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default LoginForm;
