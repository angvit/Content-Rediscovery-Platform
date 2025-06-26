"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./navbar/ProfileDropdown";

function DropdownMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    const foundToken = cookie ? cookie.split("=")[1] : null;
    setToken(foundToken);
  }, [pathname]);

  const onLogout = () => {
    document.cookie = `token=; path=/; max-age=0`;
    localStorage.removeItem("csphere_token");
    window.location.href = "/login";
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Add state toggle later
        className="inline-flex items-center justify-center p-2 rounded-lg text-[#202A29] hover:text-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" // Example styling
        aria-controls="mobile-menu"
        aria-expanded="false" // This should be dynamic based on state {isMobileMenuOpen}
      >
        <span className="sr-only">Open main menu</span>
        {/* Heroicon Menu (or your preferred icon) */}
        {/* {isMobileMenuOpen ? <XIcon/> : <MenuIcon/>} */}
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <div
        className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}
        id="mobile-menu"
      >
        {token ? (
          <div className="px-2 pt-2 z-50 pb-3 space-y-1 sm:px-3 bg-gray-300 absolute left-0 right-0 shadow-lg flex flex-col items-center justify-center">
            <a
              href="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#202A29] hover:text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <a
              href="/setting"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#202A29] hover:text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <button
              onClick={() => onLogout()}
              className="block px-3 py-2 rounded-md text-base font-medium text-[#202A29] hover:text-gray-700 hover:bg-gray-100"
            >
              logout
            </button>
          </div>
        ) : (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-300 absolute left-0 right-0 shadow-lg flex flex-col items-center justify-center">
            <a
              href="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#202A29] hover:text-gray-700 hover:bg-gray-100"
            >
              Login
            </a>
            <a
              href="/signup"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#202A29] hover:text-gray-700 hover:bg-gray-100"
            >
              Signup
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default DropdownMenu;
