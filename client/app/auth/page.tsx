"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes.js";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{name?: string; email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (isSignUp && !formData.name.trim()) newErrors.name = "Please input your name";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
  if (errors[name as keyof typeof errors]) {
    setErrors({ ...errors, [name]: undefined });
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    console.log(
      isSignUp ? "Sign up successful" : "Login successful",
      formData,
    );
    router.push(routes.home);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-gray-100">
      <div className="block md:hidden fixed inset-0 z-0">
        <Image
          src="/images/login_image.jpg"
          alt="Hanzi Study Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>
      <div className="relative z-10 w-full max-w-[580px] md:max-w-[1050px] min-h-auto md:min-h-[720px] rounded-[32px] shadow-2xl overflow-hidden md:grid md:grid-cols-2">
        <div className="p-5 md:p-10 flex flex-col justify-center relative overflow-hidden bg-white">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-lg">
              字
            </div>
            <span className="font-bold text-xl text-gray-800">
              hanzi<span className="text-brand-500">-study</span>
            </span>
          </div>
<h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-gray-900 mb-6">            Welcome to Hanzi Study
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                isSignUp ? "grid-rows-[0fr]/[1fr] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="overflow-hidden min-h-0">
                <div className="relative max-w-[380px] mx-auto">
                  <User aria-hidden="true" className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <label htmlFor="name-input" className="sr-only">
                    Name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    name="name"
                    placeholder="Họ và tên"
                    tabIndex={isSignUp ? 0 : -1}
                    aria-hidden={!isSignUp}
                    required={isSignUp}
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 pl-1">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="relative max-w-[380px] mx-auto">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <label htmlFor="email-input" className="sr-only">
                Email
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                id="email-input"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 pl-1">{errors.email}</p>
              )}
            </div>

            <div className="relative max-w-[380px] mx-auto">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <label htmlFor="password-input" className="sr-only">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 pl-1">{errors.password}</p>
              )}
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {!isSignUp && (
              <div className="text-right relative max-w-[380px] mx-auto">
                {/* <a
                  href="#"
                  className="text-xs text-gray-500 hover:text-brand-600"
                >
                  Forgot password?
                </a> */}
                <button
                  type="button"
                  onClick={() =>
                    console.log("Move to Forgot page")
                  }
                  className="text-xs text-gray-500 hover:text-brand-600"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="block w-full max-w-[380px] mx-auto py-3.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-medium rounded-xl text-base shadow-sm transition-all active:scale-[0.99]"
            >
              {isSubmitting ? "In progress..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              className="block w-full max-w-[380px] mx-auto py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl text-base flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Image
                src="/images/google_logo.png"
                alt="Google Logo"
                width={20}
                height={20}
                className="object-contain"
              />
              <span>
                {isSignUp ? "Sign up with Google" : "Sign in with Google"}
              </span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                }}
                className="font-semibold text-gray-900 hover:text-brand-600 transition-colors ml-1"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
        <div className="hidden md:block relative h-full">
          <Image
            src="/images/login_image.jpg"
            alt="Hanzi Study Background"
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
