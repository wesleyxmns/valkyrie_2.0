import DashboardProviders from "@/providers/dashboard"

const DashboardLayout = ({ children }) => {
  return (
    <DashboardProviders>
      {children}
    </DashboardProviders>
  )
}

export default DashboardLayout;