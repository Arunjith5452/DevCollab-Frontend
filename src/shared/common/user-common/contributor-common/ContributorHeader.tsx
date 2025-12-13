interface HeaderProps {
    projectName: string;
}

export default function ContributorHeader({ projectName }: HeaderProps) {
    return (
        <header className="bg-white border-b border-[#e6f4f2] px-10 py-4 flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-[#6b7280]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    <span className="text-[#0c1d1a] font-semibold text-base">{projectName}</span>
                </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#d4a373] overflow-hidden">
                <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23d4a373' width='100' height='100'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23fff'/%3E%3Cellipse cx='50' cy='75' rx='25' ry='20' fill='%23fff'/%3E%3C/svg%3E" 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                />
            </div>
        </header>
    );
}