import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MapProps {
  pickup?: { lat: number; lng: number; address?: string };
  drop?: { lat: number; lng: number; address?: string };
  className?: string;
  showRoute?: boolean;
  zoom?: number;
}

export function DarkMap({ pickup, drop, className, showRoute = true, zoom = 13 }: MapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    const gridSize = 40;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 0.5;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 150 + 50;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (pickup && drop && showRoute) {
      const epsilon = 0.001;
      const padding = 0.02 / (zoom / 13);
      
      const latMin = Math.min(pickup.lat, drop.lat) - padding;
      const latMax = Math.max(pickup.lat, drop.lat) + padding;
      const lngMin = Math.min(pickup.lng, drop.lng) - padding;
      const lngMax = Math.max(pickup.lng, drop.lng) + padding;

      const latRange = Math.max(latMax - latMin, epsilon);
      const lngRange = Math.max(lngMax - lngMin, epsilon);

      const canvasPadding = 0.1;
      const drawableWidth = width * (1 - 2 * canvasPadding);
      const drawableHeight = height * (1 - 2 * canvasPadding);

      const latToY = (lat: number) => {
        const normalized = (lat - latMin) / latRange;
        const clamped = Math.max(0, Math.min(1, normalized));
        return height - (clamped * drawableHeight + height * canvasPadding);
      };

      const lngToX = (lng: number) => {
        const normalized = (lng - lngMin) / lngRange;
        const clamped = Math.max(0, Math.min(1, normalized));
        return clamped * drawableWidth + width * canvasPadding;
      };

      const pickupX = lngToX(pickup.lng);
      const pickupY = latToY(pickup.lat);
      const dropX = lngToX(drop.lng);
      const dropY = latToY(drop.lat);

      const gradient = ctx.createLinearGradient(pickupX, pickupY, dropX, dropY);
      gradient.addColorStop(0, '#f59e0b');
      gradient.addColorStop(1, '#eab308');

      const distance = Math.sqrt(Math.pow(dropX - pickupX, 2) + Math.pow(dropY - pickupY, 2));
      const minDistance = 10;

      let cp1x = pickupX;
      let cp1y = pickupY;
      let cp2x = dropX;
      let cp2y = dropY;

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f59e0b';

      ctx.beginPath();
      ctx.moveTo(pickupX, pickupY);

      if (distance < minDistance) {
        ctx.lineTo(dropX, dropY);
      } else {
        const maxCurvature = Math.min(width, height) * 0.15;
        const curvature = Math.min(distance * 0.3, maxCurvature);
        const dx = dropX - pickupX;
        const dy = dropY - pickupY;
        const perpX = -dy / distance;
        const perpY = dx / distance;

        cp1x = pickupX + dx * 0.3 + perpX * curvature * 0.5;
        cp1y = pickupY + dy * 0.3 + perpY * curvature * 0.5;
        cp2x = pickupX + dx * 0.7 + perpX * curvature * 0.5;
        cp2y = pickupY + dy * 0.7 + perpY * curvature * 0.5;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, dropX, dropY);
      }
      
      ctx.stroke();

      ctx.shadowBlur = 0;

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(pickupX, pickupY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pickupX, pickupY, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(dropX, dropY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(dropX, dropY, 12, 0, Math.PI * 2);
      ctx.stroke();

      const t = 0.25;
      let carX, carY, carAngle;

      if (distance < minDistance) {
        carX = pickupX + (dropX - pickupX) * t;
        carY = pickupY + (dropY - pickupY) * t;
        carAngle = Math.atan2(-(dropY - pickupY), dropX - pickupX);
      } else {
        carX = Math.pow(1-t, 3) * pickupX + 
               3 * Math.pow(1-t, 2) * t * cp1x + 
               3 * (1-t) * Math.pow(t, 2) * cp2x + 
               Math.pow(t, 3) * dropX;
        carY = Math.pow(1-t, 3) * pickupY + 
               3 * Math.pow(1-t, 2) * t * cp1y + 
               3 * (1-t) * Math.pow(t, 2) * cp2y + 
               Math.pow(t, 3) * dropY;

        const dxCar = 3 * Math.pow(1-t, 2) * (cp1x - pickupX) + 
                      6 * (1-t) * t * (cp2x - cp1x) + 
                      3 * Math.pow(t, 2) * (dropX - cp2x);
        const dyCar = 3 * Math.pow(1-t, 2) * (cp1y - pickupY) + 
                      6 * (1-t) * t * (cp2y - cp1y) + 
                      3 * Math.pow(t, 2) * (dropY - cp2y);
        carAngle = Math.atan2(-dyCar, dxCar);
      }

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffffff';

      ctx.save();
      ctx.translate(carX, carY);
      ctx.rotate(carAngle);

      ctx.fillRect(-10, -6, 20, 12);

      ctx.fillRect(-6, -8, 8, 4);

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(-8, -4, 6, 4);
      ctx.fillRect(2, -4, 6, 4);

      ctx.restore();
      ctx.shadowBlur = 0;
    } else if (pickup) {
      const pickupX = width * 0.5;
      const pickupY = height * 0.6;

      ctx.fillStyle = '#10b981';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#10b981';
      ctx.beginPath();
      ctx.arc(pickupX, pickupY, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(pickupX, pickupY, 14, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.beginPath();
      ctx.arc(pickupX, pickupY, 40, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [pickup, drop, showRoute, zoom]);

  return (
    <div className={cn("relative overflow-hidden bg-black", className)}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />
      
      {pickup && drop && showRoute && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-none">
          <div className="flex items-center gap-3 text-xs text-white/80">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>8km</span>
            </div>
            <div className="w-px h-3 bg-white/20"></div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>15min</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
