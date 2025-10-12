import { navbar } from "@/data/navbar";

interface NavbarProps {
  id: string;
}

const Navbar = ({ id }: NavbarProps) => {
  return (
    <div
      className="w-[70] h-full fixed left-0 top-0 flex flex-col 
    border-r border-accent p-4 overflow-y-auto z-10"
    >
      <a href={`/#home`} className="mb-10">
        <span className="text-3xl font-semibold text-primary">S</span>.
        <span className="block rotate-90 origin-bottom text-[12px] font-semibold -ml-2">
          Griebenow
        </span>
      </a>
      <div className="flex-1 flex flex-col justify-center gap-6">
        {navbar.map((item) => (
          <div className="flex flex-col" key={item.id}>
            <a
              href={`/#${item.href}`}
              className="group flex flex-col items-center gap-y-2"
            >
              <span
                className={`text-2xl text-muted-foreground md:group-hover:text-primary md:group-hover:scale-125 transition-all ${id === item.href ? "text-primary scale-110" : "text-muted-foreground scale-100"} touch-manipulation`}
              >
                <i className={item.iconClass}></i>
              </span>
              <span
                className={`text-xs tracking-wide text-muted-foreground md:group-hover:translate-x-0 md:group-hover:text-primary
  transition-all opacity-0 md:group-hover:opacity-100 duration-300 ${id === item.href ? "-translate-x-0 opacity-100 text-primary" : ""}`}
              >
                {item.name}
              </span>
            </a>
          </div>
        ))}
      </div>
      <p className="relative flex items-center justify-center text-sm text-muted-foreground mt-6">
        <span className="absolute left-1/2 w-max flex items-center -rotate-90 origin-bottom-left tracking-wider">
          {<i className="ri-copyright-line"></i>} {new Date().getFullYear()}
        </span>
      </p>
    </div>
  );
};

export default Navbar;
