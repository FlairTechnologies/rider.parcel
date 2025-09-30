"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../ui/custom/button";
import { Loader } from "../ui/custom/loader";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { MessageDisplay } from "./SignInForm";
import next from "next";

const VerificationForm = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [nextRoute, setNextRoute] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    const savedEmail = localStorage.getItem("v-email-auth");
    const nextRoute = localStorage.getItem("next-route");
    if (nextRoute) setNextRoute(nextRoute);
    else setNextRoute("/user/home");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleVerification = async (otp: string) => {
    if (otp.length !== 6 || isSubmitting) return;

    setIsSubmitting(true);
    setMessage({ ...message, isVisible: false });

    try {
      // 🔒 If this is password reset flow, skip API call and just redirect
      if (nextRoute === "/authentication/create-password") {
        localStorage.setItem("reset-password-otp", otp);
        setMessage({
          text: "OTP accepted. Redirecting to password reset...",
          type: "success",
          isVisible: true,
        });

        setTimeout(() => {
          router.replace(nextRoute);
        }, 1500);
        return;
      }

      // ✅ Normal email verification flow
      const response = await fetch("/api/users/verify_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, email }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user_data", JSON.stringify(data));
        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("reset-password-otp", otp);
        localStorage.removeItem("v-email-auth");

        setMessage({
          text: "Verification successful. Redirecting...",
          type: "success",
          isVisible: true,
        });

        setTimeout(() => {
          if (data.user.role === "rider") {
            router.replace("/authentication/signup/rider/verify");
          } else {
            router.replace(nextRoute);
          }
        }, 1500);
      } else {
        setMessage({
          text: data.error || "Invalid OTP provided.",
          type: "error",
          isVisible: true,
        });
      }
    } catch (err) {
      setMessage({
        text: "Something went wrong. Please try again.",
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleResendOtp = async () => {
    if (!email) return;

    setIsSubmitting(true);
    setMessage({ ...message, isVisible: false });

    try {
      const response = await fetch("/api/users/resend_verification_otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: "A new OTP has been sent to your email.",
          type: "success",
          isVisible: true,
        });
      } else {
        setMessage({
          text: data.error || "Failed to resend OTP.",
          type: "error",
          isVisible: true,
        });
      }
    } catch (error) {
      setMessage({
        text: "Something went wrong while resending OTP.",
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 md:p-10 bg-white w-full h-auto rounded-lg md:max-w-lg mx-auto shadow-none md:shadow-md z-10">
      {isSubmitting && <Loader />}

      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Email Verification
        </h2>

        <p className="mb-6 text-base mx-1 text-gray-500">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="flex flex-col space-y-2 justify-between items-center w-full gap-3">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(val) => setCode(val)}
              onComplete={handleVerification}
            >
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPGroup key={index}>
                  <InputOTPSlot
                    index={index}
                    className="p-6 text-2xl border border-black"
                  />
                </InputOTPGroup>
              ))}
            </InputOTP>

            <button
              type="button"
              className="text-sm text-yellow-500 hover:text-yellow-600"
              onClick={handleResendOtp}
              disabled={isSubmitting}
            >
              Resend Code
            </button>
          </div>

          <MessageDisplay
            message={message.text}
            type={message.type}
            isVisible={message.isVisible}
          />

          <Button
            label="Verify"
            disabled={code.length !== 6 || isSubmitting}
            onClick={() => handleVerification(code)}
          />
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

export default VerificationForm;
