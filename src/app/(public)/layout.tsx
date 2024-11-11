import { ReactNode } from "react";
import BackgroundImage from '../../../public/assets/images/jpeg/5026563.jpg';

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${BackgroundImage.src})` }} >
      <div className="flex w-full justify-center items-center h-screen">
        {children}
      </div>
    </div>
  )
}

export default PublicLayout;