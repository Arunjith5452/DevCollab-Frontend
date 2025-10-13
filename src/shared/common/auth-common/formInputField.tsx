import { ChangeEvent } from "react";

type FormInputFieldProps = {
  formField: any,
  setFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export function FormInputField({ formField, setFormChange, fieldErrors = {} }: FormInputFieldProps) {

  return (
    <>
      {/* Full Name */}
      <div className="flex justify-center">
        <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">
              Full Name
            </p>
            <input
              name="name"
              value={formField.name}
              onChange={setFormChange}
              placeholder="Enter your full name"
              className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border bg-white h-14 placeholder:text-[#45a193] p-[15px] text-base font-normal leading-normal ${
                fieldErrors.name 
                  ? 'border-red-400 focus:border-red-400' 
                  : 'border-[#cdeae5] focus:border-[#cdeae5]'
              }`}
            />
            {fieldErrors.name && (
              <span className="text-red-500 text-xs mt-1">{fieldErrors.name}</span>
            )}
          </label>
        </div>
      </div>

      {/* Email */}
      <div className="flex justify-center">
        <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">
              Email
            </p>
            <input
              name="email"
              value={formField.email}
              onChange={setFormChange}
              placeholder="Enter your email"
              className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border bg-white h-14 placeholder:text-[#45a193] p-[15px] text-base font-normal leading-normal ${
                fieldErrors.email 
                  ? 'border-red-400 focus:border-red-400' 
                  : 'border-[#cdeae5] focus:border-[#cdeae5]'
              }`}
            />
            {fieldErrors.email && (
              <span className="text-red-500 text-xs mt-1">{fieldErrors.email}</span>
            )}
          </label>
        </div>
      </div>

      {/* Password */}
      <div className="flex justify-center">
        <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">
              Password
            </p>
            <input
              type="password"
              name="password"
              value={formField.password}
              onChange={setFormChange}
              placeholder="Create a password"
              className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border bg-white h-14 placeholder:text-[#45a193] p-[15px] text-base font-normal leading-normal ${
                fieldErrors.password 
                  ? 'border-red-400 focus:border-red-400' 
                  : 'border-[#cdeae5] focus:border-[#cdeae5]'
              }`}
            />
            {fieldErrors.password && (
              <span className="text-red-500 text-xs mt-1">{fieldErrors.password}</span>
            )}
          </label>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex justify-center">
        <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">
              Confirm Password
            </p>
            <input
              type="password"
              name="confirmPassword"
              value={formField.confirmPassword}
              onChange={setFormChange}
              placeholder="Confirm your password"
              className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border bg-white h-14 placeholder:text-[#45a193] p-[15px] text-base font-normal leading-normal ${
                fieldErrors.confirmPassword 
                  ? 'border-red-400 focus:border-red-400' 
                  : 'border-[#cdeae5] focus:border-[#cdeae5]'
              }`}
            />
            {fieldErrors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</span>
            )}
          </label>
        </div>
      </div>

      {/* Debug: Show current state - Remove this in production */}
      {/* <pre className="text-sm p-4">{JSON.stringify(formField, null, 2)}</pre> */}
    </>
  );
}