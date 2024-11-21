import { Navbar } from "@/components/common/nav-bar"
import { ReactNode } from "react"
import AuthRouteBackground from '../../../public/svg/background-route-auth1.svg'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="w-screen h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${AuthRouteBackground.src})` }}
    >
      <Navbar />
      <div className="p-5 w-full h-full relative">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout;