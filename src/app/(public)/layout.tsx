import { ReactNode } from "react";
import PublicRouteBackground from '../../../public/assets/images/jpeg/background-route-public.jpg';

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${PublicRouteBackground.src})` }} >
      <div className="flex w-full justify-center items-center h-screen">
        {children}
      </div>
    </div>
  )
}

export default PublicLayout;