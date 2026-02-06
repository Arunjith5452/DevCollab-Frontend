import { FormField } from "@/modules/auth/types/auth.type";
import { ChangeEvent, useState } from "react";
import { Eye, EyeOff, Mail, User } from "lucide-react";

type FormInputFieldProps = {
  formField: FormField,
  setFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export function FormInputField({ formField, setFormChange, fieldErrors = {} }: FormInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  return (
    <>
      {/* Full Name */}
      <div className="flex justify-center">
        <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1 relative">
            <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">
              Full Name
            </p>
            <div className="relative">
              <input
                name="name"
                value={formField.name}
                onChange={setFormChange}
                placeholder="Enter your full name"
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border bg-white h-14 placeholder:text-[#45a193] p-[15px] pr-10 text-base font-normal leading-normal ${fieldErrors.name
                  ? 'border-red-400 focus:border-red-400'
                  : 'border-[#cdeae5] focus:border-[#cdeae5]'
                  }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45a193]">
                <User size={20} />
              </div>
            </div>
            {fieldErrors.name && (
              <span className="text-red-500 text-xs mt-1">{fieldErrors.name}</span>
            )}
          </label>
        </div>
      </div>

      {/* Email */}
      <div className="flex justify-center">
        <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1 relative">
            <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">
              Email
            </p>
            <div className="relative">
              <input
                name="email"
                value={formField.email}
                onChange={setFormChange}
                placeholder="Enter your email"
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border bg-white h-14 placeholder:text-[#45a193] p-[15px] pr-10 text-base font-normal leading-normal ${fieldErrors.email
                  ? 'border-red-400 focus:border-red-400'
                  : 'border-[#cdeae5] focus:border-[#cdeae5]'
                  }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45a193]">
                <Mail size={20} />
              </div>
            </div>
            {fieldErrors.email && (
              <span className="text-red-500 text-xs mt-1">{fieldErrors.email}</span>
            )}
          </label>
        </div>
      </div>

      {/* Password */}
      <div className="flex justify-center">
        <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1 relative">
            <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">
              Password
            </p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formField.password}
                onChange={setFormChange}
                placeholder="Create a password"
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border bg-white h-14 placeholder:text-[#45a193] p-[15px] pr-10 text-base font-normal leading-normal ${fieldErrors.password
                  ? 'border-red-400 focus:border-red-400'
                  : 'border-[#cdeae5] focus:border-[#cdeae5]'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45a193] hover:text-[#006b5b] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="text-red-500 text-xs mt-1">{fieldErrors.password}</span>
            )}
          </label>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex justify-center">
        <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1 relative">
            <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">
              Confirm Password
            </p>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formField.confirmPassword}
                onChange={setFormChange}
                placeholder="Confirm your password"
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border bg-white h-14 placeholder:text-[#45a193] p-[15px] pr-10 text-base font-normal leading-normal ${fieldErrors.confirmPassword
                  ? 'border-red-400 focus:border-red-400'
                  : 'border-[#cdeae5] focus:border-[#cdeae5]'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45a193] hover:text-[#006b5b] transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</span>
            )}
          </label>
        </div>
      </div>
    </>
  );
}