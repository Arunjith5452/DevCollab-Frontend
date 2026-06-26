"use client"

import { Users, GitBranch, Star, ArrowRight, TrendingUp, Award, BarChart3, Code2, Zap } from 'lucide-react';
import { Header } from "@/shared/common/user-common/Header";
import { Footer } from "@/shared/common/user-common/Footer";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useUserStore';
import api from '@/lib/axios';
import { getPlatformStats, getFeaturedProjects } from '@/modules/projects/services/project.api';
import PageLoader from '@/shared/common/LoadingComponent';
import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/ui/terminal";

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
  difficulty?: string;
  image?: string;
}

/* ── Design tokens ─────────────────────────────────────── */
const CARD_GRADIENTS = [
  'from-violet-100 via-indigo-50 to-blue-100',
  'from-emerald-50 via-teal-50 to-cyan-100',
  'from-orange-50 via-amber-50 to-yellow-100',
  'from-sky-50 via-blue-50 to-indigo-100',
  'from-fuchsia-50 via-purple-50 to-violet-100',
];

const CARD_ICON_COLORS = [
  'text-indigo-400',
  'text-emerald-400',
  'text-orange-400',
  'text-sky-400',
  'text-fuchsia-400',
];

const STATUS_CONFIG: Record<string, { label: string; dot: string; className: string }> = {
  active:    { label: 'Active',     dot: 'bg-emerald-500', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100' },
  open:      { label: 'Open',       dot: 'bg-sky-500',     className: 'bg-sky-50 text-sky-700 border border-sky-200 ring-1 ring-sky-100' },
  closed:    { label: 'Closed',     dot: 'bg-gray-400',    className: 'bg-gray-100 text-gray-500 border border-gray-200' },
  completed: { label: 'Completed',  dot: 'bg-purple-500',  className: 'bg-purple-50 text-purple-700 border border-purple-200 ring-1 ring-purple-100' },
};

const DIFFICULTY_CONFIG: Record<string, { label: string; className: string }> = {
  beginner:     { label: '● Beginner',     className: 'text-emerald-600 bg-emerald-50 border border-emerald-200' },
  intermediate: { label: '●● Intermediate', className: 'text-amber-600 bg-amber-50 border border-amber-200' },
  advanced:     { label: '●●● Advanced',    className: 'text-red-600 bg-red-50 border border-red-200' },
};

export function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get('subscription_success')) {
      setTimeout(() => { fetchUser(true); }, 5000);
      toast.success("Subscription activated! Your Pro status will update shortly.");
      router.replace('/home');
    }
  }, [searchParams, fetchUser, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        try {
          await api.get('/api/profile/me', { withCredentials: true });
        } catch {
          console.log('User not authenticated');
        }
        const [statsRes, projectsRes] = await Promise.all([
          getPlatformStats(),
          getFeaturedProjects(),
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

  if (loading) return <PageLoader />;

  const getStatusInfo = (status: string) => {
    const key = status?.toLowerCase() ?? 'open';
    return STATUS_CONFIG[key] ?? STATUS_CONFIG['open'];
  };

  const getDifficultyInfo = (difficulty?: string) => {
    if (!difficulty) return null;
    return DIFFICULTY_CONFIG[difficulty.toLowerCase()] ?? null;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── Hero Section ── */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 pt-24 md:pt-32 pb-12 md:pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="text-white space-y-8">
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

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/project-list")}
                  className="group bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    if (!user) { toast.error('Please login to create a project'); router.push('/login'); }
                    else { router.push("/create-project"); }
                  }}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-700 transition-all"
                >
                  Create Project
                </button>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white shadow-lg" />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-white">{stats?.usersThisWeek || 0}+ developers</p>
                  <p className="text-green-200">joined this week</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <Terminal className="bg-gray-900 border-white/20 mb-4 shadow-xl font-mono max-w-full">
                  <TypingAnimation className="text-green-400">
                    {"> pnpm run devcollab --start"}
                  </TypingAnimation>
                  <AnimatedSpan className="text-gray-300">✔ Connecting global developer network.</AnimatedSpan>
                  <AnimatedSpan className="text-gray-300">✔ Fetching Open Source projects.</AnimatedSpan>
                  <AnimatedSpan className="text-green-500 font-bold mt-2">✔ Connection successful.</AnimatedSpan>
                  <TypingAnimation className="text-green-400 mt-4">{"const devCollab = {"}</TypingAnimation>
                  <AnimatedSpan className="text-blue-400 ml-4">
                    <span>mission: <span className="text-orange-400">&quot;collaborate&quot;</span>,</span>
                  </AnimatedSpan>
                  <AnimatedSpan className="text-blue-400 ml-4">
                    <span>status: <span className="text-orange-400">&quot;active&quot;</span>,</span>
                  </AnimatedSpan>
                  <AnimatedSpan className="text-blue-400 ml-4">
                    <span>impact: <span className="text-orange-400">&quot;worldwide&quot;</span></span>
                  </AnimatedSpan>
                  <AnimatedSpan className="text-green-400">{"}"}</AnimatedSpan>
                  <TypingAnimation className="text-gray-400 mt-2">
                    {"Success! Ready to build amazing things together."}
                  </TypingAnimation>
                </Terminal>
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

      {/* ── Featured Projects Section ── */}
      <section className="px-6 py-14 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                  <Zap className="w-3 h-3" />
                  Trending now
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Featured Projects</h2>
              <p className="mt-1.5 text-sm text-gray-500 max-w-md">
                Top open-source projects sorted by community interest — find your next contribution.
              </p>
            </div>
            <button
              onClick={() => router.push('/project-list')}
              className="group flex-shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              Browse all projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Project list */}
          {featuredProjects.length > 0 ? (
            <div className="space-y-4">
              {featuredProjects.map((project, index) => {
                const statusInfo = getStatusInfo(project.status);
                const difficultyInfo = getDifficultyInfo(project.difficulty);
                const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
                const iconColor = CARD_ICON_COLORS[index % CARD_ICON_COLORS.length];
                const hasCreator = Boolean(project.creatorName?.trim());
                const initials = hasCreator
                  ? project.creatorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                  : '';

                return (
                  <div
                    key={project.id}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-green-200 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                  >
                    {/* Subtle top accent line */}
                    <div className="h-0.5 w-full bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex flex-col md:grid md:grid-cols-3 gap-4 sm:gap-6 p-5 sm:p-6 items-start md:items-center">

                      {/* ── LEFT: content (2 cols) ── */}
                      <div className="w-full md:col-span-2 flex flex-col gap-3 order-2 md:order-1">

                        {/* Badge row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            Featured
                          </span>

                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.className}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                            {statusInfo.label}
                          </span>

                          {difficultyInfo && (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${difficultyInfo.className}`}>
                              <BarChart3 className="w-3 h-3" />
                              {project.difficulty}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-snug">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tech stack */}
                        {project.techStack && project.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.techStack.slice(0, 6).map((tech) => (
                              <span
                                key={tech}
                                className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 6 && (
                              <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-400 border border-gray-200">
                                +{project.techStack.length - 6} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer row: creator + applicants + CTA */}
                        <div className="flex flex-wrap items-center gap-4 pt-1 mt-1 border-t border-gray-100">

                          {/* Creator — only render if name exists */}
                          {hasCreator && (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm ring-2 ring-green-100">
                                {initials}
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold leading-none mb-0.5">Creator</p>
                                <p className="text-xs font-medium text-gray-700">{project.creatorName}</p>
                              </div>
                            </div>
                          )}

                          {/* Applicants — only if > 0 */}
                          {(project.applicationCount ?? 0) > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                <span className="font-semibold text-gray-600">{project.applicationCount}</span>
                                <span className="text-gray-400">applicants</span>
                              </div>
                            </div>
                          )}

                          {/* CTA */}
                          <button
                            onClick={() => router.push(`/project-details/${project.id}`)}
                            className="ml-auto inline-flex items-center gap-1.5 px-5 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 active:scale-95 transition-all shadow-sm hover:shadow-green-700/20 hover:shadow-md"
                          >
                            View Details
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* ── RIGHT: thumbnail ── */}
                      <div className="w-full md:w-auto flex-shrink-0 flex justify-center items-center rounded-xl h-44 sm:h-40 overflow-hidden order-1 md:order-2 relative">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-xl flex flex-col items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-500`}>
                            <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
                              <Code2 className={`w-7 h-7 ${iconColor}`} />
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Index number badge */}
                        <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm border border-white/60">
                          {index + 1}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5 shadow-sm">
                <GitBranch className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1.5">No featured projects yet</h3>
              <p className="text-sm text-gray-500 mb-7 max-w-xs leading-relaxed">
                Be the first to create a project and get it featured on the homepage.
              </p>
              <button
                onClick={() => {
                  if (!user) { toast.error('Please login to create a project'); router.push('/login'); }
                  else { router.push('/create-project'); }
                }}
                className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors shadow-sm"
              >
                Create the First Project
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}