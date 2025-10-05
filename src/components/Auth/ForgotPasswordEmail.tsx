"use client";

import { useState } from "react";
import Button from "../ui/custom/button";
import InputField from "../ui/InputField";
import { Loader } from "../ui/custom/loader";
import { useRouter } from "next/navigation";
import { MessageDisplay } from "./SignInForm";

const ForgetPasswordEmail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "" });

  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
    isVisible: boolean;
  }>({
    text: "",
    type: "error",
    isVisible: false,
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    const { email } = formData;

    if (!email || !validateEmail(email)) {
      setMessage({
        text: "Please enter a valid email address.",
        type: "error",
        isVisible: true,
      });
      return;
    }

    setLoading(true);
    setMessage({ ...message, isVisible: false });

    try {
      const response = await fetch(`/api/users/reset_password/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Resend OTP response:", data);


      if (response.ok) {
        setMessage({
          text: "Check your email for a password reset OTP.",
          type: "success",
          isVisible: true,
        });
        localStorage.setItem("v-email-auth", email);
        localStorage.setItem("next-route", "/authentication/create-password");

        // Delay before redirecting to allow message to be read
        setTimeout(() => {
          router.push("/authentication/verify");
        }, 2000);
      } else {
        setMessage({
          text: data?.message || "Failed to send reset email.",
          type: "error",
          isVisible: true,
        });
      }
    } catch (error: any) {
      setMessage({
        text: error?.data?.message || "Something went wrong. Try again later.",
        type: "error",
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:p-10 rounded-lg w-full md:max-w-xl mx-auto flex justify-center items-center h-[100vh] md:h-auto md:shadow-md z-10 bg-white">
      <div className="w-full bg-white p-5 md:p-0 shadow-md md:shadow-none">
        {loading && <Loader />}
        <h2 className="text-3xl font-bold mb-2 mx-1">Forgot Password?</h2>
        <p className="mb-6 md:mb-3 mx-1">
          Input your email address to reset your password.
        </p>

        <form
          className="flex flex-col gap-4 w-full my-6 mb-10 space-y-2"
          onSubmit={handleSubmit}
        >
          <InputField
            type="email"
            placeholder="Enter your Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <MessageDisplay
            message={message.text}
            type={message.type}
            isVisible={message.isVisible}
          />


          <div className="pt-6">
            <Button label="Proceed" />
          </div>
        </form>

        <p className="text-center text-sm mt-2">
          Already have an account?{" "}
          <a href="/authentication/signin" className="text-yellow-400">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgetPasswordEmail;
