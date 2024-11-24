import { Github } from 'lucide-react'; 

export function Footer() {
  return (
    <footer>
      <div className="-translate-y-1 w-full h-40 bg-gradient-to-b from-[#2d5a27] via-10% via-[#3e2213] to-50% to-[#5e3c22]">
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-between text-white/90">
          <div>
            <h3 className="text-xl font-semibold">laboris dolor et elit occaecat</h3>
            <p className="text-sm text-white/70">
              cillum occaecat exercitation ullamco commodo ullamco do sit proident culpa
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/link/to/repo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
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