import Loader from "@/components/ui/loader";
import React from "react";

function loading() {
  return (
    <main className="min-h-screen flex-center w-full">
      <Loader />
    </main>
  );
}

export default loading;
