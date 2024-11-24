import { useState } from "react";
import { Separator } from "./ui/Separator";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const menuItems = [
  { title: "Home", href: "#hero" },
  { title: "Dashboard", href: "#dashboard" },
  { title: "About", href: "/about" },
  { title: "Instagram", href: "https://www.instagram.com/" },
];

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const isDashboardVisible = useIntersectionObserver("dashboard");

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed right-4 top-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl bg-[#3e2213]/80 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-[#3e2213]"
        >
          Menu
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-64 bg-[#3e2213]/95 backdrop-blur-sm transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col items-end justify-center gap-8 px-8">
          {menuItems.map((item, i) => (
            <div
              key={item.title}
              className={`group relative transition-all duration-300 delay-[${
                i * 100
              }ms] ${isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
            >
              <a
                href={item.href}
                className="text-xl font-medium text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </a>
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Menu */}
      <nav
        className={`fixed left-[8%] z-50 hidden transition-all duration-500 ease-in-out md:block ${
          isDashboardVisible ? "top-32" : "top-1/3"
        }`}
      >
        <div className="relative flex flex-col items-start gap-5">
          {menuItems.map((item) => (
            <div key={item.title} className="group relative">
              <a
                href={item.href}
                className={`text-lg font-semibold transition-colors hover:opacity-90 ${
                  isDashboardVisible ? "text-black" : "text-white"
                }`}
              >
                {item.title.toLowerCase()}
              </a>
              <span
                className={`absolute -bottom-1 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full ${
                  isDashboardVisible ? "bg-black" : "bg-white"
                }`}
              />
            </div>
          ))}
          <Separator
            orientation="vertical"
            className={`absolute -right-8 top-0 h-full w-[2px] ${
              isDashboardVisible ? "bg-black" : "bg-white"
            }`}
          />
        </div>
      </nav>
    </>
  );
}
