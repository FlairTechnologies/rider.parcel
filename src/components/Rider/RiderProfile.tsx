"use client";

import { ArrowLeft, PencilIcon, Camera } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Button from "../ui/custom/button";
import InputField from "../ui/InputField";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Loader } from "../ui/custom/loader";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const RiderProfile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // New state for bike and additional user information
  const [bikeInfo, setBikeInfo] = useState({
    plateNo: user?.vehicle?.plateNo || "",
    model: user?.vehicle?.modl || "",
    type: user?.vehicle?.type || "",
  });

  const [additionalUserInfo, setAdditionalUserInfo] = useState({
    nin: user?.nin || "",
  });

  useEffect(() => {
    if (user) {
      setIsLoading(false);
      // Update bike and user info when user changes
      setBikeInfo({
        plateNo: user?.vehicle?.plateNo || "",
        model: user?.vehicle?.modl || "",
        type: user?.vehicle?.type || "",
      });
      setAdditionalUserInfo({
        nin: user?.nin || "",
      });
    }
  }, [user]);

  const handleLogOut = async () => {
    setIsLoading(true);
    try {
      logout();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message ? e.message : e,
        variant: "destructive",
      });
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header - Same as before */}
      <div className="bg-white p-4 flex items-center justify-between border-b">
        <div className="flex items-center justify-between w-full gap-4">
          <div onClick={() => router.back()}>
            <ArrowLeft className="h-9 w-9" />
          </div>
          <h1 className="text-xl font-[500]">Profile</h1>
          <div></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Avatar Section - Same as before */}
        <div className="flex justify-center mb-8 relative">
          <div className="relative">
            <Avatar className="h-24 w-24 bg-purple-100">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${
                  user?.username || user?.firstname || "Username"
                }`}
              />
              <AvatarFallback>
                {user && user.role == "user"
                  ? user?.username.charAt(0).toUpperCase() +
                    user?.username.charAt(1).toUpperCase()
                  : "UN"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Profile Section - Updated with new inputs */}
        <div className="space-y-6">
          <div className="space-y-7">
            <div className="px-2 md:px-4 space-y-7">
              <h2 className="text-xl font-[530] mb-2 flex items-center justify-between">
                Profile
                {/* <a>
                  <PencilIcon className="h-4 w-4" />
                </a> */}
              </h2>
              <div>
                <InputField
                  placeholder=""
                  disabled={true}
                  value={`${
                    user?.username ||
                    `${user?.firstname} ${user?.lastname}` ||
                    "John Doe"
                  }`}
                  type="text"
                />
              </div>
              <div className="mb-9">
                <InputField
                  placeholder=""
                  disabled={true}
                  value={`${user?.email || "parcel@gmail.com"}`}
                  type="email"
                />
              </div>

              {/* New NIN Input */}
              <div>
                <InputField
                  placeholder="National Identification Number"
                  disabled={true}
                  value={additionalUserInfo.nin}
                  type="text"
                />
              </div>
            </div>

            {/* Bike Information Section */}
            <div className="px-2 md:px-4 space-y-7">
              <h2 className="text-xl font-[530] mb-2">Vehicle Information</h2>
              <div>
                <InputField
                  placeholder="Plate Number"
                  disabled={true}
                  value={user?.vehicle?.plateNo}
                  type="text"
                />
              </div>
              <div>
                <InputField
                  placeholder="Bike Model"
                  disabled={true}
                  value={user?.vehicle?.modl}
                  type="text"
                />
              </div>
              <div>
                <InputField
                  placeholder="Bike Type"
                  disabled={true}
                  value={user?.vehicle?.type}
                  type="text"
                />
              </div>
            </div>

            {/* Security Section - Same as before */}
            <div className="px-2 md:px-4">
              <h2 className="text-[16px] font-[400] mb-3">
                Security & Password
              </h2>
              <InputField type="password" placeholder="Change Password" />
            </div>
          </div>

          {/* Action Buttons - Same as before */}
          <div className="space-y-4 pt-6 px-2 md:px-4">
            <Button label={"Logout"} onClick={handleLogOut} />
            <Button label={"Delete Account"} variant={"secondary"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderProfile;
