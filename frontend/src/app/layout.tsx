import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/store/provider";
import { AuthLayout } from "@/widgets/auth-layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PipeBridge CRM | Mundo Invest",
  description: "Sistema de gerenciamento de clientes com integração Pipefy para controle de patrimônios e processos internos.",
  keywords: ["CRM", "Pipefy", "Mundo Invest", "Gestão de Clientes", "Patrimônio"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          <AuthLayout>{children}</AuthLayout>
        </Providers>
      </body>
    </html>
  );
}
