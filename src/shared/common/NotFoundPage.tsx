"use client"

import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Code, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';



interface NotFoundButtonProps{
  homeLink:string;
}

export default function NotFoundPage({homeLink}:NotFoundButtonProps) {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<{ left: string; top: string; animationDelay: string; animationDuration: string }[]>([]);

      const router = useRouter()


  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate particles only on client
  useEffect(() => {
    const generated = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${5 + Math.random() * 10}s`,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div 
          className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        />
        <div 
          className="absolute top-40 right-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{ transform: `translate(${-mousePosition.x}px, ${mousePosition.y}px)` }}
        />
        <div 
          className="absolute -bottom-20 left-1/2 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
          style={{ transform: `translate(${mousePosition.y}px, ${-mousePosition.x}px)` }}
        />

        {/* Floating Particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-30 animate-float"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Animated Logo */}
        <div className="mb-8 flex justify-center">
          <div 
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className={`w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
              isHovering ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
            }`}>
              <Code className="w-12 h-12 text-white" />
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-green-500 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
            {/* Sparkles */}
            {isHovering && (
              <>
                <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 animate-ping" />
                <Sparkles className="absolute -bottom-4 -left-4 w-6 h-6 text-green-400 animate-ping animation-delay-500" />
              </>
            )}
          </div>
        </div>

        {/* Animated 404 */}
        <div className="mb-8 relative">
          <h1 
            className="text-[180px] md:text-[250px] font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 leading-none select-none animate-gradient"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
              textShadow: '0 0 80px rgba(34, 197, 94, 0.5)'
            }}
          >
            404
          </h1>
          {/* Glitch Effect Lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500 to-transparent h-px top-1/3 animate-scan"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px top-2/3 animate-scan animation-delay-1000"></div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            Page Not Found
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed animate-fade-in animation-delay-300">
            Oops! Looks like you've ventured into uncharted territory. 
            The page you're looking for has disappeared into the digital void.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in animation-delay-600">
          <button 
            onClick={() => router.push(homeLink)}
            className="group relative px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-bold text-white text-lg overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/50"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <Home className="w-6 h-6" />
              <span>Back to Home</span>
            </span>
            {/* Button Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
            {/* Button Glow */}
            <div className="absolute inset-0 bg-green-500 blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <button 
            onClick={() => window.history.back()}
            className="group relative px-10 py-5 bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl font-bold text-white text-lg hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center justify-center space-x-2">
              <ArrowLeft className="w-6 h-6" />
              <span>Go Back</span>
            </span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 animate-fade-in animation-delay-900">
          {['Projects','Community','Documentation','Help'].map((link) => (
            <a key={link} href={`/${link.toLowerCase()}`} className="group flex items-center space-x-2 text-green-300 hover:text-green-100 transition-colors">
              <div className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-150 transition-transform"></div>
              <span className="font-medium">{link}</span>
            </a>
          ))}
        </div>
      </div>


      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200vh); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animate-float { animation: float linear infinite; }
        .animate-scan { animation: scan 4s linear infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animation-delay-300 { animation-delay: 0.3s; opacity: 0; }
        .animation-delay-600 { animation-delay: 0.6s; opacity: 0; }
        .animation-delay-900 { animation-delay: 0.9s; opacity: 0; }
        .animation-delay-1200 { animation-delay: 1.2s; opacity: 0; }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}
