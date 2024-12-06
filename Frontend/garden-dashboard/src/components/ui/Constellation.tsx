import { CSSProperties } from 'react';

interface ConstellationProps {
  /** SVG path string to create constellation along */
  pathData: string;
  /** SVG viewBox attribute */
  viewBox: string;
  /** Number of stars to generate */
  starCount?: number;
  /** Size range for stars [min, max] in pixels */
  starSize?: [number, number];
  /** Animation delay range [min, max] in seconds */
  delayRange?: [number, number];
  /** Animation duration range [min, max] in seconds */
  durationRange?: [number, number];
  /** Optional className for the SVG container */
  className?: string;
}

export function Constellation({
  pathData,
  viewBox,
  starCount = 300,
  starSize = [0.5, 1.7],
  delayRange = [0, 3],
  durationRange = [3, 5],
  className = "",
}: ConstellationProps) {
  // Generate constellation stars along the path
  const constellationStars = Array.from({ length: starCount }, () => ({
    offset: Math.random() * 100,
    size: Math.random() * (starSize[1] - starSize[0]) + starSize[0],
    delay: Math.random() * (delayRange[1] - delayRange[0]) + delayRange[0],
    duration: Math.random() * (durationRange[1] - durationRange[0]) + durationRange[0],
  }));

  return (
    <svg
      viewBox={viewBox}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {constellationStars.map((star, i) => (
        <circle
          key={i}
          className="animate-twinkle-constellation fill-white"
          r={star.size}
          style={
            {
              animationDelay: `${star.delay}s`,
              "--duration": `${star.duration}s`,
            } as CSSProperties
          }
        >
          <animateMotion
            dur="0.1s"
            fill="freeze"
            path={pathData}
            keyPoints={`${star.offset / 100};${star.offset / 100}`}
            keyTimes="0;1"
          />
        </circle>
      ))}
    </svg>
  );
}