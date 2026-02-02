import Image from "next/image";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface LoadProps {
  loaded: boolean;
  setLoaded: (loaded: boolean) => void;
}

const Load = ({ loaded, setLoaded }: LoadProps) => {
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  }, [setLoaded]);

  return (
    <motion.div
      className="w-full h-full fixed left-0 top-0 flex items-center justify-center
    bg-gradient-to-t from-primary to-accent z-[1000]"
      initial={{ top: 0 }}
      animate={{ top: loaded ? "-100%" : 0 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src="/spinner.gif"
        alt="load"
        width={150}
        height={150}
        priority
        className="w-auto h-[150px]"
      />
    </motion.div>
  );
};

export default Load;
