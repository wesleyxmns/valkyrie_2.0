import { Navbar } from "@/components/common/nav-bar"
import { ReactNode } from "react"
import AuthRouteBackground from '../../../public/assets/images/jpeg/background-route-auth.jpg'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="relative w-screen h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${AuthRouteBackground.src})` }}
    >
      <Navbar />
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout;