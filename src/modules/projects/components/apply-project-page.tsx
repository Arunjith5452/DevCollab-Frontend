import { Header } from "@/shared/common/user-common/Header";

export default function ApplyToProjectPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden">
      {/* Header */}
      <Header user={{name:"Arunjith"}} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-40 py-8 mt-20">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <h1 className="text-[#0c1d1a] text-2xl sm:text-3xl font-bold text-center mb-12">
            Apply to Join This Project
          </h1>

          {/* Tech Stack Section */}
          <div className="mb-8">
            <label className="text-[#0c1d1a] text-base font-semibold mb-4 block">
              Tech Stack
            </label>
            <div className="space-y-3">
              {["Python", "JavaScript", "React", "Node"].map((tech) => (
                <label
                  key={tech}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-[#cdeae5] text-[#006b5b] focus:ring-[#006b5b] focus:ring-offset-0"
                  />
                  <span className="text-[#0c1d1a] text-base">{tech}</span>
                </label>
              ))}
            </div>
          </div>

          {/* GitHub/Portfolio Link */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Paste your GitHub or Portfolio link"
              className="w-full h-14 rounded border border-[#cdeae5] bg-white px-4 text-base text-[#0c1d1a] placeholder:text-[#9ca3af] focus:border-[#006b5b] focus:outline-none transition-colors"
            />
          </div>

          {/* Why Join Textarea */}
          <div className="mb-8">
            <textarea
              placeholder="Why do you want to join this project?"
              rows={6}
              className="w-full rounded border border-[#cdeae5] bg-white p-4 text-base text-[#0c1d1a] placeholder:text-[#9ca3af] focus:border-[#006b5b] focus:outline-none transition-colors resize-none"
            ></textarea>
          </div>

          {/* Send Application Button */}
          <div className="flex justify-center">
            <button className="px-8 py-3 bg-[#006b5b] text-white text-base font-bold rounded hover:bg-[#005a4d] transition-colors">
              Send Application
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
