
export interface Person {
  name: string;
  avatar: string;
  birthDate: string;
  description: string;
}

export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  link?: string;
}

export interface ThemeConfig {
  backgroundUrl: string;
  backgroundType: 'image' | 'video';
  musicUrl: string;
  accentColor: string;
}

export interface AppData {
  person1: Person;
  person2: Person;
  startDate: string;
  memories: Memory[];
  theme: ThemeConfig;
}
