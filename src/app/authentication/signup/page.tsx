import SignUpForm from "@/components/Auth/RiderSignUpForm";
import React, { useState } from "react";

const index = () => {
  return (
    <div className="h-full md:min-h-screen grid place-items-center bg-gradient-to-tl from-yellow-200 via-yellow-100 to-white">
      <SignUpForm />
    </div>
  );
};

export default index;
