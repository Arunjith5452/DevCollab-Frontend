"use client";
import { useEffect, useState } from "react";
import { Sidebar, Header } from "@/shared/common/admin-common";
import {ArrowUpRight, Bell, Calendar, Code, Download, Folder, FolderOpen, TrendingUp, UserCheck, Users } from "lucide-react";
import { getActivities, getDashboardStats } from "../services/admin.api";
import PageLoader from "@/shared/common/LoadingComponent";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardStats, ActivityItem, DateRangeQuery, ChartDataPoint, TechDataPoint } from "@/types/admin/dashboard.types";
import { Pagination } from "@/shared/common/Pagination";

export function Dashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProjects: 0,
    activeContributors: 0,
    totalCreators: 0,
    dailyRegistrations: [],
    techStackDistribution: [],
    newThisWeek: { users: 0, projects: 0, creators: 0, contributors: 0 }
  });
  const [loading, setLoading] = useState(true);

  const [activitiesData, setActivitiesData] = useState<{ activities: ActivityItem[], total: number }>({ activities: [], total: 0 });
  const [page, setPage] = useState(1);
  const LIMIT = 5;

  const [dateRange, setDateRange] = useState<{ startDate: Date | undefined, endDate: Date | undefined }>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    return { startDate: start, endDate: end };
  });
  const [activeFilter, setActiveFilter] = useState<'7d' | '28d' | 'custom'>('7d');
  const [showCustomDate, setShowCustomDate] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const query: DateRangeQuery = {};
        if (dateRange.startDate) query.startDate = dateRange.startDate.toISOString();
        if (dateRange.endDate) query.endDate = dateRange.endDate.toISOString();

        const response = await getDashboardStats(query);
        const data = response?.data || response;
        if (data && data.stats) {
          setStats(data.stats);
        } else if (data && data.data) {
          setStats(data.data);
        } else if (data && data.totalUsers !== undefined) {
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [dateRange]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivities({ page, limit: LIMIT });
        const data = response?.data || response;
        if (data && data.activities) {
          setActivitiesData(data);
        } else if (data && data.data && data.data.activities) {
          setActivitiesData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch activities", error);
      }
    };
    fetchActivities();
  }, [page]);


  const handleFilterChange = (filter: '7d' | '28d') => {
    setActiveFilter(filter);
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (filter === '7d' ? 7 : 28));
    setDateRange({ startDate: start, endDate: end });
  };

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    setActiveFilter('custom');
    const date = value ? new Date(value) : undefined;
    setDateRange(prev => ({ ...prev, [type === 'start' ? 'startDate' : 'endDate']: date }));
  };


  const chartData: ChartDataPoint[] = (() => {
    if (!dateRange.startDate || !dateRange.endDate) return [];

    const current = new Date(dateRange.startDate);
    current.setHours(0, 0, 0, 0);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999);

    const data: ChartDataPoint[] = [];
    const statsMap = new Map(stats.dailyRegistrations?.map(r => [r._id, r.count]) || []);

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      const count = statsMap.get(dateStr) || 0;

      data.push({
        date: current.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        value: count,
        height: '0%'
      });

      current.setDate(current.getDate() + 1);
    }
    return data;
  })();

  const maxVal = Math.max(...chartData.map(d => d.value), 1);
  chartData.forEach(d => d.height = Math.max((d.value / maxVal) * 100, 5) + '%');


  const totalTechCount = stats.techStackDistribution?.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const techColors = [
    'from-blue-600 to-blue-700',
    'from-green-600 to-emerald-600',
    'from-yellow-500 to-orange-500',
    'from-teal-600 to-cyan-600',
    'from-red-600 to-pink-600'
  ];

  const techData: TechDataPoint[] = stats.techStackDistribution?.map((t, index) => ({
    name: t._id,
    count: t.count,
    percentage: Math.round((t.count / totalTechCount) * 100),
    color: techColors[index % techColors.length]
  })) || [];


  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return { icon: UserCheck, bg: 'from-blue-600 to-blue-700' };
      case 'project': return { icon: FolderOpen, bg: 'from-teal-600 to-cyan-600' };
      case 'application': return { icon: Code, bg: 'from-purple-600 to-purple-700' };
      default: return { icon: Bell, bg: 'from-gray-600 to-gray-700' };
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem="dashboard" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard Overview"
          subtitle={`Wednesday, ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
          actions={
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-medium text-gray-700">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          }
        />

        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <PageLoader />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">New</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500 font-medium">+{stats.newThisWeek?.users || 0} new this week</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Folder className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">New</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalProjects}</p>
                  <p className="text-xs text-gray-500 font-medium">+{stats.newThisWeek?.projects || 0} new this week</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-orange-600 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">Active</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Active Contributors</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stats.activeContributors}</p>
                  <p className="text-xs text-gray-500 font-medium">+{stats.newThisWeek?.contributors || 0} approved apps this week</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">New</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Platform Creators</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalCreators}</p>
                  <p className="text-xs text-gray-500 font-medium">+{stats.newThisWeek?.creators || 0} new this week</p>
                </div>
              </div>

              {/* Performance Analytics */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Performance Analytics</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleFilterChange('7d')}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeFilter === '7d' ? 'text-white bg-teal-600 hover:bg-teal-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Last 7 days
                    </button>
                    <button
                      onClick={() => handleFilterChange('28d')}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeFilter === '28d' ? 'text-white bg-teal-600 hover:bg-teal-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Last 30 days
                    </button>
                    <button
                      onClick={() => setShowCustomDate(!showCustomDate)}
                      className={`p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${showCustomDate ? 'bg-gray-200' : ''}`}
                    >
                      <Calendar className="w-5 h-5" />
                    </button>

                    {showCustomDate && (
                      <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-right-2 duration-300">
                        <input
                          type="date"
                          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                          onChange={(e) => handleCustomDateChange('start', e.target.value)}
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          type="date"
                          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                          onChange={(e) => handleCustomDateChange('end', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Registrations Graph */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">User Registrations</h3>
                        <p className="text-sm text-gray-500">Period Total: <span className="font-semibold text-gray-700">{stats.dailyRegistrations?.reduce((a, b) => a + b.count, 0) || 0} new users</span></p>
                      </div>
                    </div>
                    <div className="flex items-stretch justify-between h-64 space-x-2 overflow-x-auto pb-2 pt-10">
                      {chartData.length > 0 ? chartData.map((bar, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center justify-end group/bar cursor-pointer min-w-[30px] max-w-[50px] h-full">
                          <div className="relative w-full flex-1 flex items-end">
                            {/* Bar */}
                            <div
                              className="w-full bg-gradient-to-t from-teal-600 to-cyan-500 rounded-t-xl transition-all group-hover/bar:from-teal-700 group-hover/bar:to-cyan-600 shadow-lg"
                              style={{ height: bar.height }}
                            >
                              {/* Tooltip */}
                              <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap font-semibold shadow-lg z-10 pointer-events-none">
                                {bar.value} users
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-600 font-semibold mt-3 whitespace-nowrap">{bar.date}</p>
                        </div>
                      )) : <div className="w-full h-full flex items-center justify-center text-gray-400">No data for this period</div>}
                    </div>
                  </div>

                  {/* Tech Stack Distribution */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-bold text-gray-900 mb-1">Tech Stack Distribution</h3>
                    </div>
                    <div className="space-y-5">
                      {techData.length > 0 ? techData.map((tech, index) => (
                        <div key={index} className="group/tech">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-800 font-bold">{tech.name}</span>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-gray-500 font-medium">{tech.count} projects</span>
                              <span className="text-sm font-bold text-gray-900">{tech.percentage}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                              className={`bg-gradient-to-r ${tech.color} h-3 rounded-full transition-all duration-500 shadow-lg`}
                              style={{ width: `${tech.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center text-gray-500 py-10">No projects data available</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">Recent Activity</h2>
                      <p className="text-sm text-gray-500">Latest updates from your platform</p>
                    </div>
                    <Link href="/admin/projects" className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center space-x-1 hover:bg-teal-50 px-3 py-2 rounded-lg transition-all">
                      <span>View All</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-1">
                    {activitiesData.activities.length > 0 ? activitiesData.activities.map((item, index) => {
                      const style = getActivityIcon(item.type);
                      return (
                        <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group">
                          <div className={`w-12 h-12 bg-gradient-to-br ${style.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                            <style.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-bold mb-1">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-teal-600 font-semibold">{new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="text-center text-gray-500 py-4">No recent activity</div>
                    )}
                  </div>

                  {/* Pagination */}
                  {activitiesData.total > LIMIT && (
                    <Pagination
                      currentPage={page}
                      totalPages={Math.ceil(activitiesData.total / LIMIT)}
                      onPageChange={setPage}
                      totalItems={activitiesData.total}
                      itemsPerPage={LIMIT}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
