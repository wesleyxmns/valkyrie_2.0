import { cn } from "@/lib/utils/utils";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";

interface BlurInProps {
  content: string | StaticImageData;
  className?: string;
  variant?: {
    hidden: { filter: string; opacity: number };
    visible: { filter: string; opacity: number };
  };
  duration?: number;
  isImage?: boolean;
  imageWidth?: number;
  imageHeight?: number;
}

const BlurIn = ({
  content,
  className,
  variant,
  duration = 1,
  isImage = false,
  imageWidth,
  imageHeight,
}: BlurInProps) => {
  const defaultVariants = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration }}
      variants={combinedVariants}
      className={cn(className, "relative overflow-hidden")}
    >
      {isImage ? (
        <img
          src={typeof content === "string" ? content : content.src}
          alt=""
          className="object-cover"
          width={imageWidth}
          height={imageHeight}
        />
      ) : (
        <h1
          className={cn(
            "font-display text-center text-4xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-7xl md:leading-[5rem]",
            className
          )}
        >
          {typeof content === "string" ? content : ""}
        </h1>
      )}
    </motion.div>
  );
};

export default BlurIn;
