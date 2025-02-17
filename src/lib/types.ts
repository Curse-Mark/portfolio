export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft';
  proficiency: number | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  tags: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credential_url?: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface FileUploadResponse {
  path: string;
  fullPath: string;
}