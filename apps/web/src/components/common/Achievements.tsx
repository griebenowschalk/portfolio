import { Achievement } from "@/types/about-me";
import { motion, useMotionValue } from "framer-motion";

const Achievements = ({ icon, number, title, description }: Achievement) => {
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
    <div
      data-testid="achievement"
      className="group relative flex items-end gap-x-2 cursor-default"
      tabIndex={0}
    >
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
      {description && (
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 z-10 w-max max-w-[180px] rounded-md bg-popover px-3 py-1.5 text-center text-xs text-popover-foreground shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100">
          {description}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-popover" />
        </div>
      )}
    </div>
  );
};

export default Achievements;
