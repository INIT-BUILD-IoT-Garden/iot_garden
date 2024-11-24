import { useState } from "react";

const menuItems = [
  { title: "Home", href: "#" },
  { title: "About", href: "#" },
  { title: "Services", href: "#" },
  { title: "Contact", href: "#" },
];

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

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
      <nav className="fixed left-[8%] top-1/4 z-50 hidden transition-all duration-500 ease-in-out md:block [&:has(~div>section:nth-child(2).snap-align-start)]:top-1/2">
        <div className="flex flex-col items-start gap-5">
          {menuItems.map((item) => (
            <div key={item.title} className="group relative">
              <a
                href={item.href}
                className="text-lg font-semibold text-white transition-colors hover:text-white/90 [&:has(~section:nth-child(2).snap-align-start)]:text-black"
              >
                {item.title.toLowerCase()}
              </a>
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full [&:has(~section:nth-child(2).snap-align-start)]:bg-black" />
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
