export enum PlanFeature {
    CREATE_PROJECTS = "CREATE_PROJECTS",
    JOIN_PROJECTS = "JOIN_PROJECTS",
    MAX_CONTRIBUTORS = "MAX_CONTRIBUTORS",
}

export const PLAN_FEATURE_LABELS: Record<PlanFeature, string> = {
    [PlanFeature.CREATE_PROJECTS]: "Project Creation Limit",
    [PlanFeature.JOIN_PROJECTS]: "Project Joining Limit",
    [PlanFeature.MAX_CONTRIBUTORS]: "Contributor Limit per Project",
};



