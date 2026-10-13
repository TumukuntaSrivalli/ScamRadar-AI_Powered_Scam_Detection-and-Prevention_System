import React, { useEffect, useRef, useState } from 'react';

export default function RadarGlobe3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [activeBlip, setActiveBlip] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth || 500);
    let height = (canvas.height = canvas.offsetHeight || 500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 500;
      height = canvas.height = canvas.offsetHeight || 500;
    };
    window.addEventListener('resize', handleResize);

    // 3D Sphere Points
    const numPoints = 160;
    const points = [];
    const radius = Math.min(width, height) * 0.38;

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      points.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
        size: Math.random() * 1.8 + 1,
        color: Math.random() > 0.3 ? '#10B981' : '#3B82F6',
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    // Threat Hotspots on Globe
    const threatBlips = [
      { theta: 0.8, phi: 1.2, label: 'UPI Fraud [94%]', color: '#EF4444' },
      { theta: 1.6, phi: 3.4, label: 'Voice Clone [97%]', color: '#F59E0B' },
      { theta: 2.2, phi: 5.1, label: 'Digital Arrest [98%]', color: '#EC4899' },
      { theta: 1.1, phi: 4.5, label: 'WhatsApp Phish [91%]', color: '#10B981' }
    ];

    let rotX = 0.2;
    let rotY = 0;
    let targetRotX = 0.2;
    let targetRotY = 0;
    let sweepAngle = 0;
    let ripples = [];

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - width / 2;
      const mouseY = e.clientY - rect.top - height / 2;
      targetRotY = (mouseX / width) * 1.2;
      targetRotX = -(mouseY / height) * 1.2;
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: 0,
        maxR: 90,
        opacity: 0.9
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    let time = 0;

    const render = () => {
      time += 0.02;
      rotY += 0.006 + (targetRotY - rotY) * 0.05;
      rotX += (targetRotX - rotX) * 0.05;
      sweepAngle = (sweepAngle + 0.035) % (Math.PI * 2);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw concentric radar rings
      const rings = [0.2, 0.45, 0.7, 0.95];
      rings.forEach((rRatio, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * rRatio, 0, Math.PI * 2);
        ctx.strokeStyle = idx === rings.length - 1 ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.12)';
        ctx.lineWidth = idx === rings.length - 1 ? 1.5 : 1;
        if (idx % 2 === 1) {
          ctx.setLineDash([4, 6]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius * 1.05, cy);
      ctx.lineTo(cx + radius * 1.05, cy);
      ctx.moveTo(cx, cy - radius * 1.05);
      ctx.lineTo(cx, cy + radius * 1.05);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Rotating Radar Sweep Wedge
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.95);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      gradient.addColorStop(0.8, 'rgba(16, 185, 129, 0.08)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius * 0.95, sweepAngle - 0.45, sweepAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Radar Sweep Leading Line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(sweepAngle) * radius * 0.95,
        cy + Math.sin(sweepAngle) * radius * 0.95
      );
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Project & Render 3D Globe Points
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Sort points by Z for depth
      const projectedPoints = points.map((p) => {
        // Rotate around Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        // Rotate around X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Perspective projection
        const fov = radius * 2.4;
        const scale = fov / (fov + z2);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          pz: z2,
          scale,
          color: p.color,
          size: p.size,
          pulse: Math.sin(time * 3 + p.pulseOffset)
        };
      });

      projectedPoints.sort((a, b) => a.pz - b.pz);

      // Render wireframe latitude & longitude rings in 3D
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      [-0.5, 0, 0.5].forEach((latOffset) => {
        ctx.beginPath();
        const rRing = radius * Math.cos(latOffset * Math.PI * 0.5);
        const yBase = radius * Math.sin(latOffset * Math.PI * 0.5);
        for (let a = 0; a <= Math.PI * 2; a += 0.2) {
          const xr = rRing * Math.cos(a);
          const zr = rRing * Math.sin(a);
          const x1 = xr * cosY - zr * sinY;
          const z1 = zr * cosY + xr * sinY;
          const y2 = yBase * cosX - z1 * sinX;
          const z2 = z1 * cosX + yBase * sinX;
          const scale = (radius * 2.4) / (radius * 2.4 + z2);
          const px = cx + x1 * scale;
          const py = cy + y2 * scale;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      // Draw points
      projectedPoints.forEach((pt) => {
        const alpha = Math.max(0.12, (pt.pz + radius) / (2 * radius));
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, Math.max(0.5, pt.size * pt.scale * (1 + pt.pulse * 0.2)), 0, Math.PI * 2);
        ctx.fillStyle = pt.color === '#10B981' ? `rgba(16, 185, 129, ${alpha})` : `rgba(59, 130, 246, ${alpha})`;
        ctx.fill();
      });

      // Render 3D Threat Hotspots
      threatBlips.forEach((blip) => {
        const blipPhi = blip.phi + rotY;
        const bx = radius * 0.88 * Math.sin(blip.theta) * Math.cos(blipPhi);
        const by0 = radius * 0.88 * Math.sin(blip.theta) * Math.sin(blipPhi);
        const bz0 = radius * 0.88 * Math.cos(blip.theta);

        const bx1 = bx * cosY - bz0 * sinY;
        const bz1 = bz0 * cosY + bx * sinY;
        const by2 = by0 * cosX - bz1 * sinX;
        const bz2 = bz1 * cosX + by0 * sinX;

        const scale = (radius * 2.4) / (radius * 2.4 + bz2);
        const bpx = cx + bx1 * scale;
        const bpy = cy + by2 * scale;

        if (bz2 > -radius * 0.5) {
          // Hotspot pulse
          const pulseR = 8 + Math.sin(time * 5) * 4;
          ctx.beginPath();
          ctx.arc(bpx, bpy, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = blip.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(bpx, bpy, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = blip.color;
          ctx.shadowColor = blip.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Label
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(blip.label, bpx + 10, bpy - 6);
        }
      });

      // Render Click Ripples
      ripples.forEach((rip, idx) => {
        rip.r += 2.5;
        rip.opacity -= 0.025;
        if (rip.opacity <= 0) {
          ripples.splice(idx, 1);
          return;
        }
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${rip.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[480px] mx-auto flex items-center justify-center">
      {/* Outer Glow Halo */}
      <div className="absolute inset-4 rounded-full bg-accent/5 blur-2xl pointer-events-none animate-pulse-glow"></div>
      
      {/* Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full relative z-10 cursor-crosshair rounded-full"
      />

      {/* Floating HUD Badges */}
      <div className="absolute top-2 left-2 z-20 bg-darkbg/85 border border-accent/30 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono text-accent shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
        <span>AI RADAR: SCANNING 3D GRID</span>
      </div>

      <div className="absolute bottom-2 right-2 z-20 bg-darkbg/85 border border-gray-800 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono text-gray-300 shadow-lg">
        <span className="text-accent font-bold">LATENCY:</span> 1.1s • <span className="text-emerald-400">STATUS: ACTIVE</span>
      </div>
    </div>
  );
}
