"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

class Vector2D {
  constructor(public x: number, public y: number) {}
  static random(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
}

class Vector3D {
  constructor(public x: number, public y: number, public z: number) {}
}

class AnimationController {
  private timeline: gsap.core.Timeline;
  private time = 0;
  private ctx: CanvasRenderingContext2D;
  private size: number;
  private stars: Star[] = [];

  private readonly changeEventTime = 0.32;
  private readonly cameraZ = -400;
  private readonly cameraTravelDistance = 3400;
  private readonly startDotYOffset = 28;
  private readonly viewZoom = 100;
  private readonly numberOfStars = 5000;
  private readonly trailLength = 80;

  constructor(ctx: CanvasRenderingContext2D, size: number) {
    this.ctx = ctx;
    this.size = size;
    this.timeline = gsap.timeline({ repeat: -1 });

    const origRandom = Math.random;
    let seed = 1234;
    Math.random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    this.createStars();
    Math.random = origRandom;
    this.createStars();
    this.setupTimeline();
  }

  private createStars() {
    for (let i = 0; i < this.numberOfStars; i++) {
      this.stars.push(new Star(this.cameraZ, this.cameraTravelDistance));
    }
  }

  private setupTimeline() {
    this.timeline.to(this, {
      time: 1,
      duration: 15,
      repeat: -1,
      ease: "none",
      onUpdate: () => this.render(),
    });
  }

  public ease(p: number, g: number): number {
    if (p < 0.5) return 0.5 * Math.pow(2 * p, g);
    return 1 - 0.5 * Math.pow(2 * (1 - p), g);
  }

  public easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 4.5;
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1;
  }

  public map(v: number, s1: number, e1: number, s2: number, e2: number): number {
    return s2 + (e2 - s2) * ((v - s1) / (e1 - s1));
  }

  public constrain(v: number, min: number, max: number): number {
    return Math.min(Math.max(v, min), max);
  }

  public lerp(a: number, b: number, t: number): number {
    return a * (1 - t) + b * t;
  }

  public spiralPath(p: number): Vector2D {
    p = this.constrain(1.2 * p, 0, 1);
    p = this.ease(p, 1.8);
    const theta = 2 * Math.PI * 6 * Math.sqrt(p);
    const r = 170 * Math.sqrt(p);
    return new Vector2D(r * Math.cos(theta), r * Math.sin(theta) + this.startDotYOffset);
  }

  public rotate(v1: Vector2D, v2: Vector2D, p: number, orientation: boolean): Vector2D {
    const mx = (v1.x + v2.x) / 2;
    const my = (v1.y + v2.y) / 2;
    const dx = v1.x - mx;
    const dy = v1.y - my;
    const angle = Math.atan2(dy, dx);
    const o = orientation ? -1 : 1;
    const r = Math.sqrt(dx * dx + dy * dy);
    const bounce = Math.sin(p * Math.PI) * 0.05 * (1 - p);
    return new Vector2D(
      mx + r * (1 + bounce) * Math.cos(angle + o * Math.PI * this.easeOutElastic(p)),
      my + r * (1 + bounce) * Math.sin(angle + o * Math.PI * this.easeOutElastic(p)),
    );
  }

  public showProjectedDot(pos: Vector3D, sizeFactor: number) {
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1);
    const newCamZ = this.cameraZ + this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance;
    if (pos.z > newCamZ) {
      const depth = pos.z - newCamZ;
      const x = this.viewZoom * pos.x / depth;
      const y = this.viewZoom * pos.y / depth;
      const sw = 400 * sizeFactor / depth;
      this.ctx.lineWidth = sw;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  public getCameraZ() { return this.cameraZ; }
  public getViewZoom() { return this.viewZoom; }

  private drawStartDot() {
    if (this.time > this.changeEventTime) {
      const dy = this.cameraZ * this.startDotYOffset / this.viewZoom;
      this.showProjectedDot(new Vector3D(0, dy, this.cameraTravelDistance), 2.5);
    }
  }

  public render() {
    const ctx = this.ctx;
    if (!ctx) return;
    // Use the dark void background color to match the site
    ctx.fillStyle = "#08080A";
    ctx.fillRect(0, 0, this.size, this.size);
    ctx.save();
    ctx.translate(this.size / 2, this.size / 2);
    const t1 = this.constrain(this.map(this.time, 0, this.changeEventTime + 0.25, 0, 1), 0, 1);
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1);
    ctx.rotate(-Math.PI * this.ease(t2, 2.7));
    this.drawTrail(t1);
    // Amber colored stars to match the theme
    ctx.fillStyle = "#FF8C00";
    for (const star of this.stars) {
      star.render(t1, this);
    }
    this.drawStartDot();
    ctx.restore();
  }

  private drawTrail(t1: number) {
    for (let i = 0; i < this.trailLength; i++) {
      const f = this.map(i, 0, this.trailLength, 1.1, 0.1);
      const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f;
      this.ctx.fillStyle = "#FF8C00";
      this.ctx.lineWidth = sw;
      const pathTime = t1 - 0.00015 * i;
      const position = this.spiralPath(pathTime);
      const offset = new Vector2D(position.x + 5, position.y + 5);
      const rotated = this.rotate(position, offset, Math.sin(this.time * Math.PI * 2) * 0.5 + 0.5, i % 2 === 0);
      this.ctx.beginPath();
      this.ctx.arc(rotated.x, rotated.y, sw / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  public pause() { this.timeline.pause(); }
  public resume() { this.timeline.play(); }
  public destroy() { this.timeline.kill(); }
}

class Star {
  private dx: number;
  private dy: number;
  private spiralLocation: number;
  private strokeWeightFactor: number;
  private z: number;
  private angle: number;
  private distance: number;
  private rotationDirection: number;
  private expansionRate: number;
  private finalScale: number;

  constructor(cameraZ: number, cameraTravelDistance: number) {
    this.angle = Math.random() * Math.PI * 2;
    this.distance = 30 * Math.random() + 15;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.expansionRate = 1.2 + Math.random() * 0.8;
    this.finalScale = 0.7 + Math.random() * 0.6;
    this.dx = this.distance * Math.cos(this.angle);
    this.dy = this.distance * Math.sin(this.angle);
    this.spiralLocation = (1 - Math.pow(1 - Math.random(), 3.0)) / 1.3;
    this.z = Vector2D.random(0.5 * cameraZ, cameraTravelDistance + cameraZ);
    this.z = this.z * 0.7 + (cameraTravelDistance / 2) * 0.3 * this.spiralLocation;
    this.strokeWeightFactor = Math.pow(Math.random(), 2.0);
  }

  render(p: number, c: AnimationController) {
    const sp = c.spiralPath(this.spiralLocation);
    const q = p - this.spiralLocation;
    if (q <= 0) return;
    const dp = c.constrain(4 * q, 0, 1);
    const lin = dp;
    const el = c.easeOutElastic(dp);
    const pw = Math.pow(dp, 2);
    let easing: number;
    if (dp < 0.3) easing = c.lerp(lin, pw, dp / 0.3);
    else if (dp < 0.7) easing = c.lerp(pw, el, (dp - 0.3) / 0.4);
    else easing = el;
    void easing;

    let sx: number, sy: number;
    if (dp < 0.3) {
      const e = dp / 0.3;
      sx = c.lerp(sp.x, sp.x + this.dx * 0.3, e);
      sy = c.lerp(sp.y, sp.y + this.dy * 0.3, e);
    } else if (dp < 0.7) {
      const mp = (dp - 0.3) / 0.4;
      const cs = Math.sin(mp * Math.PI) * this.rotationDirection * 1.5;
      const bx = sp.x + this.dx * 0.3, by = sp.y + this.dy * 0.3;
      const tx = sp.x + this.dx * 0.7, ty = sp.y + this.dy * 0.7;
      sx = c.lerp(bx, tx, mp) + (-this.dy * 0.4 * cs) * mp;
      sy = c.lerp(by, ty, mp) + (this.dx * 0.4 * cs) * mp;
    } else {
      const fp = (dp - 0.7) / 0.3;
      const bx = sp.x + this.dx * 0.7, by = sp.y + this.dy * 0.7;
      const td = this.distance * this.expansionRate * 1.5;
      const sa = this.angle + 1.2 * this.rotationDirection * fp * Math.PI;
      sx = c.lerp(bx, sp.x + td * Math.cos(sa), fp);
      sy = c.lerp(by, sp.y + td * Math.sin(sa), fp);
    }

    const vx = (this.z - c.getCameraZ()) * sx / c.getViewZoom();
    const vy = (this.z - c.getCameraZ()) * sy / c.getViewZoom();

    let sm = 1.0;
    if (dp < 0.6) sm = 1.0 + dp * 0.2;
    else { const t = (dp - 0.6) / 0.4; sm = 1.2 * (1.0 - t) + this.finalScale * t; }

    c.showProjectedDot(new Vector3D(vx, vy, this.z), 8.5 * this.strokeWeightFactor * sm);
  }
}

export function SpiralAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<AnimationController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const size = Math.max(dims.w, dims.h);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${dims.w}px`;
    canvas.style.height = `${dims.h}px`;
    ctx.scale(dpr, dpr);
    animationRef.current = new AnimationController(ctx, size);
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [dims]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
