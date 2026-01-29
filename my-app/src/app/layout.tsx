import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/components/Provider";
import { Toaster } from "sonner";
import StoreProvider from "@/redux/StoreProvider";
import InitalizeUser from "@/init/initalizeUser";
import InitializeAllVendors from "@/init/initializeAllVendors";
import InitializeAllProducts from "@/init/initalizeAllProducts";
import InitializeAllOrders from "@/init/initalizeAllOrders";

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
            <InitializeAllOrders />
            {children}
          </StoreProvider>
        </Provider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}