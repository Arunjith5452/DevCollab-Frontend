'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ContributorHeader from "@/shared/common/user-common/contributor-common/ContributorHeader";
import ContributorSidebar from "@/shared/common/user-common/contributor-common/ContributorSidebar";
import { TaskListItem, ProjectDetails } from "../../../projects/types/project.types";
import { useAuthStore } from "@/store/useUserStore";
import api from "@/lib/axios";
import { projectDetails } from "../../../projects/services/project.api";
import PageLoader from "@/shared/common/LoadingComponent"
import { getAssignees } from "../../services/task.api"
import toast from "react-hot-toast"
import TodoTab from "./dashboard-todo-tab"
import InProgressTab from "./dashboard-inProgress-tab"
import DoneTab from "./dashboard-done-tab"
import SubmitWorkModal from "./submit-work-modal"
import { useProjectStore } from "@/store/useProjectStore";
import TaskDetailsPanel from "@/shared/common/user-common/task-details-panel";

type TaskStatus = "todo" | "in-progress" | "done";

interface Assignee { userId: string; name: string }

export default function ContributorTasksPage({
  initialTasks,
  initialTab = "todo",
  projectId,
}: {
  initialTasks: TaskListItem[];
  initialTab?: TaskStatus;
  projectId: string;
}) {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskListItem[]>(initialTasks);
  const [activeTab, setActiveTab] = useState<TaskStatus>(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskListItem | null>(null);

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const isFirstRender = useRef(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!user) await fetchUser();
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [fetchUser, user]);

  useEffect(() => {
    if (!projectId) return;
    getAssignees(projectId)
      .then(r => setAssignees(r.data || []))
      .catch(() => toast.error("Failed to load members"));
  }, [projectId]);

  useEffect(() => {
    if (!user || !projectId) return;

    // Skip fetch on initial mount if tasks are already provided for the active tab
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchTasks = async () => {
      try {
        const { data } = await api.get(`/api/project/${projectId}/tasks/${activeTab}`);
        const taskList = data.success ? data.data : Array.isArray(data) ? data : [];
        setTasks(taskList || []);
      } catch (err) {
        toast.error("Failed to load tasks");
      }
    };
    fetchTasks();
  }, [activeTab, user, projectId, refreshKey]);

  // Sync selectedTask with tasks when data refreshes
  useEffect(() => {
    if (selectedTask) {
      const updatedTask = tasks.find(t => t.id === selectedTask.id);
      if (updatedTask && JSON.stringify(updatedTask) !== JSON.stringify(selectedTask)) {
        setSelectedTask(updatedTask);
      }
    }
  }, [tasks, selectedTask]);

  const [projectData, setProjectData] = useState<ProjectDetails | null>(null);

  const { setProject: setGlobalProject } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      console.log("Fetching project details for contributor ID:", projectId);
      projectDetails(projectId)
        .then(res => {
          console.log("Received project data for contributor:", res.data);
          setProjectData(res.data);
          setGlobalProject({ id: res.data.id, title: res.data.title });
        })
        .catch(err => console.error("Failed to fetch project info", err));
    }
  }, [projectId, setGlobalProject]);

  if (isLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen bg-[#f8fcfb]"><PageLoader /></div>;
  }

  const getAssigneeName = (id?: string | null) => {
    if (!id) return "Unassigned";
    const member = assignees.find(m => m.userId === id);
    return member?.name || "Unknown User";
  };

  const myTasks = tasks.filter(t => t.assignedId === user.userId);

  const handleStartTask = async (taskId: string) => {
    try {
      await api.patch(`/api/tasks/${taskId}/start`);
      toast.success("Task started!");
      setSelectedTask(null);
      setActiveTab("in-progress");
      setRefreshKey(k => k + 1);
    } catch {
      toast.error("Failed to start task");
    }
  };

  const handleMarkAsDone = async (taskId: string) => {
    setSubmittingTaskId(taskId);
    setSubmitModalOpen(true);
  };

  const handleSubmitWork = async (data: { prLink: string, workDescription: string }) => {
    if (!submittingTaskId) return;

    setIsSubmitting(true);
    try {
      await api.patch(`/api/tasks/${submittingTaskId}/done`, {
        prLink: data.prLink,
        workDescription: data.workDescription,
      });
      toast.success("Task submitted for review!");
      setTasks(prev => prev.map(t => t.id === submittingTaskId ? { ...t, status: "done", approval: "under-review" } : t));
      setSelectedTask(null);
      setSubmitModalOpen(false);
      setActiveTab("done");
    } catch {
      toast.error("Failed to submit work");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCriteria = async (taskId: string, criteria: { text: string; completed: boolean }[]) => {
    try {
      await api.patch(`/api/tasks/${taskId}/criteria`, { acceptanceCriteria: criteria });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, acceptanceCriteria: criteria } : t));
    } catch {
      throw new Error("Failed to update criteria");
    }
  };

  const isCurrentUserCreator = user?.role === 'creator';

  const openDetails = (task: TaskListItem) => setSelectedTask(task);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fcfb]">
      <ContributorSidebar activeItem="tasks" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ContributorHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0c1d1a] mb-2">
              {activeTab === "todo" ? "Available Tasks" : "My Tasks"}
            </h1>
            <p className="text-[#6b7280]">
              {activeTab === "todo" ? "Browse tasks assigned to you" : activeTab === "in-progress" ? "You're working on these" : "Your completed work"}
            </p>
          </div>

          {/* Task Status Tabs */}
          <div className="bg-white border border-[#e6f4f2] rounded-lg mb-6">
            <div className="flex gap-8 px-6">
              {(["todo", "in-progress", "done"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    router.push(`/contributor-tasks?projectId=${projectId}&tab=${tab}`, { scroll: false });
                  }}
                  className={`py-4 px-2 font-semibold text-sm border-b-2 transition-colors capitalize ${activeTab === tab
                    ? "text-[#006b5b] border-[#006b5b]"
                    : "text-[#6b7280] border-transparent hover:text-[#0c1d1a]"
                    }`}
                >
                  {tab === "todo" ? "To Do" : tab === "in-progress" ? "In Progress" : "Done"}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs Content */}
          {activeTab === "todo" && (
            <TodoTab
              tasks={tasks}
              getAssigneeName={getAssigneeName}
              onViewDetails={openDetails}
              currentUserId={user.userId}
            />
          )}
          {activeTab === "in-progress" && (
            <InProgressTab
              tasks={myTasks}
              getAssigneeName={getAssigneeName}
              onViewDetails={openDetails}
              onMarkAsDone={handleMarkAsDone}
            />
          )}
          {activeTab === "done" && (
            <DoneTab
              tasks={myTasks}
              getAssigneeName={getAssigneeName}
              onViewDetails={openDetails}
            />
          )}
        </main>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsPanel
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          assignees={assignees}
          getAssigneeName={getAssigneeName}
          isCreator={isCurrentUserCreator}
          currentUserId={user.userId}
          onStartTask={handleStartTask}
          onMarkAsDone={handleMarkAsDone}
          onUpdateAcceptanceCriteria={handleUpdateCriteria}
          onTaskUpdated={() => setRefreshKey(k => k + 1)}
        />
      )}

      {/* Submit Work Modal */}
      <SubmitWorkModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSubmit={handleSubmitWork}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}