interface Point {
  x: number;
  y: number;
}

export class Insect {
  x: number;
  y: number;
  private targetX: number;
  private targetY: number;
  private controlPoint1: Point;
  private controlPoint2: Point;
  private progress: number = 0;
  private speed: number;
  private startPoint: Point;
  private size: number;
  private cursorInfluence: boolean = false;
  private cursorX: number = 0;
  private cursorY: number = 0;
  private wingAngle: number = 0;
  private wingSpeed: number;
  private color: string;
  private type: "butterfly" | "firefly" | "bee";
  private rotation: number = 0;
  private lastX: number;
  private lastY: number;
  private interestDuration: number = Math.random() * 5000 + 3000; // 3-8 seconds
  private lastInterestChange: number = Date.now();

  constructor(canvasWidth: number, canvasHeight: number) {
    this.size = 2 + Math.random() * 3;
    this.speed = 0.001 + Math.random() * 0.002;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.lastX = this.x;
    this.lastY = this.y;
    this.wingSpeed = 0.15 + Math.random() * 0.1;

    // Randomly choose insect type
    const types: ("butterfly" | "firefly" | "bee")[] = [
      "butterfly",
      "firefly",
      "bee",
    ];
    this.type = types[Math.floor(Math.random() * types.length)];

    // Set color based on type
    if (this.type === "butterfly") {
      const colors = [
        "rgba(255, 182, 193, 0.7)", // Pink
        "rgba(173, 216, 230, 0.7)", // Light blue
        "rgba(255, 218, 185, 0.7)", // Peach
        "rgba(221, 160, 221, 0.7)", // Plum
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    } else if (this.type === "firefly") {
      this.color = "rgba(255, 255, 150, 0.9)";
    } else {
      this.color = "rgba(255, 200, 0, 0.7)"; // Bee yellow
    }

    this.setNewTarget(canvasWidth, canvasHeight);
  }

  setNewTarget(canvasWidth: number, canvasHeight: number) {
    this.startPoint = { x: this.x, y: this.y };
    this.targetX = Math.random() * canvasWidth;
    this.targetY = Math.random() * canvasHeight;
    this.progress = 0;

    // Generate random control points for curved path
    this.controlPoint1 = {
      x: this.startPoint.x + (Math.random() - 0.5) * 200,
      y: this.startPoint.y + (Math.random() - 0.5) * 200,
    };
    this.controlPoint2 = {
      x: this.targetX + (Math.random() - 0.5) * 200,
      y: this.targetY + (Math.random() - 0.5) * 200,
    };
  }

  setCursor(x: number, y: number) {
    this.cursorX = x;
    this.cursorY = y;

    // Check if cursor is within influence range (100px)
    const dx = this.x - x;
    const dy = this.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.cursorInfluence = distance < 100;
  }

  update(canvasWidth: number, canvasHeight: number) {
    // Randomly lose/gain interest
    const currentTime = Date.now();
    if (currentTime - this.lastInterestChange > this.interestDuration) {
      this.cursorInfluence = Math.random() < 0.3; // 30% chance to become interested
      this.lastInterestChange = currentTime;
      this.interestDuration = Math.random() * 5000 + 3000; // Reset duration
    }

    if (this.cursorInfluence) {
      const dx = this.cursorX - this.x;
      const dy = this.cursorY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 30) {
        // Move towards cursor with some randomness
        const speed = 2.5;
        const angle = Math.atan2(dy, dx);
        
        // Add some randomness to the movement
        const randomAngle = angle + (Math.random() - 0.5) * 0.5;
        const randomSpeed = speed * (0.8 + Math.random() * 0.4);
        
        this.x += Math.cos(randomAngle) * randomSpeed;
        this.y += Math.sin(randomAngle) * randomSpeed;
      } else {
        // Smooth circular motion when close to cursor
        const time = Date.now() * 0.001; // Slower time scale
        const radius = 30 + Math.sin(time * 0.5) * 10; // Varying radius
        const individualOffset = this.wingSpeed * 100; // Use wingSpeed as unique offset
        
        // Each insect follows its own circular path
        this.x = this.cursorX + Math.cos(time + individualOffset) * radius;
        this.y = this.cursorY + Math.sin(time + individualOffset) * radius;
      }
    } else {
      // Follow Bézier curve path
      this.progress += this.speed;
      if (this.progress >= 1) {
        this.setNewTarget(canvasWidth, canvasHeight);
      }

      // Cubic Bézier curve calculation
      const t = this.progress;
      const mt = 1 - t;
      this.x = mt * mt * mt * this.startPoint.x +
               3 * mt * mt * t * this.controlPoint1.x +
               3 * mt * t * t * this.controlPoint2.x +
               t * t * t * this.targetX;
      
      this.y = mt * mt * mt * this.startPoint.y +
               3 * mt * mt * t * this.controlPoint1.y +
               3 * mt * t * t * this.controlPoint2.y +
               t * t * t * this.targetY;
    }

    // Calculate rotation smoothly based on movement direction
    const targetRotation = Math.atan2(this.y - this.lastY, this.x - this.lastX);
    const rotationDiff = targetRotation - this.rotation;
    
    // Normalize the rotation difference to [-PI, PI]
    const normalizedDiff = Math.atan2(Math.sin(rotationDiff), Math.cos(rotationDiff));
    
    // Smooth rotation interpolation
    this.rotation += normalizedDiff * 0.1;

    this.lastX = this.x;
    this.lastY = this.y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Update wing animation
    this.wingAngle = (Math.sin(Date.now() * this.wingSpeed) * Math.PI) / 3;

    // Calculate rotation based on movement direction
    const dx = this.x - this.lastX;
    const dy = this.y - this.lastY;
    this.rotation = Math.atan2(dy, dx);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type === "butterfly") {
      this.drawButterfly(ctx);
    } else if (this.type === "firefly") {
      this.drawFirefly(ctx);
    } else {
      this.drawBee(ctx);
    }

    ctx.restore();

    // Store current position for next frame
    this.lastX = this.x;
    this.lastY = this.y;
  }

  private drawButterfly(ctx: CanvasRenderingContext2D) {
    const wingSize = this.size * 2;

    // Draw wings
    ctx.beginPath();
    // Left wing
    ctx.save();
    ctx.rotate(this.wingAngle);
    ctx.ellipse(
      -this.size,
      0,
      wingSize * 1.5,
      wingSize,
      Math.PI / 4,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();

    // Right wing
    ctx.save();
    ctx.rotate(-this.wingAngle);
    ctx.ellipse(
      this.size,
      0,
      wingSize * 1.5,
      wingSize,
      -Math.PI / 4,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 0.5, this.size * 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fill();

    // Antennae
    ctx.beginPath();
    ctx.moveTo(-this.size * 0.2, -this.size);
    ctx.quadraticCurveTo(
      -this.size,
      -this.size * 2,
      -this.size * 0.5,
      -this.size * 2.5,
    );
    ctx.moveTo(this.size * 0.2, -this.size);
    ctx.quadraticCurveTo(
      this.size,
      -this.size * 2,
      this.size * 0.5,
      -this.size * 2.5,
    );
    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  private drawFirefly(ctx: CanvasRenderingContext2D) {
    // Glowing effect
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
    gradient.addColorStop(0, "rgba(255, 255, 150, 0.8)");
    gradient.addColorStop(1, "rgba(255, 255, 150, 0)");

    ctx.beginPath();
    ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();

    // Wings
    ctx.save();
    ctx.rotate(this.wingAngle);
    ctx.beginPath();
    ctx.ellipse(
      -this.size * 0.5,
      0,
      this.size,
      this.size * 0.4,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.rotate(-this.wingAngle);
    ctx.beginPath();
    ctx.ellipse(
      this.size * 0.5,
      0,
      this.size,
      this.size * 0.4,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fill();
    ctx.restore();
  }

  private drawBee(ctx: CanvasRenderingContext2D) {
    // Wings
    ctx.save();
    ctx.rotate(this.wingAngle);
    ctx.beginPath();
    ctx.ellipse(
      -this.size * 0.5,
      -this.size * 0.5,
      this.size * 1.2,
      this.size * 0.5,
      Math.PI / 4,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.rotate(-this.wingAngle);
    ctx.beginPath();
    ctx.ellipse(
      this.size * 0.5,
      -this.size * 0.5,
      this.size * 1.2,
      this.size * 0.5,
      -Math.PI / 4,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fill();
    ctx.restore();

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 0.8, this.size * 1.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Stripes
    const stripeCount = 3;
    const stripeWidth = (this.size * 2.4) / (stripeCount * 2 - 1);
    ctx.save();
    ctx.clip();
    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(
        -this.size * 1.2 + i * stripeWidth * 2,
        -this.size * 1.2,
        stripeWidth,
        this.size * 2.4,
      );
    }
    ctx.restore();
  }
}
