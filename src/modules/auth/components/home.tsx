"use client"
import api from "@/lib/axios";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { Code, Users, GitBranch, Star, ArrowRight, Search, Bell, Menu, X, TrendingUp, Award } from 'lucide-react';

export function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/api/profile/me', { withCredentials: true })
      } catch (error: any) {
        toast.error(error.message)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Header - ONLY THIS CHANGED */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DevCollab</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Projects</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Community</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Resources</a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-600 rounded-full"></span>
              </button>
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all">
                Upgrade to Pro
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md"></div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-in slide-in-from-top duration-300">
              <nav className="flex flex-col space-y-3">
                <a href="#" className="text-gray-700 hover:text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">Projects</a>
                <a href="#" className="text-gray-700 hover:text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">Community</a>
                <a href="#" className="text-gray-700 hover:text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">Resources</a>
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold mt-4 hover:shadow-lg transition-all">
                  Upgrade to Pro
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Hero Section - ONLY THIS CHANGED */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 pt-32 pb-20 px-6 overflow-hidden">
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

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 py-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 backdrop-blur rounded-lg">
                    <Users className="w-5 h-5 text-green-200" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">10K+</p>
                    <p className="text-sm text-green-200">Developers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 backdrop-blur rounded-lg">
                    <GitBranch className="w-5 h-5 text-green-200" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">5K+</p>
                    <p className="text-sm text-green-200">Projects</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 backdrop-blur rounded-lg">
                    <Star className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.9</p>
                    <p className="text-sm text-green-200">Rating</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2">
                  <span>Explore Projects</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-700 transition-all">
                  Create Project
                </button>
              </div>

              {/* Social Proof */}
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
                  <p className="font-semibold text-white">2,000+ developers</p>
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
                    <p className="ml-4 text-blue-400">{'mission: '}<span className="text-orange-400">"collaborate"</span>,</p>
                    <p className="ml-4 text-blue-400">{'status: '}<span className="text-orange-400">"active"</span>,</p>
                    <p className="ml-4 text-blue-400">{'impact: '}<span className="text-orange-400">"worldwide"</span></p>
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

      {/* YOUR ORIGINAL Featured Projects Section - UNCHANGED */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Featured Projects</h2>

          <div className="space-y-8">
            {/* Project 1 - AI Assistant */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>AI, Python, Machine Learning</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    AI-Powered Code Assistant
                  </h3>
                  <p className="text-gray-600">
                    An intelligent code assistant that helps developers write better code by providing real-time suggestions and automated testing capabilities.
                  </p>
                  <button className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                    Apply to Join
                  </button>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 h-32 flex items-center justify-center">
                  <div className="text-green-400 font-mono text-sm">
                    <div>{'{ "ai": "assistant" }'}</div>
                    <div className="text-gray-500">// Smart coding</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 2 - Social Network */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Next.js, React, Node.js</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Decentralized Social Network
                  </h3>
                  <p className="text-gray-600">
                    A privacy-focused social platform that puts users in control of their data while enabling meaningful connections and communities.
                  </p>
                  <button className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                    Apply to Join
                  </button>
                </div>
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 h-32 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-teal-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 3 - E-commerce */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Vue.js, Django, PostgreSQL</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Open Source E-commerce Platform
                  </h3>
                  <p className="text-gray-600">
                    A comprehensive e-commerce solution with modern features like inventory management, payment processing, and analytics.
                  </p>
                  <button className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                    Apply to Join
                  </button>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-6 h-32 flex items-center justify-center">
                  <div className="bg-white p-3 rounded-lg shadow-lg">
                    <div className="w-8 h-6 bg-orange-500 rounded-t-md"></div>
                    <div className="w-8 h-2 bg-gray-300 rounded-b-md"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 4 - Educational Kit */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>React, TypeScript, WebGL</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Educational Game Development Kit
                  </h3>
                  <p className="text-gray-600">
                    Interactive learning platform for teaching programming concepts through gamification, making coding fun and accessible for students.
                  </p>
                  <button className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                    Apply to Join
                  </button>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 h-32 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 5 - Home Automation */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>IoT, React Native, Arduino</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Smart Home Automation System
                  </h3>
                  <p className="text-gray-600">
                    Complete IoT solution for home automation with mobile apps, device integration, and energy monitoring capabilities.
                  </p>
                  <button className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                    Apply to Join
                  </button>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl p-6 h-32 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg relative">
                    <div className="w-8 h-6 bg-blue-500 rounded-t-lg"></div>
                    <div className="w-8 h-4 bg-gray-200 rounded-b-lg"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YOUR ORIGINAL Footer - UNCHANGED */}
      <footer className="bg-gray-50 px-6 py-12 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">About</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Our Story</a></li>
                <li><a href="#" className="hover:text-gray-900">Team</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Community</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Discord</a></li>
                <li><a href="#" className="hover:text-gray-900">GitHub</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Support</a></li>
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">© 2024 DevShare. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <div className="w-5 h-5 bg-current rounded"></div>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <div className="w-5 h-5 bg-current rounded"></div>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <div className="w-5 h-5 bg-current rounded"></div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}