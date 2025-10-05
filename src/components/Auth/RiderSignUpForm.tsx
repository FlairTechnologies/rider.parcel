"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Button from "../ui/custom/button";
import InputField from "../ui/InputField";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "../ui/custom/loader";
// You will need to import these if you want the images and modal from the other layout
import backgroundImage from "../../../public/authentication/black-bg.png";
import Image from "next/image";
import backgroundImageMobile from "../../../public/authentication/white-bg.png"
import { PrivacyPolicyModal } from "./TermsandPolicy";


const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);

  const handleClosePrivacyPolicyModal = () => {
    setIsPrivacyPolicyOpen(false);
  };

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    numeric: false,
    specialChar: false,
  });

  const passwordRegex = {
    minLength: /.{6,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    numeric: /\d/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const validatePassword = (password: string) => {
    const newCriteria = {
      minLength: passwordRegex.minLength.test(password),
      uppercase: passwordRegex.uppercase.test(password),
      lowercase: passwordRegex.lowercase.test(password),
      numeric: passwordRegex.numeric.test(password),
      specialChar: passwordRegex.specialChar.test(password),
    };

    setPasswordCriteria(newCriteria);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "password") {
      validatePassword(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      toast({
        title: "Validation Error",
        description: "You have to agree to terms to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Ensure all password criteria are met
    if (Object.values(passwordCriteria).includes(false)) {
      toast({
        title: "Validation Error",
        description:
          "Password does not meet the required criteria. Please check the instructions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { firstname, lastname, email, password } = formData;

      const response = await fetch(`/api/riders/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, email, password }),
      });

      if (response.ok) {
        localStorage.setItem("v-email-auth", email);
        localStorage.setItem("next-route", "/authentication/signup/rider/verify");
        router.replace("/authentication/verify");
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="flex items-center justify-center h-[100vh]">
        <div className="bg-white overflow-hidden w-full h-full flex">
          {/* Left Panel */}
          <div className="hidden md:flex md:w-2/3 text-yellow-400 p-12 flex-col justify-center items-center relative">
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={backgroundImage}
                alt="Sign In Background"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="z-10 text-center text-white">
              <h2 className="text-6xl font-bold mb-4">Parcel</h2>
              <p className="text-2xl mb-8 opacity-90 leading-relaxed">
                Quick signup, access your dashboard instantly, initiate and view
                deliveries.
              </p>
            </div>
          </div>

          {/* Right Panel */}
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
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">Let's Get Started</h2>
              <p className="mb-6">Fill in the fields to get started.</p>
              <form
                className="flex flex-col gap-4 w-full mt-7"
                onSubmit={handleSubmit}
              >
                <div className="flex items-center gap-2 w-full">
                  <InputField
                    type="text"
                    placeholder="Firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                  <InputField
                    type="text"
                    placeholder="Lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </div>
                <InputField
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <InputField
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />

                {/* Password Criteria */}
                {formData.password && (
                  <div className="text-sm text-gray-600 mt-1">
                    <ul>
                      <li
                        className={`${passwordCriteria.minLength
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        At least 6 characters
                      </li>
                      <li
                        className={`${passwordCriteria.uppercase
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        At least one uppercase letter
                      </li>
                      <li
                        className={`${passwordCriteria.lowercase
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        At least one lowercase letter
                      </li>
                      <li
                        className={`${passwordCriteria.numeric ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        At least one numeric character
                      </li>
                      <li
                        className={`${passwordCriteria.specialChar
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        At least one special character
                      </li>
                    </ul>
                  </div>
                )}
                <div className="flex items-center gap-2 my-3">
                  <input
                    title="i agree"
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm">
                    I Agree to the Terms and Conditions & Privacy Policy
                  </p>
                </div>
                <Button label="Proceed" />
              </form>
              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <a href="/authentication/signin" className="text-yellow-400">
                  Sign In
                </a>
              </p>
              <div className="mt-16 text-center">
                <div className="text-center mt-8 mb-4">
                  <span className="text-sm text-gray-400">OR</span>
                </div>
                <Button label="Sign up as a user" variant="secondary" onClick={() => router.push('/authentication/signup')} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;