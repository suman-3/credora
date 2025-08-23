import Image from "next/image";
import React from "react";

const Logo = ({dark}:{dark?:boolean}) => {
  return (
    <div className="w-auto flex items-center justify-center">
     {dark ? (
       <Image
        src="/logo/logo-dark.svg"
        alt="Logo"
        width={100}
        height={100}
        className="w-34 select-none object-contain"
        priority
      />
     ):(
       <Image
        src="/logo/logo.svg"
        alt="Logo"
        width={100}
        height={100}
        className="w-34 select-none object-contain"
        priority
      />
     )}
    </div>
  );
};

export default Logo;
