import { Navbar } from "@/components/common/nav-bar"
import { ReactNode } from "react"

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="p-5">{children}</div>
    </div>
  )
}
export default AuthLayout
