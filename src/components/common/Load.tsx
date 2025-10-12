import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Load = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <motion.div
      className="w-full h-full fixed left-0 top-0 flex items-center justify-center
    bg-gradient-to-t from-primary to-accent z-[1000]"
      initial={{ top: 0 }}
      animate={{ top: loaded ? "-100%" : 0 }}
      transition={{ duration: 0.5 }}
    >
      <Image src="/spinner.gif" alt="load" width={50} height={50} />
    </motion.div>
  );
};

export default Load;
