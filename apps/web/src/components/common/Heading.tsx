const Heading = ({ title }: { title: string }) => {
  return (
    <h1 className="text-3xl sm:text-2xl text-foreground font-bold self-start">
      {title}
    </h1>
  );
};

export default Heading;
