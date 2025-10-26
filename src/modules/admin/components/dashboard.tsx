"use client";

import { useEffect } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Activity, ArrowUpRight, Bell, Calendar, ChevronDown, Code, DollarSign, Download, Filter, Folder, FolderOpen, Home, Mail, MoreVertical, Search, Settings, Target, TrendingUp, User, UserCheck, Users } from "lucide-react";

export function Dashboard() {

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await api.get("/api/profile/me", { withCredentials: true });

    }catch(error : any){
        toast.error(error.message)
    }
}

    fetchAdminData();
  }, [])

  return (
  <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
             {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">DevCollab</span>
              <p className="text-xs text-gray-500 mt-0.5">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pt-5 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <div className="space-y-1 mb-6">
            <a href="/admin/dashboard" className="group flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3">
                <Home className="w-5 h-5" />
                <span className="font-semibold">Dashboard</span>
              </div>
            </a>
            <a href="/admin/userManagement" className="group flex items-center justify-between px-4 py-3.5 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-all">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5" />
                <span className="font-medium">Users</span>
              </div>
              <span className="text-xs bg-gray-200 text-gray-700 group-hover:bg-teal-200 group-hover:text-teal-700 px-2.5 py-1 rounded-lg font-semibold transition-all">1.2K</span>
            </a>
            <a href="#" className="group flex items-center justify-between px-4 py-3.5 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-all">
              <div className="flex items-center space-x-3">
                <Folder className="w-5 h-5" />
                <span className="font-medium">Projects</span>
              </div>
              <span className="text-xs bg-gray-200 text-gray-700 group-hover:bg-teal-200 group-hover:text-teal-700 px-2.5 py-1 rounded-lg font-semibold transition-all">567</span>
            </a>
            <a href="#" className="group flex items-center space-x-3 px-4 py-3.5 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-all">
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Revenue</span>
            </a>
            <a href="#" className="group flex items-center space-x-3 px-4 py-3.5 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-all">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </a>
            <a href="#" className="group flex items-center space-x-3 px-4 py-3.5 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-all">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </a>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">John Admin</p>
              <p className="text-xs text-gray-500 truncate">admin@devcollab.io</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Wednesday, October 22, 2025</span>
                </div>
                <span>•</span>
                <span className="text-teal-600 font-medium">Real-time data</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-medium text-gray-700">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
              <button className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white animate-pulse"></span>
              </button>
              <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg transition-all">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">+12%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">1,234</p>
              <p className="text-xs text-gray-500 font-medium">+42 new this week</p>
            </div>

            {/* Total Projects */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">+8%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">567</p>
              <p className="text-xs text-gray-500 font-medium">+23 new this week</p>
            </div>

            {/* Pending Messages */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-600 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                  <Target className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">Urgent</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Pending Messages</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">23</p>
              <p className="text-xs text-gray-500 font-medium">Requires attention</p>
            </div>

            {/* Active Creators */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">+15%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Active Creators</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">456</p>
              <p className="text-xs text-gray-500 font-medium">+31 new this week</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Performance Analytics</h2>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">
                  Last 7 days
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Last 30 days
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly User Registrations */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Weekly User Registrations</h3>
                    <p className="text-sm text-gray-500">Total: <span className="font-semibold text-gray-700">287 new users</span></p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="flex items-end justify-between h-56 space-x-3">
                  {[
                    { day: 'Mon', height: '60%', value: 42 },
                    { day: 'Tue', height: '75%', value: 53 },
                    { day: 'Wed', height: '85%', value: 61 },
                    { day: 'Thu', height: '70%', value: 48 },
                    { day: 'Fri', height: '90%', value: 67 },
                    { day: 'Sat', height: '65%', value: 45 },
                    { day: 'Sun', height: '55%', value: 38 }
                  ].map((bar, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center group/bar cursor-pointer">
                      <div className="relative w-full">
                        <div 
                          className="w-full bg-gradient-to-t from-teal-600 to-cyan-500 rounded-t-xl transition-all group-hover/bar:from-teal-700 group-hover/bar:to-cyan-600 shadow-lg"
                          style={{ height: bar.height }}
                        >
                          <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap font-semibold shadow-lg">
                            {bar.value} users
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 font-semibold mt-3">{bar.day}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Distribution */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Tech Stack Distribution</h3>
                    <p className="text-sm text-gray-500">Most popular technologies</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="space-y-5">
                  {[
                    { name: 'React', value: 85, count: 482, color: 'from-blue-600 to-blue-700' },
                    { name: 'Node.js', value: 70, count: 397, color: 'from-green-600 to-emerald-600' },
                    { name: 'Python', value: 45, count: 255, color: 'from-yellow-500 to-orange-500' },
                    { name: 'Vue.js', value: 35, count: 198, color: 'from-teal-600 to-cyan-600' },
                    { name: 'Angular', value: 65, count: 368, color: 'from-red-600 to-pink-600' }
                  ].map((tech, index) => (
                    <div key={index} className="group/tech">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-800 font-bold">{tech.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-gray-500 font-medium">{tech.count} projects</span>
                          <span className="text-sm font-bold text-gray-900">{tech.value}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div 
                          className={`bg-gradient-to-r ${tech.color} h-3 rounded-full transition-all duration-500 shadow-lg`}
                          style={{ width: `${tech.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
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
                <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center space-x-1 hover:bg-teal-50 px-3 py-2 rounded-lg transition-all">
                  <span>View All</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-1">
                {[
                  { icon: UserCheck, bg: 'from-blue-600 to-blue-700', title: 'User Sarah joined the platform', desc: 'New registration from San Francisco, CA', time: '2 hours ago' },
                  { icon: FolderOpen, bg: 'from-teal-600 to-cyan-600', title: 'Project "E-commerce Platform" created', desc: 'React, Node.js, PostgreSQL stack', time: '3 hours ago' },
                  { icon: User, bg: 'from-purple-600 to-purple-700', title: 'User David updated profile', desc: 'Added new skills and portfolio items', time: '5 hours ago' },
                  { icon: Mail, bg: 'from-orange-600 to-pink-600', title: 'Contact message from Alex received', desc: 'Inquiry about enterprise features', time: '1 day ago' },
                  { icon: FolderOpen, bg: 'from-emerald-600 to-green-600', title: 'Project "Mobile App" updated', desc: 'New features and bug fixes deployed', time: '2 days ago' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-bold mb-1">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-teal-600 font-semibold">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
