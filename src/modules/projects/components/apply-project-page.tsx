"use client";

import { Header } from "@/shared/common/user-common/Header";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { applyToJoin } from "../services/project.api";
import { getErrorMessage } from "@/shared/utils/ErrorMessage";
import { BackButton } from "@/shared/common/BackButton";

export default function ApplyToProjectPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const techString = searchParams.get("tech");

  const [availableTechStack, setAvailableTechStack] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [profileUrl, setProfileUrl] = useState("");
  const [reason, setReason] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState({
    techStack: "",
    profileUrl: "",
    reason: "",
  });

  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    if (techString) {
      try {
        const parsed = JSON.parse(techString);
        setAvailableTechStack(parsed);
      } catch { }
    }
  }, [techString]);

  const toggleTech = (tech: string) => {
    if (submitted) return;

    setSelectedTech((prev) =>
      prev.includes(tech)
        ? prev.filter((t) => t !== tech)
        : [...prev, tech]
    );
  };

  const handleSubmit = async () => {
    setBackendError("");

    let hasError = false;
    const newErrors = { techStack: "", profileUrl: "", reason: "" };

    if (selectedTech.length === 0) {
      newErrors.techStack = "Select at least one tech.";
      hasError = true;
    }

    if (!profileUrl.trim()) {
      newErrors.profileUrl = "Profile URL is required.";
      hasError = true;
    }

    if (!reason.trim()) {
      newErrors.reason = "Reason is required.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    try {
      await applyToJoin(projectId!, {
        techStack: selectedTech,
        profileUrl,
        reason,
      });

      setSubmitted(true);

    } catch (error) {
      const msg = getErrorMessage(error);
      setBackendError(msg);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden">
      <Header />

      <main className="flex-1 mt-20 py-8">
        <div className="px-4 sm:px-8 md:px-12 lg:px-24 xl:px-40 py-6">
          <BackButton />
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-8">
          <h1 className="text-[#0c1d1a] text-2xl sm:text-3xl font-bold text-center mb-12">
            Apply to Join This Project
          </h1>

          {/* BACKEND ERROR MESSAGE */}
          {backendError && (
            <p className="text-red-500 text-center mb-4 text-sm">
              {backendError}
            </p>
          )}

          {/* Tech Stack */}
          <div className="mb-8">
            <label className="text-[#0c1d1a] text-base font-semibold mb-4 block">
              Tech Stack
            </label>

            <div className="space-y-3">
              {availableTechStack.map((tech) => (
                <label key={tech} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTech.includes(tech)}
                    onChange={() => toggleTech(tech)}
                    disabled={submitted}
                    className="w-5 h-5 rounded border-[#cdeae5] text-[#006b5b] focus:ring-[#006b5b]"
                  />
                  <span className="text-[#0c1d1a] text-base">{tech}</span>
                </label>
              ))}
            </div>

            {/* FRONTEND ERROR */}
            {errors.techStack && (
              <p className="text-red-500 text-sm mt-2">{errors.techStack}</p>
            )}
          </div>

          {/* Profile URL */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Paste your GitHub or Portfolio link"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              disabled={submitted}
              className="w-full h-14 rounded border border-[#cdeae5] px-4 bg-white"
            />

            {/* FRONTEND ERROR */}
            {errors.profileUrl && (
              <p className="text-red-500 text-sm mt-2">{errors.profileUrl}</p>
            )}
          </div>

          {/* Reason */}
          <div className="mb-8">
            <textarea
              placeholder="Why do you want to join this project?"
              rows={6}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={submitted}
              className="w-full rounded border border-[#cdeae5] bg-white p-4"
            ></textarea>

            {/* FRONTEND ERROR */}
            {errors.reason && (
              <p className="text-red-500 text-sm mt-2">{errors.reason}</p>
            )}
          </div>

          {!submitted ? (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-[#006b5b] text-white rounded font-bold"
              >
                Send Application
              </button>
            </div>
          ) : (
            <p className="text-center text-[#006b5b] text-xl font-semibold">
              ✔ Application sent! Please wait for creator approval.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
