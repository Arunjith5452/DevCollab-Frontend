"use client"
import api from "@/lib/axios";
import { useEffect } from "react"
import toast from "react-hot-toast";


export function HomePage() {
  useEffect(() => {
  const fetchData = async () => {
    try {
      const { data } = await api.get('/api/profile/me',{ withCredentials: true })
      console.log(data)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  fetchData()
}, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full"></div>
            <span className="text-xl font-semibold">DevCollab</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900">Projects</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Community</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Resources</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
            Upgrade to Pro
          </button>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Collaborate on Open Source Projects
              </h1>
              <p className="text-lg text-green-100">
                Join a vibrant community of developers building amazing projects together.
                Contribute your skills, learn new technologies, and make an impact on the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                  Explore Projects
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors">
                  Create Project
                </button>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative">
              <div className="bg-green-500 rounded-2xl p-8 relative overflow-hidden">
                {/* Developer figures */}
                <div className="flex justify-center items-end space-x-4">
                  {/* Person 1 */}
                  <div className="relative">
                    <div className="w-16 h-20 bg-blue-600 rounded-t-full"></div>
                    <div className="w-20 h-24 bg-blue-700 rounded-lg -mt-4"></div>
                  </div>
                  {/* Person 2 */}
                  <div className="relative">
                    <div className="w-16 h-20 bg-orange-500 rounded-t-full"></div>
                    <div className="w-20 h-24 bg-orange-600 rounded-lg -mt-4"></div>
                  </div>
                </div>
                {/* Background elements */}
                <div className="absolute top-4 left-4 w-32 h-32 bg-green-400 rounded-2xl opacity-50"></div>
                <div className="absolute top-4 right-4 w-32 h-32 bg-green-400 rounded-2xl opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
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

      {/* Footer */}
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