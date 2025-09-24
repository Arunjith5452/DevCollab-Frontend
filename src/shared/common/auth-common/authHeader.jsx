export function AuthHeader({text}) {

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e6f4f2] px-10 py-3">
      <div className="flex items-center gap-4 text-[#0c1d1a]">
        <div className="size-4">
          <div className="w-4 h-4 bg-[#0c1d1a] rounded-sm"></div>
        </div>
        <h2 className="text-[#0c1d1a] text-lg font-bold leading-tight tracking-[-0.015em]">DevCollab</h2>
      </div>
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 px-4 bg-[#006b5b] text-[#f8fcfb] text-sm font-bold leading-normal tracking-[0.015em]">
        <span className="truncate">{text}</span>
      </button>
    </header>
  );
}