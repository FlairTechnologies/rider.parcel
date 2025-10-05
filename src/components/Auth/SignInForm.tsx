"use client";
import Button from "../ui/custom/button";
import InputField from "../ui/InputField";
import { useState } from "react";
import { Loader } from "../ui/custom/loader";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import backgroundImage from "../../../public/authentication/yellow-bg.png";
import backgroundImageMobile from "../../../public/authentication/white-bg.png"


// Error/Success Message Component
export const MessageDisplay = ({
  message,
  type,
  isVisible,
}: {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
}) => {
  if (!isVisible || !message) return null;

  return (
    <div
      className={`text-sm font-medium mb-4 transition-all duration-300 w-full p-3 rounded-md ${type === "success"
          ? "text-green-600 border border-green-200 bg-green-50"
          : "text-red-500 border border-red-200 bg-red-50"
        }`}
    >
      {message}
    </div>
  );
};

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Toast state
  const [message, setMessage] = useState({
    text: "",
    type: "success" as "success" | "error",
    isVisible: false,
  });

  // Show message function
  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({
      text,
      type,
      isVisible: true,
    });

    // Auto-hide after 4 seconds
    setTimeout(() => {
      setMessage((prev) => ({ ...prev, isVisible: false }));
    }, 4000);
  };

  // Hide message function
  const hideMessage = () => {
    setMessage((prev) => ({ ...prev, isVisible: false }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      showMessage(
        `${!email ? "Email" : "Password"} is a required field.`,
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user_data", JSON.stringify(data));
        login(data.user, data.accessToken, data.refreshToken);
        showMessage("Login successful! Welcome back.", "success");
      } else {
        showMessage(data.error || "Incorrect Credentials", "error");
      }
    } catch (error: any) {
      showMessage(
        error?.data?.message || "An unexpected error occurred.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="flex items-center justify-center h-[100vh]">
        <div className="bg-white overflow-hidden w-full h-full flex">
          {/* Left Panel - Welcome Back */}
          <div className="hidden md:flex md:w-2/3 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 text-white p-12 flex-col justify-center items-center relative">
            <div className="absolute inset-0 bg-black bg-opacity-10 w-full h-full">
              <Image
                src={backgroundImage}
                alt="Sign In Background"
                layout="fill"
                objectFit="cover"
                className="opacity-50"
              />
            </div>
            <div className="z-10 text-center">
              <h2 className="text-6xl font-bold mb-4">Parcel</h2>
              {/* <h3 className="text-2xl font-semibold mb-6">Welcome Back!</h3> */}
              <p className="text-2xl mb-8 opacity-90 leading-relaxed">
                Quick signin, access your dashboard instantly, initiate and view
                deliveries.
              </p>
            </div>
          </div>

          {/* Right Panel - Sign In Form */}
          <div className="w-full h-full grid place-items-center md:w-1/2 md:p-12">
            <div className="absolute inset-0 bg-black bg-opacity-10 w-full h-[100vh] md:hidden">
              <Image
                src={backgroundImageMobile}
                alt="Sign In Background"
                layout="fill"
                objectFit="cover"
                className="opacity-30"
              />
            </div>
            <div className="w-full bg-white z-10 p-5 md:w-3/4 mx-auto shadow-md md:shadow-none">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Sign In</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <InputField
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <InputField
                    type="password"
                    placeholder="Enter a strong password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <MessageDisplay
                  message={message.text}
                  type={message.type}
                  isVisible={message.isVisible}
                />

                <div className="pt-6">
                  <Button label="Sign In" />
                </div>
              </form>

              <div className="mt-6 text-center">
                <a
                  href="/authentication/forget-password"
                  className="text-yellow-500 hover:text-yellow-600 text-sm font-medium"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Mobile Sign Up Link */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/authentication/signup"
                    className="text-yellow-500 hover:text-yellow-600 font-medium"
                  >
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInForm;
