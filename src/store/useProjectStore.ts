import { create } from "zustand";

interface Project {
    id: string;
    title: string;
}

interface ProjectState {
    currentProject: Project | null;
    setProject: (project: Project | null) => void;
    clearProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
    currentProject: null,
    setProject: (project) => set({ currentProject: project }),
    clearProject: () => set({ currentProject: null }),
}));
