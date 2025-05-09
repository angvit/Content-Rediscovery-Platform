"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
    <button
      className="bg-[#E0E5E4] text-[#202A29] px-6 py-3 rounded-lg hover:bg-[#CCD3D2] text-base font-large"
      onClick={token ? onLogout : onLogin}
    >
      {token ? "Logout" : "Login"}
    </button>
  );
}

export default LoginButton;
