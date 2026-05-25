import type { Metadata } from "next";
import ClientDashboard from "@/widgets/client-dashboard";

export const metadata: Metadata = {
  title: "Dashboard | PipeBridge CRM",
  description: "Visão geral de clientes, patrimônios e status de processamento.",
};

export default function HomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-content">Dashboard</h1>
        <p className="text-content-secondary text-sm mt-1">
          Visão geral do sistema de gestão de clientes
        </p>
      </div>
      <ClientDashboard />
    </div>
  );
}
