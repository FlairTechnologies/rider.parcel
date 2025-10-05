"use client";

import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "../ui/InputField";
import { Label } from "../ui/label";
import Button from "../ui/custom/button";
import { toast } from "@/hooks/use-toast";
import { Loader } from "../ui/custom/loader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { resolve } from "path";

export default function RegisterVehicle() {
  const [loading, setLoading] = useState(false);
  // const { accessToken } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "",
    modl: "",
    color: "",
    plateNo: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before sending
    if (
      !formData.type ||
      !formData.modl ||
      !formData.color ||
      !formData.plateNo
    ) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("/api/riders/vehicle", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.replace("/rider/home");
      } else {
        const errorData = await response.json();
        console.error(errorData);
        if (errorData.code === 401) {
          toast({
            title: "Error",
            description: "User is unauthorized, please login again.",
            variant: "destructive",
          });
          router.replace("/");
        } else {
          toast({
            title: "Error",
            description: errorData.message || "Failed to register vehicle.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex pt-[20%] md:pt-4 md:items-center justify-center md:p-4">
      {loading && <Loader />}
      <Card className="w-full max-w-lg shadow-none md:shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Register Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Type */}
            <div>
              <Label htmlFor="type" className="mb-3 ml-3 block text-gray-700">
                Vehicle Type
              </Label>
              <InputField
                name="type"
                type="text"
                placeholder="Enter vehicle type (e.g., motorcycle)"
                value={formData.type}
                onChange={handleInputChange}
              />
            </div>

            {/* Vehicle Modl */}
            <div>
              <Label htmlFor="modl" className="mb-3 ml-3 block text-gray-700">
                Vehicle Model
              </Label>
              <InputField
                name="modl"
                type="text"
                placeholder="Enter vehicle model (e.g., 2018)"
                value={formData.modl}
                onChange={handleInputChange}
              />
            </div>

            {/* Vehicle Color */}
            <div>
              <Label htmlFor="color" className="mb-3 ml-3 block text-gray-700">
                Vehicle Color
              </Label>
              <InputField
                name="color"
                type="text"
                placeholder="Enter vehicle color (e.g., red)"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>

            {/* Plate Number */}
            <div>
              <Label
                htmlFor="plateNo"
                className="mb-3 ml-3 block text-gray-700"
              >
                Plate Number
              </Label>
              <InputField
                name="plateNo"
                type="text"
                placeholder="Enter plate number (e.g., KYC234K1Q)"
                value={formData.plateNo}
                onChange={handleInputChange}
              />
            </div>

            {/* Submit Button */}
            <div className="text-center mt-10">
              <Button label={"Verify"} />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
