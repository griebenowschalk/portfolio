import { Achievement } from "@/types/about-me";
import { motion, useMotionValue } from "framer-motion";

const Achievements = ({ icon, number, title }: Achievement) => {
  const numberValue = useMotionValue(0);

  const count = (amount: number) => {
    let i = 0;

    const updateCount = () => {
      let timeout;

      if (i <= amount) {
        numberValue.set(i++);
        timeout = setTimeout(updateCount, 0);
      } else {
        clearTimeout(timeout);
      }
    };
    updateCount();
  };

  return (
    <div data-testid="achievement" className="flex items-end gap-x-2">
      <span className="text-4xl lg:text-2xl text-muted-foreground">
        <i className={icon}></i>
      </span>
      <h1 className="flex flex-col">
        <div className="flex items-center gap-x-1">
          <motion.span
            data-testid="achievement-number"
            onViewportEnter={() => count(number)}
            viewport={{ once: true }}
            className="text-2xl lg:text-xl text-primary"
          >
            {numberValue}
          </motion.span>
          <span className="text-2xl lg:text-xl text-primary">{"+"}</span>
        </div>
        <span className="text-sm tracking-wider text-foreground">{title}</span>
      </h1>
    </div>
  );
};

export default Achievements;
