"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, TrendingUp, Clock, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { fetchClients, ClientTable } from "@/entities/client";
import type { Client } from "@/shared/types";
import Card from "@/shared/ui/card";
import Loading from "@/shared/ui/loading";
import { formatCurrency } from "@/shared/lib/formatters";
import { STATUS_PROCESSADO, STATUS_AGUARDANDO } from "@/shared/lib/constants";

interface StatConfig {
  icon: LucideIcon;
  label: string;
  value: string;
  gradient: string;
}

function StatCard({ icon: Icon, label, value, gradient }: StatConfig) {
  return (
    <Card className="flex items-center gap-3 sm:gap-4">
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${gradient} flex items-center justify-center shrink-0`}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-content-secondary">{label}</p>
        <p className="text-lg sm:text-xl font-bold text-content truncate">{value}</p>
      </div>
    </Card>
  );
}

function computeStats(clients: Client[]): StatConfig[] {
  const total = clients.length;
  const totalPatrimonio = clients.reduce((sum, c) => sum + c.valor_patrimonio, 0);
  const pending = clients.filter((c) => c.status === STATUS_AGUARDANDO).length;
  const processed = clients.filter((c) => c.status === STATUS_PROCESSADO).length;

  return [
    {
      icon: Users,
      label: "Total Clientes",
      value: String(total),
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Patrimônio Total",
      value: formatCurrency(totalPatrimonio),
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
    {
      icon: Clock,
      label: "Aguardando",
      value: String(pending),
      gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
    {
      icon: ShieldCheck,
      label: "Processados",
      value: String(processed),
      gradient: "bg-gradient-to-br from-sky-500 to-cyan-600",
    },
  ];
}

export default function ClientDashboard() {
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  const stats = useMemo(() => computeStats(clients), [clients]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Card>
        <h2 className="text-base sm:text-lg font-semibold text-content mb-4">
          Clientes Recentes
        </h2>
        <ClientTable clients={clients} />
      </Card>
    </div>
  );
}
