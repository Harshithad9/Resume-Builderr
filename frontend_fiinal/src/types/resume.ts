export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Resume {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  summary?: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}
