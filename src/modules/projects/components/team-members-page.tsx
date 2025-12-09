import CreatorHeader from "@/shared/common/user-common/Creator-header";
import { CreatorSidebar } from "@/shared/common/user-common/Creator-sidebar";

export default function TeamMembersPage() {
    return (

        <div className="flex h-screen overflow-hidden bg-white">
            <CreatorSidebar activeItem="members" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <CreatorHeader projectName="Project Alpha" />
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="p-8">
                        {/* Page Title */}
                        <h1 className="text-[#0c1d1a] text-2xl font-bold mb-6">Team Members</h1>

                        {/* Search Bar */}
                        <div className="mb-8">
                            <div className="relative max-w-xl">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#e6f4f2] rounded-lg text-[#0c1d1a] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#006b5b] focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Approved Members Section */}
                        <div className="mb-8">
                            <h2 className="text-[#0c1d1a] text-lg font-bold mb-4">Approved Members</h2>

                            <div className="bg-white rounded-lg border border-[#e6f4f2] overflow-hidden">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#f8f9fa] border-b border-[#e6f4f2]">
                                    <div className="col-span-4">
                                        <p className="text-[#6b7280] text-xs font-medium">Name</p>
                                    </div>
                                    <div className="col-span-3">
                                        <p className="text-[#6b7280] text-xs font-medium">Role</p>
                                    </div>
                                    <div className="col-span-5"></div>
                                </div>

                                {/* Table Rows */}
                                <div className="divide-y divide-[#e6f4f2]">
                                    {/* Member 1 */}
                                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#f8f9fa] transition-colors">
                                        <div className="col-span-4">
                                            <p className="text-[#0c1d1a] text-sm font-medium">Ethan Carter</p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-[#6b7280] text-sm">contributor</p>
                                        </div>
                                        <div className="col-span-5 flex justify-end gap-3">
                                            <button className="px-4 py-2 text-[#6b7280] text-sm font-medium hover:text-[#0c1d1a] transition-colors">
                                                Remove
                                            </button>
                                            <button className="px-4 py-2 text-[#006b5b] text-sm font-medium hover:text-[#005a4d] transition-colors">
                                                Save
                                            </button>
                                        </div>
                                    </div>

                                    {/* Member 2 */}
                                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#f8f9fa] transition-colors">
                                        <div className="col-span-4">
                                            <p className="text-[#0c1d1a] text-sm font-medium">Olivia Bennett</p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-[#6b7280] text-sm">maintainer</p>
                                        </div>
                                        <div className="col-span-5 flex justify-end gap-3">
                                            <button className="px-4 py-2 text-[#6b7280] text-sm font-medium hover:text-[#0c1d1a] transition-colors">
                                                Remove
                                            </button>
                                            <button className="px-4 py-2 text-[#006b5b] text-sm font-medium hover:text-[#005a4d] transition-colors">
                                                Save
                                            </button>
                                        </div>
                                    </div>

                                    {/* Member 3 */}
                                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#f8f9fa] transition-colors">
                                        <div className="col-span-4">
                                            <p className="text-[#0c1d1a] text-sm font-medium">Noah Thompson</p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-[#6b7280] text-sm">contributor</p>
                                        </div>
                                        <div className="col-span-5 flex justify-end gap-3">
                                            <button className="px-4 py-2 text-[#6b7280] text-sm font-medium hover:text-[#0c1d1a] transition-colors">
                                                Remove
                                            </button>
                                            <button className="px-4 py-2 text-[#006b5b] text-sm font-medium hover:text-[#005a4d] transition-colors">
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Join Requests Section */}
                        <div className="mb-8">
                            <h2 className="text-[#0c1d1a] text-lg font-bold mb-4">Pending Join Requests</h2>

                            <div className="space-y-4">
                                {/* Request 1 */}
                                <div className="bg-white rounded-lg border border-[#e6f4f2] p-6 flex items-center justify-between hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#ffc09f] overflow-hidden flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">AT</span>
                                        </div>
                                        <div>
                                            <p className="text-[#0c1d1a] font-semibold text-sm">Alex Turner</p>
                                            <p className="text-[#6b7280] text-xs">github.com/alexturner</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 text-[#6b7280] text-sm font-medium hover:text-[#0c1d1a] transition-colors">
                                            Approve / Reject
                                        </button>
                                    </div>
                                </div>

                                {/* Request 2 */}
                                <div className="bg-white rounded-lg border border-[#e6f4f2] p-6 flex items-center justify-between hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden">
                                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%238b7355' width='100' height='100'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23fff'/%3E%3Cellipse cx='50' cy='75' rx='25' ry='20' fill='%23fff'/%3E%3C/svg%3E" alt="Avatar" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-[#0c1d1a] font-semibold text-sm">Sophia Clark</p>
                                            <p className="text-[#6b7280] text-xs">sophia.clark@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 text-[#6b7280] text-sm font-medium hover:text-[#0c1d1a] transition-colors">
                                            Approve / Reject
                                        </button>
                                    </div>
                                </div>

                                {/* Request 3 */}
                                <div className="bg-white rounded-lg border border-[#e6f4f2] p-6 flex items-center justify-between hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#d4a373] overflow-hidden flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">DW</span>
                                        </div>
                                        <div>
                                            <p className="text-[#0c1d1a] font-semibold text-sm">Daniel Walker</p>
                                            <p className="text-[#6b7280] text-xs">github.com/danielw</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 text-[#6b7280] text-sm font-medium hover:text-[#0c1d1a] transition-colors">
                                            Approve / Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8f9fa] rounded transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center bg-[#006b5b] text-white text-sm font-medium rounded">1</button>
                            <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8f9fa] text-sm rounded transition-colors">2</button>
                            <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8f9fa] text-sm rounded transition-colors">3</button>
                            <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8f9fa] text-sm rounded transition-colors">4</button>
                            <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8f9fa] text-sm rounded transition-colors">5</button>
                            <span className="text-[#6b7280] text-sm">...</span>
                            <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8f9fa] text-sm rounded transition-colors">10</button>
                            <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8f9fa] rounded transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}