export interface Project {
  id: string;
  title: string;
  description: string;
  featured: boolean;
  image?: string | null;
  techStack: string[];
  difficulty: string;
  roleNeeded: string;
  creator?: {
    name: string;
    email: string;
    avatar?: string | null;
  };
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
  image: string | null;
  id: string;
  title: string;
  description: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  status: string;
  visibility: string;
  githubRepo: string;
  techStack: string[];
  expectation: string;
  requiredRoles: RequiredRole[];
  creator?: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}

export interface PendingApplication {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    profileImage?: string;
    github?: string;
  };
  techStack: string[];
  profileUrl: string;
  reason: string;
  createdAt: string;
}

export interface BaseProjectPayload {
  title: string;
  description: string;
  githubRepo: string;
  techStack: string[];
  difficulty: string;
  startDate: string;
  endDate: string;
  expectation: string;
  visibility: string;
  requiredRoles: {
    role: string;
    count: string;
    experience: string;
  }[];
  image: string | null;
}

export interface Member {
  id: string;
  name: string;
  role: 'contributor' | 'maintainer';
  email: string;
}

export interface JoinRequest {
  id: string;
  name: string;
  email: string;
}

export interface TeamMembersPageProps {
  initialMembers: Member[];
  initialJoinRequests?: JoinRequest[];
}

import { TaskStatus } from "@/modules/tasks/types/task.types";

export interface TaskListItem {
  id: string;
  title: string;
  description: string;
  assignedId: string;
  deadline: string;
  status: TaskStatus;
  tags: string[];
  payment: number;
  workDescription?: string;
  approval?: "approved" | "improvement-needed" | "under-review";
  feedback?: string;
  prLink?: string;
  acceptanceCriteria?: { text: string; completed: boolean }[];
  documents?: string[];
  comments?: { createdAt: Date | string; message: string; userId: string }[];
}