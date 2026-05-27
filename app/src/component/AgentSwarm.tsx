import { useRef, useEffect, memo } from 'react';

interface Agent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: 0 | 1 | 2 | 3; // idle, investigating, paused, warning
  targetX: number;
  targetY: number;
  phase: number;
}

function createAgents(count: number, w: number, h: number): Agent[] {
  const agents: Agent[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 50 + Math.random() * Math.min(w, h) * 0.35;
    agents.push({
      x: w / 2 + Math.cos(angle) * radius,
      y: h / 2 + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      state: Math.random() < 0.7 ? 0 : Math.random() < 0.8 ? 1 : Math.random() < 0.9 ? 2 : 3,
      targetX: w / 2 + (Math.random() - 0.5) * 200,
      targetY: h / 2 + (Math.random() - 0.5) * 200,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return agents;
}

const STATE_COLORS: [number, number, number, number][] = [
  [6, 182, 212, 0.4],   // idle - cyan
  [59, 130, 246, 0.8],  // investigating - blue
  [245, 158, 11, 0.6],  // paused - yellow
  [239, 68, 68, 1.0],   // warning - red
];

const CANVAS_BG = '#050B14';

export const AgentSwarm = memo(function AgentSwarm({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const agentsRef = useRef<Agent[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      sizeRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
    };

    resize();

    // Initialize agents
    const { w, h } = sizeRef.current;
    if (agentsRef.current.length === 0) {
      agentsRef.current = createAgents(300, w, h);
    }

    const animate = (time: number) => {
      const { w: cw, h: ch } = sizeRef.current;
      if (cw === 0 || ch === 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear with trail fade effect
      ctx.fillStyle = CANVAS_BG;
      ctx.fillRect(0, 0, cw, ch);

      const cx = cw / 2;
      const cy = ch / 2;
      const agents = agentsRef.current;

      for (let i = 0; i < agents.length; i++) {
        const a = agents[i];

        // Physics: soft repulsion from center + random wander
        const dx = a.x - cx;
        const dy = a.y - cy;
        // Center gravity (gentle pull toward center)
        const gravityStrength = 0.0003;
        a.vx -= dx * gravityStrength;
        a.vy -= dy * gravityStrength;

        // Soft repulsion from edges
        const margin = 40;
        if (a.x < margin) a.vx += 0.02;
        if (a.x > cw - margin) a.vx -= 0.02;
        if (a.y < margin) a.vy += 0.02;
        if (a.y > ch - margin) a.vy -= 0.02;

        // State-based behavior
        if (a.state === 1) {
          // Investigating: move toward target
          const tdx = a.targetX - a.x;
          const tdy = a.targetY - a.y;
          a.vx += tdx * 0.001;
          a.vy += tdy * 0.001;

          // Pick new target if close
          if (Math.abs(tdx) < 10 && Math.abs(tdy) < 10) {
            a.targetX = cx + (Math.random() - 0.5) * 250;
            a.targetY = cy + (Math.random() - 0.5) * 250;
          }
        } else if (a.state === 3) {
          // Warning: erratic movement
          a.vx += (Math.random() - 0.5) * 0.3;
          a.vy += (Math.random() - 0.5) * 0.3;
        }

        // Random wander
        a.vx += (Math.random() - 0.5) * 0.05;
        a.vy += (Math.random() - 0.5) * 0.05;

        // Damping
        a.vx *= 0.98;
        a.vy *= 0.98;

        // Speed limit
        const speed = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
        const maxSpeed = a.state === 3 ? 2 : a.state === 1 ? 1.5 : 0.8;
        if (speed > maxSpeed) {
          a.vx = (a.vx / speed) * maxSpeed;
          a.vy = (a.vy / speed) * maxSpeed;
        }

        // Update position
        a.x += a.vx;
        a.y += a.vy;

        // Soft boundary
        if (a.x < 10) { a.x = 10; a.vx *= -0.5; }
        if (a.x > cw - 10) { a.x = cw - 10; a.vx *= -0.5; }
        if (a.y < 10) { a.y = 10; a.vy *= -0.5; }
        if (a.y > ch - 10) { a.y = ch - 10; a.vy *= -0.5; }

        // Draw agent
        const [r, g, b, baseAlpha] = STATE_COLORS[a.state];
        const pulse = a.state === 2
          ? 0.5 + 0.5 * Math.sin(time * 0.003 + a.phase)
          : a.state === 3
            ? 0.5 + 0.5 * Math.sin(time * 0.01 + a.phase)
            : 1;
        const alpha = baseAlpha * pulse;

        // Trail for investigating agents
        if (a.state === 1) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(a.x - a.vx * 10, a.y - a.vy * 10);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Dot
        ctx.beginPath();
        ctx.arc(a.x, a.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resize();
      // Re-center agents on resize
      const { w: nw, h: nh } = sizeRef.current;
      if (nw > 0 && nh > 0) {
        agentsRef.current = createAgents(300, nw, nh);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
});
