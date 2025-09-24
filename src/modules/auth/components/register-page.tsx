"use client";

import {
  AuthHeader,
  GitHubButton,
  GoogleButton,
  Footer,
  Button,
  FormInputField,
} from "@/shared/common/auth-common";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "../types/auth.type";
import { signup } from "../services/auth.api";

export function RegisterPage() {
  const router = useRouter();
  const [formField, setFormField] = useState<FormField>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function setFormChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormField((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const errors: typeof fieldErrors = {};

    if (!formField.name.trim()) {
      errors.name = "Name is required";
    } else if (formField.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formField.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formField.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formField.password.trim()) {
      errors.password = "Password is required";
    } else if (formField.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formField.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formField.password !== formField.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const data = await signup(formField);

      if (data.token) {
        localStorage.setItem('tempToken', data.token);
      }

      console.log("Registration successful:", data);

      router.push("/otp-verification");

    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle backend field-specific errors
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
      } else {
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else if (error.response?.status === 409) {
          setFieldErrors({ email: "User already exists with this email" });
        } else if (error.response?.status === 400) {
          setError("Invalid input. Please check your details");
        } else if (error.message) {
          setError(error.message);
        } else {
          setError("Registration failed. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">

        {/* Header */}

        <AuthHeader text={"Log In"} />

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <div className="w-full" style={{ height: "40px" }}></div>

            {/* Title */}
            <h2 className="text-[#0c1d1a] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Create Your Account
            </h2>
            <p className="text-[#0c1d1a] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Join a community of developers collaborating on exciting projects.
            </p>

            {/* Error Display */}
            {error && (
              <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <FormInputField
                formField={formField}
                setFormChange={setFormChange}
                fieldErrors={fieldErrors}
              />

              {/* Sign Up Button */}
              <div className="flex justify-center">
                <div className="flex max-w-[480px] w-full px-4 py-3">
                  <Button
                    type="submit"
                    text={isLoading ? "Signing Up..." : "Sign Up"}
                  />
                </div>
              </div>
            </form>

            {/* OR Divider */}
            <p className="text-[#45a193] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
              or
            </p>

            {/* Social Buttons */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-col items-stretch px-4 py-3 gap-3">
                <GitHubButton
                  onClick={() => { }}
                  text="Sign Up with GitHub"
                />
                <GoogleButton
                  onClick={() => { }}
                  text="Sign Up with Google"
                />
              </div>
            </div>

            {/* Login Link */}
            <p className="text-[#45a193] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer">
              Already have an account? Log in
            </p>
          </div>
        </div>

        {/* Footer */}

        <Footer />
      </div>
    </div>
  );
}