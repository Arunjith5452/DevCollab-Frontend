"use client"


import { AuthHeader, Footer, GitHubButton, GoogleButton } from "@/shared/common/auth-common";

export function LoginPage() {


  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        
        <AuthHeader text={"signup"} />
    
        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <div className="w-full" style={{height: '60px'}}></div>
            
            {/* Title */}
            <h2 className="text-[#0c1d1a] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Welcome Back
            </h2>
            <p className="text-[#0c1d1a] text-base font-normal leading-normal pb-8 pt-1 px-4 text-center">
              Log in to collaborate on open-source projects
            </p>

            {/* Email Field */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">Email</p>
                  <input
                    placeholder="Email"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border border-[#cdeae5] bg-white focus:border-[#cdeae5] h-14 placeholder:text-[#45a193] p-[15px] text-base font-normal leading-normal"
                  />
                </label>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">Password</p>
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border border-[#cdeae5] bg-white focus:border-[#cdeae5] h-14 placeholder:text-[#45a193] p-[15px] text-base font-normal leading-normal"
                  />
                </label>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full px-4">
                <button className="text-[#45a193] text-sm font-normal leading-normal underline cursor-pointer text-left">
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Log In Button */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full px-4 py-6">
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-5 w-full bg-[#006b5b] text-white text-base font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Log In</span>
                </button>
              </div>
            </div>

            {/* OR Divider */}
            <p className="text-[#45a193] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">or</p>

            {/* Social Login Buttons */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-col items-stretch px-4 py-3 gap-3">
                 <GitHubButton onClick={()=>{}} text={"Sign In with GitHub"} />
                 <GoogleButton onClick={()=>{}} text={"Sign In with Google"}/>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-[#45a193] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">
              Don't have an account? Sign Up
            </p>
          </div>
        </div>

        {/* Footer */}
        <Footer/>
      </div>
    </div>
  );
}
