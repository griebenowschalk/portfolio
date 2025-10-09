export interface Achievements {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface AboutMeConfig {
  achievements: Achievements[];
}
