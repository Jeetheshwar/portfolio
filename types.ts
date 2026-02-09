export interface Project {
  id: number;
  category: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  link: string;
  bgColor?: string;
}

export interface NavItem {
  label: string;
  href: string;
}