"use client";

import { useEffect, useState } from "react";
import Button from "../ui/custom/button";
import InputField from "../ui/InputField";
import { Loader } from "../ui/custom/loader";
import { useRouter } from "next/navigation";
import { MessageDisplay } from "./SignInForm";

const ResetPasswordForm = () => {
  const [otp, setOtp] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
    isVisible: boolean;
  }>({
    text: "",
    type: "error",
    isVisible: false,
  });

  useEffect(() => {
    const savedOTP = localStorage.getItem("reset-password-otp");
    if (savedOTP) setOtp(savedOTP);
    else {
      setMessage({
        text: "No OTP found. Please request a new one.",
        type: "error",
        isVisible: true,
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || !password || !confirmPassword) {
      setMessage({
        text: "All fields are required.",
        type: "error",
        isVisible: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        text: "Passwords do not match.",
        type: "error",
        isVisible: true,
      });
      return;
    }

    setLoading(true);
    setMessage({ ...message, isVisible: false });

    try {
      const response = await fetch("/api/users/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, password }),
      });

      const data = await response.json();
      console.log(data)


      if (response.ok) {
        setMessage({
          text: "Password reset successfully. Redirecting...",
          type: "success",
          isVisible: true,
        });

        setTimeout(() => {
          localStorage.removeItem("reset-password-otp");
          router.replace("/authentication/signin");
        }, 2000);
      } else {
        setMessage({
          text: data?.error || data?.message,
          type: "error",
          isVisible: true,
        });
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setMessage({
        text: "An unexpected error occurred. Please try again.",
        type: "error",
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:p-6 rounded-md w-full md:max-w-md mx-auto h-[100vh] md:h-auto md:shadow-md z-10 bg-white">
      <div className="w-full bg-white p-5 md:p-0 shadow-md md:shadow-none">
        {loading && <Loader />}
        <h2 className="text-3xl font-bold mb-1 mx-1">Create Password</h2>
        <p className="mb-6 md:mb-3 mx-1">Input a new password</p>

        <form
          className="flex flex-col gap-4 w-full my-4 mb-10"
          onSubmit={handleSubmit}
        >
          <InputField
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
          />

          <MessageDisplay
            message={message.text}
            type={message.type}
            isVisible={message.isVisible}
          />

          <div className="mt-5" />
          <Button label="Reset Password" />
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/authentication/signin" className="text-yellow-400">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
