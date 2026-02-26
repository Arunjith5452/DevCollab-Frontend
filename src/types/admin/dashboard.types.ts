export interface DailyRegistration {
    _id: string;
    count: number;
}

export interface TechStackDistribution {
    _id: string;
    count: number;
}

export interface NewThisWeekStats {
    users: number;
    projects: number;
    creators: number;
    contributors: number;
}

export interface DashboardStats {
    totalUsers: number;
    totalProjects: number;
    activeContributors: number;
    totalCreators: number;
    dailyRegistrations: DailyRegistration[];
    techStackDistribution: TechStackDistribution[];
    newThisWeek: NewThisWeekStats;
}

export interface ActivityItem {
    type: string;
    id: string;
    name: string;
    title: string;
    desc: string;
    time: string;
    createdAt: string;
}

export interface DateRangeQuery {
    startDate?: string;
    endDate?: string;
}

export interface ChartDataPoint {
    date: string;
    value: number;
    height: string;
}

export interface TechDataPoint {
    name: string;
    count: number;
    percentage: number;
    color: string;
}
