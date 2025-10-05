import VerificationForm from "@/components/Auth/VerificationForm";
import backgroundImage from "../../../../public/authentication/white-bg.png"
import Image from "next/image";
import React from "react";

const index = () => {
  return (
    <div className="relative h-screen md:min-h-screen grid place-items-center">
      <div className="absolute inset-0 bg-black bg-opacity-10 w-full h-full">
        <Image
          src={backgroundImage}
          alt="Sign In Background"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
        />
      </div>
      <VerificationForm />
    </div>
  );
};

export default index;
