import { cn } from "@/lib/utils";

const Container = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col gap-y-10 items-center justify-center py-20",
        className,
      )}
      id={id}
    >
      {children}
    </div>
  );
};

export default Container;
