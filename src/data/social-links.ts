import { Github, Linkedin } from "lucide-react";
import { SocialLink } from "@/types/social";

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com/in/griebenowschalk",
    colorStyle: "hover:bg-foreground hover:text-background",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/griebenowschalk",
    colorStyle: "hover:bg-foreground hover:text-background",
  },
];
