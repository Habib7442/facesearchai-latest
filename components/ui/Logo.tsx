import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { logo } from "@/constants";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
       
          <Image
            src={logo[0].src}
            alt={logo[0].alt}
            width={100}
            height={100}
            className="object-contain rounded-md bg-slate-950 w-12 h-12"
          />
        
      </motion.div>
      {/* <span className="text-ml font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-slate-900">
        FaceSearch AI
      </span> */}
    </Link>
  );
};

export default Logo;
