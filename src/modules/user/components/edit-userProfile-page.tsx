import { Header } from "@/shared/common/user-common/Header";

export default function ProfileEditPage() {



  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <Header user={{ name: "arunjith" }} />

      <main className="pt-24 pb-12 px-4 md:px-8 lg:px-6">
        <div className="max-w-7xl mx-auto">

          <div className="lg:pl-14">
            <div className="max-w-xl">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0c1d1a]">
                Edit Profile
              </h1>
              <p className="mt-1.5 text-sm text-[#6b7280]">
                Update your profile information and preferences
              </p>
            </div>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            {/* Profile Picture */}
            <div className="mb-12 text-center">
              <h2 className="text-lg font-semibold text-[#0c1d1a] mb-6">Profile Picture</h2>
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-[#d4a373] overflow-hidden shadow-xl ring-4 ring-white">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23d4a373' width='100' height='100'/%3E%3Ccircle cx='50' cy='35' r='18' fill='%23000'/%3E%3Cellipse cx='50' cy='75' rx='30' ry='25' fill='%23000'/%3E%3C/svg%3E"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="px-5 py-2.5 bg-[#006b5b] text-white text-sm font-medium rounded-lg hover:bg-[#005a4d] transition">
                  Upload New Photo
                </button>
                <p className="text-xs text-[#6b7280]">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="max-w-2xl mx-auto space-y-8">

              {/* Username */}
              <div>
                <label className="block text-base font-medium text-[#0c1d1a] mb-2">Username</label>
                <input
                  placeholder="arunjith_dev"
                  className="w-full h-14 px-4 rounded-lg border border-[#cdeae5] placeholder:text-[#45a193] focus:border-[#006b5b] focus:ring-2 focus:ring-[#006b5b]/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-[#0c1d1a] mb-2">Title / Role</label>
                <input
                  placeholder="Software Engineer"
                  className="w-full h-14 px-4 rounded-lg border border-[#cdeae5] placeholder:text-[#45a193] focus:border-[#006b5b] focus:ring-2 focus:ring-[#006b5b]/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-[#0c1d1a] mb-2">Bio</label>
                <textarea
                  rows={5}
                  placeholder="Tell us about yourself..."
                  className="w-full p-4 rounded-lg border border-[#cdeae5] placeholder:text-[#45a193] focus:border-[#006b5b] focus:ring-2 focus:ring-[#006b5b]/20 outline-none transition resize-none"
                />
                <p className="text-xs text-[#6b7280] mt-1">Max 500 characters.</p>
              </div>

              <div>
                <label className="block text-base font-medium text-[#0c1d1a] mb-2">Tech Stack</label>
                <input
                  placeholder="Type and press Enter to add a skill"
                  className="w-full h-14 px-4 rounded-lg border border-[#cdeae5] placeholder:text-[#45a193] focus:border-[#006b5b] focus:ring-2 focus:ring-[#006b5b]/20 outline-none transition"
                />
                <div className="mt-2 p-4 rounded-lg border border-[#cdeae5] bg-[#f9fefc] text-sm text-[#6b7280] min-h-[60px] flex items-center">
                  No skills added yet
                </div>
              </div>

              <div className="flex justify-center gap-6 pt-8">
                <button className="px-6 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] hover:bg-[#f8fcfb] transition font-medium">
                  Cancel
                </button>
                <button className="px-6 py-3 bg-[#006b5b] text-white font-bold rounded-lg hover:bg-[#005a4d] transition">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}