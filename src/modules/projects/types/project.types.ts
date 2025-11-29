export interface Project {
  _id: string;
  title: string;
  description: string;
  featured: boolean;
  image?: string | null;
  techStack: string[];
  difficulty: string;
  roleNeeded: string;
}

export interface ListProjectResponse {
  projects: Project[];
  total: number;
}

export interface CustomSelectProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  allowCustom?: boolean;
  customValue?: string;
  onCustomChange?: (v: string) => void;
  showCustomInput?: boolean;
  onShowCustomInput?: (show: boolean) => void;
}

export interface RequiredRole {
  _id: string;
  role: string;
  count: string;
  experience: string;
}

export interface ProjectDetails {
  _image: any;
  _id: string;
  _title: string;
  _description: string;
  _difficulty: string;
  _startDate: string;
  _endDate: string;
  _status: string;
  _visibility: string;
  _githubRepo: string;
  _techStack: string[];
  _expectation: string;
  _requiredRoles: RequiredRole[];
}
export interface PendingApplication {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    bio?:string;
    profileImage?:string;
    github?: string;
  };
  techStack: string[];
  profileUrl: string;
  reason: string;
  createdAt: string;
}