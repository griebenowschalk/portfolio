import { cn } from "@/lib/utils";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col gap-y-10 items-center justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Container;
