import React, { useRef, useEffect } from 'react';

interface AudioWaveformProps {
    waveform: Float32Array;
    audioDuration: number;
    beats: number[];
    hookDuration: number;
    beatInterval: number;
    itemCount: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
    waveform,
    audioDuration,
    beats,
    hookDuration,
    beatInterval,
    itemCount,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const displayW = canvas.clientWidth;
        const displayH = canvas.clientHeight;
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
        ctx.scale(dpr, dpr);

        const w = displayW;
        const h = displayH;

        // Clear
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // --- Draw timing regions ---
        const ctaDuration = 2;
        const totalUsed = hookDuration + itemCount * beatInterval + ctaDuration;

        // Hook region
        const hookEndX = (hookDuration / audioDuration) * w;
        ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
        ctx.fillRect(0, 0, hookEndX, h);

        // Item regions (alternating shades)
        for (let i = 0; i < itemCount; i++) {
            const startSec = hookDuration + i * beatInterval;
            const endSec = startSec + beatInterval;
            const x1 = (startSec / audioDuration) * w;
            const x2 = (endSec / audioDuration) * w;
            ctx.fillStyle = i % 2 === 0 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.06)';
            ctx.fillRect(x1, 0, x2 - x1, h);
        }

        // CTA region
        const ctaStart = hookDuration + itemCount * beatInterval;
        const ctaX1 = (ctaStart / audioDuration) * w;
        const ctaX2 = ((ctaStart + ctaDuration) / audioDuration) * w;
        ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
        ctx.fillRect(ctaX1, 0, ctaX2 - ctaX1, h);

        // --- Draw waveform ---
        const mid = h / 2;
        const maxH = h * 0.8;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.lineWidth = 1;

        for (let i = 0; i < waveform.length; i++) {
            const x = (i / waveform.length) * w;
            const amp = waveform[i] * maxH / 2;
            if (i === 0) {
                ctx.moveTo(x, mid - amp);
            } else {
                ctx.lineTo(x, mid - amp);
            }
        }
        // Mirror
        for (let i = waveform.length - 1; i >= 0; i--) {
            const x = (i / waveform.length) * w;
            const amp = waveform[i] * maxH / 2;
            ctx.lineTo(x, mid + amp);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.fill();
        ctx.stroke();

        // --- Draw beat markers ---
        for (const beat of beats) {
            const x = (beat / audioDuration) * w;
            if (x > w) break;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 3]);
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // --- Draw cut lines (hook, each item) ---
        // Hook cut
        ctx.beginPath();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.moveTo(hookEndX, 0);
        ctx.lineTo(hookEndX, h);
        ctx.stroke();

        // Item cuts
        for (let i = 1; i <= itemCount; i++) {
            const cutSec = hookDuration + i * beatInterval;
            const x = (cutSec / audioDuration) * w;
            if (x > w) break;
            ctx.beginPath();
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 1.5;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        // CTA end cut
        ctx.beginPath();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.5;
        ctx.moveTo(ctaX2, 0);
        ctx.lineTo(ctaX2, h);
        ctx.stroke();

        // --- Labels ---
        ctx.font = '10px system-ui, sans-serif';

        // Hook label
        ctx.fillStyle = '#818cf8';
        ctx.fillText('Hook', 4, 12);

        // Item labels
        for (let i = 0; i < itemCount; i++) {
            const startSec = hookDuration + i * beatInterval;
            const x = (startSec / audioDuration) * w + 4;
            if (x > w - 20) break;
            ctx.fillStyle = '#4ade80';
            ctx.fillText(`${i + 1}`, x, 12);
        }

        // CTA label
        if (ctaX1 < w - 20) {
            ctx.fillStyle = '#fb923c';
            ctx.fillText('CTA', ctaX1 + 4, 12);
        }

        // Total used line
        const totalX = (totalUsed / audioDuration) * w;
        if (totalUsed < audioDuration) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.moveTo(totalX, 0);
            ctx.lineTo(totalX, h);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
            ctx.fillText('end', totalX + 3, h - 4);
        }
    }, [waveform, audioDuration, beats, hookDuration, beatInterval, itemCount]);

    return (
        <div style={{ marginBottom: 8 }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: 80,
                    borderRadius: 6,
                    display: 'block',
                }}
            />
            <div
                style={{
                    display: 'flex',
                    gap: 12,
                    marginTop: 4,
                    fontSize: 10,
                    color: '#94a3b8',
                }}
            >
                <span>
                    <span style={{ color: '#818cf8' }}>|</span> Hook
                </span>
                <span>
                    <span style={{ color: '#4ade80' }}>|</span> Item cuts
                </span>
                <span>
                    <span style={{ color: '#fb923c' }}>|</span> CTA
                </span>
                <span>
                    <span style={{ color: 'rgba(250, 204, 21, 0.6)' }}>:</span> Beats
                </span>
            </div>
        </div>
    );
};
