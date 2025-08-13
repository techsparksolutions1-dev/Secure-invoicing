import React from "react";

import LoginForm from "@/components/forms/login-form";

function LoginPage() {
  return (
    <main className="h-svh w-full">
      <div className="layout-standard h-full flex-center">
        <LoginForm />
      </div>
    </main>
  );
}

export default LoginPage;
