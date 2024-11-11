import { ReactNode } from "react"

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-5">
      {children}
    </div>
  )
}
export default AuthLayout
