"use client"

import { Users, GitBranch, Star, ArrowRight, TrendingUp, Award } from 'lucide-react';
import { Header } from "@/shared/common/user-common/Header";
import { Footer } from "@/shared/common/user-common/Footer";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useUserStore';
import api from '@/lib/axios';
import { getPlatformStats, getFeaturedProjects } from '@/modules/projects/services/project.api';
import PageLoader from '@/shared/common/LoadingComponent';

interface PlatformStats {
  totalUsers: number;
  totalProjects: number;
  activeProjects: number;
  averageRating: number;
  usersThisWeek: number;
  projectsThisWeek: number;
}

interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  creatorName: string;
  applicationCount: number;
  status: string;
  image?: string;
}

export function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get('subscription_success')) {
      // Wait 5 seconds to allow Stripe webhook to update the backend DB before re-fetching
      setTimeout(() => {
        fetchUser(true);
      }, 5000);
      toast.success("Subscription activated! Your Pro status will update shortly.");
      router.replace('/home');
    }
  }, [searchParams, fetchUser, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch user profile (optional - only for authenticated users)
        try {
          await api.get('/api/profile/me', { withCredentials: true });
        } catch (error) {
          // User not authenticated - this is fine for landing page
          console.log('User not authenticated');
        }

        // Fetch platform stats and featured projects (public data)
        const [statsRes, projectsRes] = await Promise.all([
          getPlatformStats(),
          getFeaturedProjects()
        ]);

        setStats(statsRes.data || statsRes);
        setFeaturedProjects(projectsRes.data || projectsRes);
      } catch (error) {
        const err = error as Error;
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 pt-24 md:pt-32 pb-12 md:pb-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Enhanced Hero Content */}
            <div className="text-white space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 hover:bg-white/20 transition-colors">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold">Trusted by 10,000+ Developers</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Collaborate on Open Source Projects
              </h1>

              <p className="text-lg text-green-100 leading-relaxed">
                Join a vibrant community of developers building amazing projects together.
                Contribute your skills, learn new technologies, and make an impact on the world.
              </p>

              {/* Stats Row - Dynamic */}
              <div className="flex flex-wrap gap-8 py-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 backdrop-blur rounded-lg">
                    <Users className="w-5 h-5 text-green-200" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalUsers || 0}+</p>
                    <p className="text-sm text-green-200">Developers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 backdrop-blur rounded-lg">
                    <GitBranch className="w-5 h-5 text-green-200" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalProjects || 0}+</p>
                    <p className="text-sm text-green-200">Projects</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 backdrop-blur rounded-lg">
                    <Star className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.averageRating || 0}</p>
                    <p className="text-sm text-green-200">Rating</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => { router.push("/project-list") }} className="group bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2">
                  <span>Explore Projects</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => { router.push("/create-project") }} className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-700 transition-all">
                  Create Project
                </button>
              </div>

              {/* Social Proof - Dynamic */}
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white shadow-lg"
                    ></div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-white">{stats?.usersThisWeek || 0}+ developers</p>
                  <p className="text-green-200">joined this week</p>
                </div>
              </div>
            </div>

            {/* Enhanced Illustration */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                {/* Code Preview Card */}
                <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm mb-4 shadow-xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-green-400 space-y-1">
                    <p>{'const devCollab = {'}</p>
                    <p className="ml-4 text-blue-400">{'mission: '}<span className="text-orange-400">&quot;collaborate&quot;</span>,</p>
                    <p className="ml-4 text-blue-400">{'status: '}<span className="text-orange-400">&quot;active&quot;</span>,</p>
                    <p className="ml-4 text-blue-400">{'impact: '}<span className="text-orange-400">&quot;worldwide&quot;</span></p>
                    <p>{'};'}</p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30 hover:scale-105 transition-transform">
                    <TrendingUp className="w-8 h-8 text-green-200 mb-2" />
                    <p className="text-white font-bold text-xl">+127%</p>
                    <p className="text-green-100 text-sm">Growth Rate</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30 hover:scale-105 transition-transform">
                    <Award className="w-8 h-8 text-yellow-300 mb-2" />
                    <p className="text-white font-bold text-xl">Top 1%</p>
                    <p className="text-green-100 text-sm">Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section - Dynamic */}
      <section className="px-6 py-10 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Featured Projects</h2>

          <div className="space-y-8">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project, index) => (
                <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-2 space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{project.techStack.join(', ') || 'Various Technologies'}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {project.title}
                      </h3>
                      <p className="text-gray-600">
                        {project.description}
                      </p>
                      <button
                        onClick={() => router.push(`/apply-project?projectId=${project.id}`)}
                        className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
                      >
                        Apply to Join
                      </button>
                    </div>
                    <div className={`bg-gradient-to-br ${index === 0 ? 'from-gray-800 to-gray-900' :
                      index === 1 ? 'from-teal-500 to-teal-600' :
                        index === 2 ? 'from-orange-400 to-red-500' :
                          index === 3 ? 'from-green-400 to-blue-500' :
                            'from-blue-500 to-teal-500'
                      } rounded-xl p-6 h-32 flex items-center justify-center`}>
                      {project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-white font-mono text-sm">
                          <div>{'{ "project": "' + project.title.substring(0, 10) + '..." }'}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No featured projects available at the moment.</p>
                <button
                  onClick={() => router.push('/create-project')}
                  className="mt-4 bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
                >
                  Create the First Project
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* YOUR ORIGINAL Footer - UNCHANGED */}
      <Footer />
    </div>
  );
}