export interface Achievement {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface AboutMeConfig {
  achievements: Achievement[];
}
