import { BuildPage } from "@/components/common/build-page";
import { DashboardCardsList } from "@/app/(auth)/dashboard/_components/dashboards-cards";
import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  return (
    <BuildPage
      icon={<LayoutDashboard />}
      title="Dashboard"
      description={`
        Bem-vindo! Este é o espaço onde você pode acessar informações detalhadas sobre os
        diversos fluxos operacionais em andamento na empresa em que você está envolvido,
        ou que poderá vir a participar no futuro.`
      }
      children={<DashboardCardsList />}
    />
  )
}