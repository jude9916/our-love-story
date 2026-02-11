import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PinkHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    // --- SETTINGS ---
    const settings = {
      particles: {
        length: 500, // maximum amount of particles
        duration: 2, // particle duration in sec
        velocity: 100, // particle velocity in pixels/sec
        effect: -0.75, // play with this for a nice effect
        size: 30, // particle size in pixels
      },
    };

    // --- POLYFILLS ---
    let animationFrameId: number;
    let time: number;

    // --- POINT CLASS ---
    class Point {
      x: number;
      y: number;
      constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }
      clone() {
        return new Point(this.x, this.y);
      }
      length(length?: number) {
        if (typeof length === 'undefined')
          return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
      }
      normalize() {
        const length = this.length() as number;
        this.x /= length;
        this.y /= length;
        return this;
      }
    }

    // --- PARTICLE CLASS ---
    class Particle {
      position: Point;
      velocity: Point;
      acceleration: Point;
      age: number;
      
      constructor() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
      }
      
      initialize(x: number, y: number, dx: number, dy: number) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
      }
      
      update(deltaTime: number) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
      }
      
      draw(context: CanvasRenderingContext2D, image: HTMLImageElement) {
        function ease(t: number) {
          return --t * t * t + 1;
        }
        const size = image.width * ease(this.age / settings.particles.duration);
        context.globalAlpha = 1 - this.age / settings.particles.duration;
        context.drawImage(
          image,
          this.position.x - size / 2,
          this.position.y - size / 2,
          size,
          size
        );
      }
    }

    // --- PARTICLE POOL CLASS ---
    class ParticlePool {
      particles: Particle[];
      firstActive: number;
      firstFree: number;
      duration: number;

      constructor(length: number) {
        this.particles = new Array(length);
        for (let i = 0; i < this.particles.length; i++)
          this.particles[i] = new Particle();
        this.firstActive = 0;
        this.firstFree = 0;
        this.duration = settings.particles.duration;
      }
      
      add(x: number, y: number, dx: number, dy: number) {
        this.particles[this.firstFree].initialize(x, y, dx, dy);
        
        // Handle circular queue
        this.firstFree++;
        if (this.firstFree === this.particles.length) this.firstFree = 0;
        
        if (this.firstActive === this.firstFree) this.firstActive++;
        if (this.firstActive === this.particles.length) this.firstActive = 0;
      }
      
      update(deltaTime: number) {
        let i;
        // Update active particles
        if (this.firstActive < this.firstFree) {
          for (i = this.firstActive; i < this.firstFree; i++)
            this.particles[i].update(deltaTime);
        }
        if (this.firstFree < this.firstActive) {
          for (i = this.firstActive; i < this.particles.length; i++)
            this.particles[i].update(deltaTime);
          for (i = 0; i < this.firstFree; i++)
            this.particles[i].update(deltaTime);
        }
        // Remove old particles
        while (
          this.particles[this.firstActive].age >= this.duration &&
          this.firstActive !== this.firstFree
        ) {
          this.firstActive++;
          if (this.firstActive === this.particles.length) this.firstActive = 0;
        }
      }
      
      draw(context: CanvasRenderingContext2D, image: HTMLImageElement) {
        let i;
        // Draw active particles
        if (this.firstActive < this.firstFree) {
          for (i = this.firstActive; i < this.firstFree; i++)
            this.particles[i].draw(context, image);
        }
        if (this.firstFree < this.firstActive) {
          for (i = this.firstActive; i < this.particles.length; i++)
            this.particles[i].draw(context, image);
          for (i = 0; i < this.firstFree; i++)
            this.particles[i].draw(context, image);
        }
      }
    }

    // --- RENDERING ---
    const particles = new ParticlePool(settings.particles.length);
    const particleRate = settings.particles.length / settings.particles.duration;

    // Create the heart image texture once
    const image = (() => {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      if (!ctx) return new Image();
      c.width = settings.particles.size;
      c.height = settings.particles.size;

      function to(t: number) {
        const point = pointOnHeart(t);
        point.x =
          settings.particles.size / 2 + (point.x * settings.particles.size) / 350;
        point.y =
          settings.particles.size / 2 - (point.y * settings.particles.size) / 350;
        return point;
      }

      function pointOnHeart(t: number) {
        return new Point(
          160 * Math.pow(Math.sin(t), 3),
          130 * Math.cos(t) -
            50 * Math.cos(2 * t) -
            20 * Math.cos(3 * t) -
            10 * Math.cos(4 * t) +
            25
        );
      }

      ctx.beginPath();
      let t = -Math.PI;
      let point = to(t);
      ctx.moveTo(point.x, point.y);
      while (t < Math.PI) {
        t += 0.01;
        point = to(t);
        ctx.lineTo(point.x, point.y);
      }
      ctx.closePath();
      ctx.fillStyle = '#ea80b0';
      ctx.fill();

      const img = new Image();
      img.src = c.toDataURL();
      return img;
    })();

    function pointOnHeart(t: number) {
      return new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) -
          50 * Math.cos(2 * t) -
          20 * Math.cos(3 * t) -
          10 * Math.cos(4 * t) +
          25
      );
    }

    function render() {
      animationFrameId = requestAnimationFrame(render);

      const newTime = new Date().getTime() / 1000;
      const deltaTime = newTime - (time || newTime);
      time = newTime;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const amount = particleRate * deltaTime;
      for (let i = 0; i < amount; i++) {
        const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
        const dir = pos.clone().length(settings.particles.velocity);
        particles.add(
          canvas.width / 2 + pos.x,
          canvas.height / 2 - pos.y,
          dir.x,
          -dir.y
        );
      }

      particles.update(deltaTime);
      particles.draw(context, image);
    }

    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Start
    window.addEventListener('resize', onResize);
    onResize();
    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* Back Button */}
      <Link to="/" className="fixed top-6 left-6 p-3 bg-white/10 backdrop-blur-md rounded-full shadow-md z-50 hover:bg-white/20 transition-colors border border-white/10 group">
        <ArrowLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </Link>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      
      {/* Optional Overlay Text */}
      <div className="absolute bottom-10 w-full text-center pointer-events-none">
         <p className="text-[#ea80b0] opacity-60 text-lg font-serif italic tracking-widest animate-pulse">
            Pure Love
         </p>
      </div>

    </div>
  );
}