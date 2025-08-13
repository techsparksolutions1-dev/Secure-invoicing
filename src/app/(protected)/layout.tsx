import ProtectedRoutesProvider from "@/providers/protected-routes-provider";

import Header from "@/components/layouts/header";

export default function ProtectedRoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoutesProvider>
      <Header />
      {children}
    </ProtectedRoutesProvider>
  );
}
