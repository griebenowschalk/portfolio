import { ComponentType } from "react";

export interface SocialLink {
  name: string;
  icon: ComponentType;
  href: string;
  colorStyle: string;
}

export interface SocialLinksConfig {
  socialLinks: SocialLink[];
}
