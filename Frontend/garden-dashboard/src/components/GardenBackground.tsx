import { useEffect, useRef } from "react";

export function GardenBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) {
      console.error("Canvas ref not found");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Could not get 2D context");
      return;
    }

    // Initialize grass blades
    const BLADE_COUNT = 500;
    const GRASS_COLORS = [
      { light: "#22c55e", dark: "#2d5a27" },
      { light: "#16a34a", dark: "#2d5a27" },
      { light: "#15803d", dark: "#2d5a27" },
      { light: "#10b981", dark: "#2d5a27" },
      { light: "#059669", dark: "#2d5a27" },
    ];

    const blades = Array.from({ length: BLADE_COUNT }, () => {
      const colorSet =
        GRASS_COLORS[Math.floor(Math.random() * GRASS_COLORS.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        height: 30 + Math.random() * 60,
        segments: 2 + Math.floor(Math.random() * 3),
        maxWidth: 2 + Math.random() * 12,
        angle: (Math.random() - 0.5) * 0.5,
        colors: colorSet,
        swayOffset: Math.random() * Math.PI * 1,

        draw(
          context: CanvasRenderingContext2D,
          time: number,
          offset: number = 0,
        ) {
          const waveAmount = 0.2;
          const waveSpeed = 2;
          const windEffect =
            Math.sin(time * waveSpeed + this.x * 0.01 + this.swayOffset) *
            waveAmount;
          const baseAngle = this.angle + windEffect * 0.2;

          context.save();
          context.translate(this.x, canvas.height - offset);
          context.rotate(baseAngle);

          const segmentHeight = this.height / this.segments;
          const currentWidth = this.maxWidth;

          // Create gradient for the blade
          const gradient = context.createLinearGradient(0, 0, 0, -this.height);
          gradient.addColorStop(0, this.colors.dark);
          gradient.addColorStop(0.7, this.colors.light);
          gradient.addColorStop(1, this.colors.light);

          context.beginPath();
          context.moveTo(-currentWidth / 2, 0);

          // Calculate the bend curve
          const bendStrength = windEffect * 30; // Controls how much the blade bends
          const points: [number, number][] = [];

          // Draw right edge up
          for (let i = 0; i <= this.segments; i++) {
            const progress = i / this.segments;
            const nextWidth = this.maxWidth * (1 - progress * 0.8);

            // Calculate bend using quadratic curve
            const bendX = Math.pow(progress, 2) * bendStrength;
            const x = nextWidth / 2;
            const y = -i * segmentHeight;

            if (i === 0) {
              context.lineTo(x, y);
              points.push([x, y]);
            } else if (i === this.segments) {
              // Create rounded tip
              const tipOffset = nextWidth * 0.02;
              context.quadraticCurveTo(
                x + bendX,
                y,
                (x + bendX) * 0.5,
                y - tipOffset,
              );
              context.quadraticCurveTo(
                bendX,
                y - tipOffset,
                (-x + bendX) * 0.5,
                y - tipOffset,
              );
              points.push([x + bendX, y]);
              points.push([bendX, y - tipOffset]);
            } else {
              context.lineTo(x + bendX, y);
              points.push([x + bendX, y]);
            }
          }

          // Draw left edge down
          for (let i = this.segments - 1; i >= 0; i--) {
            const progress = i / this.segments;
            const nextWidth = this.maxWidth * (1 - progress * 0.8);

            const bendX = Math.pow(progress, 2) * bendStrength;
            const x = -nextWidth / 2;
            const y = -i * segmentHeight;

            context.lineTo(x + bendX, y);
          }

          context.closePath();
          context.fillStyle = gradient;
          context.fill();

          // Draw the line
          context.beginPath();
          context.strokeStyle = `rgba(0,0,0,0.12)`;
          context.lineWidth = 0.5;

          points.forEach((point, i) => {
            if (i === 0) {
              context.moveTo(point[0], point[1]);
            } else {
              context.lineTo(point[0], point[1]);
            }
          });

          context.stroke();
          context.restore();
        },
      };
    });

    const drawScene = (time: number) => {
      if (!ctx || !canvas) return;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, "#afddfc");
      skyGradient.addColorStop(1, "#adf8c7");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sort blades by y position for better layering
      blades.sort((a, b) => a.x - b.x);

      // Draw grass - always at the bottom of the viewport
      blades.forEach((blade) => {
        blade.draw(ctx, time / 1000, -1);
      });
    };

    const animate = (time: number) => {
      drawScene(time);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Initial setup
    const resizeCanvas = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;

      // Get the dashboard container dimensionsx
      const dashboardContainer = canvas.parentElement;
      if (!dashboardContainer) return;

      canvas.width = dashboardContainer.clientWidth;
      canvas.height = dashboardContainer.clientHeight;

      // Redistribute grass blades
      blades.forEach((blade) => {
        blade.x = Math.random() * canvas.width;
        // Keep grass at the bottom of the canvas
        blade.y = canvas.height - Math.random() * 100; // Vary grass height slightly
      });
    };

    resizeCanvas();
    animate(0);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full touch-none bg-gradient-to-b from-blue-500 to-blue-300" />;
}
