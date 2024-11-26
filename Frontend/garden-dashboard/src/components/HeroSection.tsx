import * as React from "react";
import clouds from "@/assets/cloud.png";
import LogoInitSVG from "@/assets/logo_init.tsx";
import LogoGCI from "@/assets/logo_gci.tsx";
import PantherSVG from "@/assets/panther.tsx";
import { Constellation } from "@/components/ui/Constellation";

export function HeroSection() {
  // Generate random star positions and properties
  const stars = Array.from({ length: 100 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 3,
    delay: Math.random() * 5,
    duration: Math.random() * 2 + 5,
  }));

  // Access the static properties directly
  const rendered = PantherSVG({});
  const svgPath = rendered?.props?.children?.props?.children?.props?.d;
  const viewBox = rendered?.props?.viewBox;

  // Get both logo SVG path data
  const logoInitRendered = LogoInitSVG({});
  const logoInitPaths = React.Children.toArray(logoInitRendered.props.children)
    .flatMap((group) => React.Children.toArray(group.props.children))
    .filter((path) => path.props?.d)
    .map((path) => path.props.d)
    .join(" ");
  const logoInitViewBox = logoInitRendered.props.viewBox;

  // Get GCI logo path data
  const logoGCIRendered = LogoGCI({});
  const logoGCIPaths = React.Children.toArray(logoGCIRendered.props.children)
    .flatMap((group) => React.Children.toArray(group.props.children))
    .filter((path) => path.props?.d)
    .map((path) => path.props.d)
    .join(" ");
  const logoGCIViewBox = logoGCIRendered.props.viewBox;

  // console.log("Rendered SVG:", rendered);
  // console.log("SVG Path:", svgPath);
  // console.log("ViewBox:", viewBox);
  // console.log("Logo Init Paths:", logoInitPaths);
  // console.log("Logo Init ViewBox:", logoInitViewBox);
  // console.log("Logo GCI Paths:", logoGCIPaths);
  // console.log("Logo GCI ViewBox:", logoGCIViewBox);

  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black">
      {/* Stars with random twinkling */}
      <div className="absolute inset-0 z-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute animate-twinkle rounded-full bg-white"
            style={
              {
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
                "--duration": `${star.duration}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Init Logo Constellation */}
      <div className="absolute left-8 bottom-8 z-10">
        <Constellation
          pathData={logoInitPaths}
          viewBox={logoInitViewBox}
          className="w-[70%]"
          starCount={150}
          starSize={[1, 9]}
          delayRange={[0, 2]}
          durationRange={[2, 4]}
        />
      </div>

      {/* GCI Logo Constellation */}
      <div className="absolute right-8 top-8 z-10">
        <Constellation
          pathData={logoGCIPaths}
          viewBox={logoGCIViewBox}
          className="w-[40%]" 
          starCount={150}
          starSize={[1, 5]}
          delayRange={[0, 2]}
          durationRange={[2, 4]}
        />
      </div>

      {/* Panther Constellation */}
      <div className="absolute inset-0 z-10">
        <Constellation
          pathData={svgPath}
          viewBox={viewBox}
          className="absolute left-1/2 top-1/2 h-[50%] -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Clouds */}
      <div
        className="absolute inset-0 z-20 animate-clouds-back"
        style={{
          backgroundImage: `url(${clouds})`,
          backgroundRepeat: "repeat",
          backgroundPosition: "top center",
        }}
      />

      {/* Content with grid */}
      <div className="relative z-30 w-full">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="hidden md:block" />
          <div className="col-span-1 md:col-span-3 px-4 text-center">
            <h1 className="mb-6 text-6xl font-bold text-white md:text-7xl">
              Green Campus
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-white/80 md:text-2xl">
              Monitoring and maintaining our garden ecosystem through advanced
              sensor technology and real-time data analysis.
            </p>
            <a
              href="#dashboard"
              className="group inline-block cursor-pointer rounded-xl bg-white/10 px-4 py-2 text-white/50 transition-colors hover:text-white/80"
            >
              <p className="text-sm">Scroll to explore</p>
              <svg
                className="round mx-auto mt-2 h-6 w-6 animate-bounce fill-none stroke-current stroke-[3] transition-transform group-hover:translate-y-1"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </div>
          <div className="hidden md:block" />
        </div>
      </div>
    </section>
  );
}
