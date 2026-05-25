import type { Metadata } from "next";
import ClientDashboard from "@/widgets/client-dashboard";

export const metadata: Metadata = {
  title: "Dashboard | PipeBridge CRM",
  description: "Visão geral de clientes, patrimônios e status de processamento.",
};

export default function HomePage() {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-content">Dashboard</h1>
        <p className="text-content-secondary mt-1">Visão geral do sistema de gestão de clientes</p>
      </div>
      <ClientDashboard />
    </div>
  );
}
