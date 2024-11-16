import { useEffect, useRef } from 'react';

export function GardenBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const grassConfig = {
      density: 4,
      height: { min: 0.01, max: 0.08 },
      width: { min: 2, max: 7 },
      color: {
        hue: {
          min: 100,
          max: 140
        },
        saturation: {
          min: 40,
          max: 70
        },
        lightness: {
          min: 25,
          max: 45
        }
      },
      wind: {
        speed: {
          min: 0.1,
          max: 0.9
        },
        strength: {
          min: 8,
          max: 12
        }
      },
      segments: {
        min: 4,
        max: 6
      }
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match viewport
    const resizeCanvas = () => {
      const { innerWidth, innerHeight } = window;
      const scale = window.devicePixelRatio || 1;
      
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      canvas.width = innerWidth * scale;
      canvas.height = innerHeight * scale;
      
      ctx.scale(scale, scale);
      
      blades.length = 0;
      const bladesCount = Math.floor(innerWidth / grassConfig.density);
      for (let i = 0; i < bladesCount; i++) {
        blades.push(new GrassBlade(
          Math.random() * innerWidth,
          innerHeight,
          canvas
        ));
      }

      // Update butterfly canvas dimensions if needed
      butterflies.forEach(butterfly => {
        butterfly.x = Math.random() * canvas.width;
        butterfly.y = Math.random() * canvas.height;
      });
    };

    class GrassBlade {
      x: number;
      y: number;
      height: number;
      width: number;
      canvas: HTMLCanvasElement;
      controlPoints: { x: number; y: number }[];
      swayOffset: number;
      swaySpeed: number;
      swayStrength: number;
      color: string;
      segments: number;

      constructor(x: number, y: number, canvas: HTMLCanvasElement) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;

        const heightPercent = grassConfig.height.min + Math.random() * (grassConfig.height.max - grassConfig.height.min);
        this.height = canvas.height * heightPercent;
        this.width = grassConfig.width.min + Math.random() * (grassConfig.width.max - grassConfig.width.min);
        this.swayOffset = Math.random() * Math.PI * 2;
        this.swaySpeed = grassConfig.wind.speed.min + Math.random() * (grassConfig.wind.speed.max - grassConfig.wind.speed.min);
        this.swayStrength = grassConfig.wind.strength.min + Math.random() * (grassConfig.wind.strength.max - grassConfig.wind.strength.min);
        this.segments = grassConfig.segments.min + Math.floor(Math.random() * (grassConfig.segments.max - grassConfig.segments.min));
        
        // Control points start from bottom and go up
        this.controlPoints = Array(this.segments).fill(0).map((_, i) => ({
          x: this.x,
          y: this.y - (this.height * (i + 1)) / this.segments
        }));

        // Randomized green colors within configured ranges
        const hue = grassConfig.color.hue.min + Math.random() * (grassConfig.color.hue.max - grassConfig.color.hue.min);
        const saturation = grassConfig.color.saturation.min + Math.random() * (grassConfig.color.saturation.max - grassConfig.color.saturation.min);
        const lightness = grassConfig.color.lightness.min + Math.random() * (grassConfig.color.lightness.max - grassConfig.color.lightness.min);
        this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      }

      draw(ctx: CanvasRenderingContext2D, time: number) {
        // Update control points with wind effect
        this.controlPoints.forEach((point, i) => {
          const windEffect = Math.sin(
            time * this.swaySpeed + 
            this.swayOffset + 
            (i * Math.PI / this.segments)
          );

          // Wind effect increases toward the tip
          const swayAmount = this.swayStrength * ((i + 1) / this.segments);
          point.x = this.x + windEffect * swayAmount;
        });

        // Generate the left and right edges of the blade
        const leftEdge = [];
        const rightEdge = [];
        const bladeWidth = this.width;

        // Starting point at the base
        leftEdge.push({ x: this.x - bladeWidth / 2, y: this.y });
        rightEdge.push({ x: this.x + bladeWidth / 2, y: this.y });

        // Calculate points along the blade
        for (let i = 0; i < this.controlPoints.length; i++) {
          const point = this.controlPoints[i];

          // Calculate width tapering towards the tip
          const widthFactor = (1 - (i + 1) / this.segments, 0.6); // Decreases from 1 to 0
          const localBladeWidth = bladeWidth * widthFactor;

          leftEdge.push({
            x: point.x - localBladeWidth / 2,
            y: point.y
          });

          rightEdge.push({
            x: point.x + localBladeWidth / 2,
            y: point.y
          });
        }

        // Draw the blade shape
        ctx.beginPath();

        // Left edge from base to tip
        ctx.moveTo(leftEdge[0].x, leftEdge[0].y);
        for (let i = 1; i < leftEdge.length; i++) {
          ctx.lineTo(leftEdge[i].x, leftEdge[i].y);
        }

        // Right edge from tip to base
        for (let i = rightEdge.length - 1; i >= 0; i--) {
          ctx.lineTo(rightEdge[i].x, rightEdge[i].y);
        }

        ctx.closePath();

        // Gradient fill for the blade
        const gradient = ctx.createLinearGradient(
          this.x,
          this.y,
          this.x,
          this.y - this.height
        );

        const baseColor = this.color;
        const tipColor = this.color.replace(
          /hsl\((\d+), (\d+)%, (\d+)%\)/,
          (_match, h, s, l) => `hsl(${h}, ${s}%, ${Math.min(100, parseInt(l) + 10)}%)`
        );
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(1, tipColor);

        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Create grass blades
    const blades: GrassBlade[] = [];
    const bladesCount = Math.floor(canvas.width / grassConfig.density);
    
    for (let i = 0; i < bladesCount; i++) {
      blades.push(new GrassBlade(
        Math.random() * canvas.width,
        canvas.height,
        canvas
      ));
    }

    class Butterfly {
      x: number;
      y: number;
      vx: number;
      vy: number;
      amplitude: number;
      wingAngle: number;
      wingSpeed: number;
      color: string;

      constructor(canvasWidth: number, canvasHeight: number) {
        // Initial position
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        // Velocity components
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        // Amplitude for sinusoidal movement
        this.amplitude = 20 + Math.random() * 10;
        // Wing animation
        this.wingAngle = 0;
        this.wingSpeed = 0.2 + Math.random() * 0.2;
        // Random color
        const hue = Math.random() * 360;
        this.color = `hsl(${hue}, 70%, 60%)`;
      }

      update(canvasWidth: number, canvasHeight: number) {
        // Update position with wrapping
        this.x = (this.x + this.vx + canvasWidth) % canvasWidth;
        this.y = (this.y + this.vy + canvasHeight) % canvasHeight;

        // Update wing angle for flapping effect
        this.wingAngle += this.wingSpeed;

        // Add slight sinusoidal vertical movement
        this.y += Math.sin(this.x * 0.05) * 0.5;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw body
        ctx.beginPath();
        ctx.ellipse(0, 0, 2, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();

        // Draw wings
        const wingSize = 5;
        const wingOffset = Math.sin(this.wingAngle) * wingSize;

        // Left wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          -wingSize, -wingOffset,
          -wingSize, wingOffset,
          0, 0
        );
        ctx.fillStyle = this.color;
        ctx.fill();

        // Right wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          wingSize, -wingOffset,
          wingSize, wingOffset,
          0, 0
        );
        ctx.fill();

        ctx.restore();
      }
    }

    // Create butterflies
    const butterflyCount = 15;
    const butterflies: Butterfly[] = [];
    for (let i = 0; i < butterflyCount; i++) {
      butterflies.push(new Butterfly(canvas.width, canvas.height));
    }

    // Animation loop
    let animationId: number;
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#afddfc'); // blue
      gradient.addColorStop(1, '#adf8c7'); // green
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grass
      blades.forEach(blade => blade.draw(ctx, time / 1000));

      // Update and draw butterflies
      butterflies.forEach(butterfly => {
        butterfly.update(canvas.width, canvas.height);
        butterfly.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate(0);

    // Initial resize and event listener
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      butterflies.forEach(butterfly => {
        const dx = butterfly.x - mouseX;
        const dy = butterfly.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          // Move butterfly away from cursor
          butterfly.vx += dx / distance;
          butterfly.vy += dy / distance;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
}