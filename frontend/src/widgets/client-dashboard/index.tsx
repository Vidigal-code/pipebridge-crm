"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, TrendingUp, Clock, ShieldCheck } from "lucide-react";

import { fetchClients, ClientTable } from "@/entities/client";
import Card from "@/shared/ui/card";
import Loading from "@/shared/ui/loading";
import { formatCurrency } from "@/shared/lib/formatters";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-content-secondary">{label}</p>
        <p className="text-xl font-bold text-content truncate">{value}</p>
      </div>
    </Card>
  );
}

export default function ClientDashboard() {
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  if (isLoading) return <Loading />;

  const totalClients = clients.length;
  const totalPatrimonio = clients.reduce((sum, c) => sum + c.valor_patrimonio, 0);
  const pendingCount = clients.filter((c) => c.status === "Aguardando Análise").length;
  const processedCount = clients.filter((c) => c.status === "Processado").length;

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Clientes" value={String(totalClients)} color="bg-gradient-to-br from-indigo-500 to-purple-600" />
        <StatCard icon={TrendingUp} label="Patrimônio Total" value={formatCurrency(totalPatrimonio)} color="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatCard icon={Clock} label="Aguardando" value={String(pendingCount)} color="bg-gradient-to-br from-amber-500 to-orange-600" />
        <StatCard icon={ShieldCheck} label="Processados" value={String(processedCount)} color="bg-gradient-to-br from-sky-500 to-cyan-600" />
      </div>

      <Card className="overflow-x-auto">
        <h2 className="text-lg font-semibold text-content mb-4">Clientes Recentes</h2>
        <ClientTable clients={clients} />
      </Card>
    </div>
  );
}
