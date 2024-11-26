import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer>
      <div className="h-40 w-full bg-gradient-to-b from-[#2d5a27] via-[#3e2213] via-10% to-[#5e3c22] to-50%">
        <div className="container relative z-20 mx-auto flex h-full items-center justify-between px-4 text-white/90">
          <div>
            <h3 className="text-xl font-semibold">
              laboris dolor et elit occaecat
            </h3>
            <p className="text-sm text-white/70">
              cillum occaecat exercitation ullamco commodo ullamco do sit
              proident culpa
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/link/to/repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 transition-colors hover:text-white"
            >
              <Github className="h-5 w-5" />
            </a>
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} yadayadaayada
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
