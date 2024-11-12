import { DashboardProviders } from "@/providers/dashboard"

const DashboardLayout = ({ children }) => {
  <DashboardProviders>
    <div className="p-5">
      {children}
    </div>
  </DashboardProviders>
}

export default DashboardLayout;