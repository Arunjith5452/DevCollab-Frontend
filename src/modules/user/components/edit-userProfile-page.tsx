"use client"

import { Header } from "@/shared/common/user-common/Header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useS3Upload } from "@/shared/hooks/uses3Upload";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { editProfile } from "../services/user.api";
import { getErrorMessage } from "@/shared/utils/ErrorMessage";
import { Camera, User } from "lucide-react";
import { useAuthStore } from "@/store/useUserStore";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, loading, error, refetch } = useCurrentUser();
  const { uploadToS3, fileUrl, loading: uploadLoading } = useS3Upload();

  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.name || "");
      setTitle(user.title || "");
      setBio(user.bio || "");
      setTechStack(user.techStack || []);
      setProfileImage(user.profileImage || "");
      setPreviewUrl(user.profileImage || "");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    const uploadedUrl = await uploadToS3(file);
    if (uploadedUrl) {
      setProfileImage(uploadedUrl);
      setPreviewUrl(uploadedUrl)
      toast.success("Photo uploaded!");
    }
  };

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      const skill = techInput.trim();
      if (!techStack.includes(skill)) {
        setTechStack([...techStack, skill]);
      }
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await editProfile({
        username: username.trim(),
        title: title.trim() || null,
        bio: bio.trim() || null,
        techStack: techStack.length > 0 ? techStack : null,
        profileImage: profileImage || null,
      });

      toast.success("Profile updated successfully!");
      await refetch();
      // Force refresh the global header state
      const { fetchUser } = useAuthStore.getState();
      await fetchUser(true);
      router.push("/user-profile");
    } catch (err) {
      getErrorMessage(err)
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <Header />

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
            <div className="mb-16 text-center">
              <h2 className="text-xl font-semibold text-[#0c1d1a] mb-8">Profile Picture</h2>

              <div className="flex flex-col items-center gap-6">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full overflow-hidden ring-8 ring-white shadow-2xl bg-gradient-to-br from-[#d4a373] to-[#b8860b] border-4 border-white">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#d4a373]">
                        <User className="w-24 h-24 text-white" />
                      </div>
                    )}
                  </div>
                  <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer">
                    <Camera className="w-12 h-12 text-white drop-shadow-2xl" />
                    <span className="absolute bottom-4 text-white text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      Change Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploadLoading}
                    />
                  </label>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => document.querySelector('input[type="file"]') as HTMLInputElement}
                    disabled={uploadLoading}
                    className={`px-8 py-3 bg-[#006b5b] text-white font-bold rounded-xl hover:bg-[#005a4d] transition-all shadow-lg hover:shadow-xl text-base ${uploadLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {uploadLoading ? "Uploading..." : "Upload New Photo"}
                  </button>
                  <p className="text-sm text-[#6b7280]">JPG, PNG • Max 2MB</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="max-w-2xl mx-auto space-y-8">
              <div>
                <label className="block text-base font-medium text-[#0c1d1a] mb-2">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-14 px-4 rounded-lg border border-[#cdeae5] focus:border-[#006b5b] focus:ring-2 focus:ring-[#006b5b]/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-[#0c1d1a] mb-2">Title / Role</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full h-14 px-4 rounded-lg border border-[#cdeae5] focus:border-[#006b5b] focus:ring-2 focus:ring-[#006b5b]/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-[#0c1d1a] mb-2">Bio</label>
                <textarea
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  placeholder="Tell us about yourself..."
                  className="w-full p-4 rounded-lg border border-[#cdeae5] focus:border-[#006b5b] focus:ring-2 focus:ring-[#006b5b]/20 outline-none transition resize-none"
                />
                <p className="text-xs text-[#6b7280] mt-1">{bio.length}/500</p>
              </div>

              <div>
                <label className="block text-base font-medium text-[#0c1d1a] mb-2">Tech Stack</label>
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleTechKeyDown}
                  placeholder="Type and press Enter to add a skill"
                  className="w-full h-14 px-4 rounded-lg border border-[#cdeae5] focus:border-[#006b5b] focus:ring-2 focus:ring-[#006b5b]/20 outline-none transition"
                />
                <div className="mt-2 p-4 rounded-lg border border-[#cdeae5] bg-[#f9fefc] min-h-[60px] flex flex-wrap gap-2 items-center">
                  {techStack.length === 0 ? (
                    <span className="text-sm text-[#6b7280]">No skills added yet</span>
                  ) : (
                    techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#006b5b] text-white text-xs font-medium rounded-full"
                      >
                        {tech}
                        <button
                          onClick={() => removeTech(tech)}
                          className="ml-2 hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-lg leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-6 pt-8">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] hover:bg-[#f8fcfb] transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving || uploadLoading}
                  className="px-6 py-3 bg-[#006b5b] text-white font-bold rounded-lg hover:bg-[#005a4d] transition disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}