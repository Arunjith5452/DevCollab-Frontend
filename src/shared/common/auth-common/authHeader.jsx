import { Code } from 'lucide-react';
// import { ThemeToggle } from "../ThemeToggle";


export function AuthHeader({ text, showButton = true, onButtonClick }) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e6f4f2] px-10 py-3">
      {/* Left section */}
      <div className="flex items-center gap-4 text-[#0c1d1a]" onClick={() => window.location.href = '/home'} style={{ cursor: 'pointer' }}>
        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <Code className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-[#0c1d1a] text-xl font-bold leading-tight tracking-[-0.015em]">
          DevCollab
        </h2>
      </div>

      {/* Right section: Button + Theme toggle */}
      <div className="flex items-center gap-4">
        {showButton && (
          <button
            onClick={onButtonClick}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 px-4 bg-[#006b5b] text-[#f8fcfb] text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">{text}</span>
          </button>
        )}

        {/* Theme toggle button */}
        {/* <ThemeToggle /> */}
      </div>
    </header>
  );
}
