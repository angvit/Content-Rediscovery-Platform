"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProfileDropdown from "./navbar/ProfileDropdown";

function LoginButton() {
  const pathname = usePathname();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    const foundToken = cookie ? cookie.split("=")[1] : null;
    setToken(foundToken);
  }, [pathname]);

  const onLogin = () => {
    if (token) {
      window.location.href = "/home";
    } else {
      window.location.href = "/login";
    }
  };

  const onLogout = () => {
    document.cookie = `token=; path=/; max-age=0`;
    localStorage.removeItem("csphere_token");
    window.location.href = "/login";
  };

  return (
    <>
      {!token ? (
        <div className="hidden md:flex">
          <Link
            href="/login"
            className="bg-[#E0E5E4] text-[#202A29] px-6 py-3 rounded-lg hover:bg-[#CCD3D2] text-base font-large"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-[#E0E5E4] text-[#202A29] px-6 py-3 rounded-lg hover:bg-[#CCD3D2] text-base font-large ml-4"
          >
            Signup
          </Link>
        </div>
      ) : (
        <>
          <ProfileDropdown />
        </>
      )}
    </>
  );
}

export default LoginButton;
