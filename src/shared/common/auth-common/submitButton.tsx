export function Button({ text, type,onSubmit }:{type:"submit" | "button",text:string,onSubmit?:()=>void}) {
  return (
    <button
      type={type}
      onSubmit={onSubmit}
      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-5 w-full bg-[#006b5b] text-[#f8fcfb] text-base font-bold leading-normal tracking-[0.015em]">
      <span className="truncate">{text}</span>
    </button>
  );
}