import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-gray-400">&copy; 2025 CSphere. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <Link href="/privacy" className="text-gray-400 hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-white">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
