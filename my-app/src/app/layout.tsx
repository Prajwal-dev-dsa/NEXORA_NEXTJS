import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/components/Provider";
import { Toaster } from "sonner";
import StoreProvider from "@/redux/StoreProvider";
import InitalizeUser from "@/init/initalizeUser";
import InitializeAllVendors from "@/init/initializeAllVendors";
import InitializeAllProducts from "@/init/initalizeAllProducts";

export const metadata: Metadata = {
  title: "Nexora",
  description: "Nexora - Next.js App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Provider>
          <StoreProvider>
            <InitalizeUser />
            <InitializeAllVendors />
            <InitializeAllProducts />
            {children}
          </StoreProvider>
        </Provider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}