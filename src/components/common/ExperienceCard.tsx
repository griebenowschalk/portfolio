import { ExperienceData } from "@/types/experience";

const ExperienceCard = ({
  title,
  education,
  experience,
  year,
}: ExperienceData) => {
  return (
    <div className={`w-full max-w-xl mb-5 md:mb-24`}>
      <div className="relative flex flex-col gap-y-3 rounded-md bg-secondary border border-accent shadow-sm p-4 tracking-wider sm:text-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-lg font-semibold text-card-foreground">
            {title}
          </h1>
          <span className="md:hidden text-primary">{year}</span>
        </div>
        <p className="text-muted-foreground">
          <span className="block font-medium">Education:</span>
          <span className="block pl-2 font-light">{education}</span>
        </p>
        <div className="text-muted-foreground">
          <span className="font-medium">Experience:</span>
          <ul className="pl-2">
            {experience.map((item) => (
              <li key={item} className="my-1 font-light">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
