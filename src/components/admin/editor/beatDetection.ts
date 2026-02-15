/**
 * Autocorrelation-based tempo detection + onset picking.
 * Finds the dominant beat period via autocorrelation of the onset envelope,
 * then picks beats that align with that tempo grid.
 */

export interface BeatAnalysis {
    /** Beat timestamps in seconds */
    beats: number[];
    /** Suggested hook duration (first strong downbeat, >= 1s) */
    hookDuration: number;
    /** Detected beat interval in seconds (>= 0.5s) */
    beatInterval: number;
    /** Audio waveform samples (downsampled for visualization) */
    waveform: Float32Array;
    /** Duration of the audio in seconds */
    audioDuration: number;
}

export async function analyzeAudio(audioUrl: string): Promise<BeatAnalysis> {
    const ctx = new AudioContext();
    try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        const channelData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;
        const audioDuration = audioBuffer.duration;

        // --- 1. Generate waveform for visualization (downsample to ~1000 points) ---
        const waveformSize = 1000;
        const waveform = new Float32Array(waveformSize);
        const samplesPerPoint = Math.floor(channelData.length / waveformSize);
        for (let i = 0; i < waveformSize; i++) {
            let maxAbs = 0;
            const offset = i * samplesPerPoint;
            for (let j = 0; j < samplesPerPoint && offset + j < channelData.length; j++) {
                const abs = Math.abs(channelData[offset + j]);
                if (abs > maxAbs) maxAbs = abs;
            }
            waveform[i] = maxAbs;
        }

        // --- 2. Compute onset envelope ---
        // Use larger windows for more stable energy estimation
        const windowSize = 4096;
        const hopSize = 1024;
        const numFrames = Math.floor((channelData.length - windowSize) / hopSize);
        const frameRate = sampleRate / hopSize; // frames per second

        // Compute energy envelope using time-domain RMS
        const envelope: number[] = [];
        for (let f = 0; f < numFrames; f++) {
            const start = f * hopSize;
            let energy = 0;
            // Simple low-pass: average of squared samples with a running average
            for (let j = 0; j < windowSize; j++) {
                energy += channelData[start + j] * channelData[start + j];
            }
            envelope.push(Math.sqrt(energy / windowSize));
        }

        // Half-wave rectified first-order difference (onset strength)
        const onsetStrength: number[] = [0];
        for (let i = 1; i < envelope.length; i++) {
            onsetStrength.push(Math.max(0, envelope[i] - envelope[i - 1]));
        }

        // Smooth the onset strength
        const smoothed = smoothSignal(onsetStrength, 3);

        // --- 3. Autocorrelation to find dominant tempo ---
        // Search range: 0.5s to 4s beat interval (15 BPM to 120 BPM)
        const minLag = Math.floor(0.5 * frameRate);
        const maxLag = Math.floor(4.0 * frameRate);
        const acf = autocorrelation(smoothed, minLag, maxLag);

        // Find the strongest peak in the autocorrelation
        let bestLag = minLag;
        let bestVal = -Infinity;
        for (let lag = 0; lag < acf.length; lag++) {
            if (acf[lag] > bestVal) {
                bestVal = acf[lag];
                bestLag = minLag + lag;
            }
        }

        let beatInterval = bestLag / frameRate;

        // Enforce minimum 0.5s
        if (beatInterval < 0.5) beatInterval = 0.5;

        // --- 4. Pick beats aligned to the tempo grid ---
        // Find the best phase (offset) for the grid
        // Try different phases and pick the one with highest total onset energy
        const phaseSamples = 20;
        const phaseStep = beatInterval / phaseSamples;
        let bestPhase = 0;
        let bestPhaseEnergy = -Infinity;

        for (let p = 0; p < phaseSamples; p++) {
            const phase = p * phaseStep;
            let totalEnergy = 0;
            let t = phase;
            while (t < audioDuration) {
                const frameIdx = Math.round(t * frameRate);
                if (frameIdx >= 0 && frameIdx < smoothed.length) {
                    totalEnergy += smoothed[frameIdx];
                }
                t += beatInterval;
            }
            if (totalEnergy > bestPhaseEnergy) {
                bestPhaseEnergy = totalEnergy;
                bestPhase = phase;
            }
        }

        // Generate beat grid
        const beats: number[] = [];
        let t = bestPhase;
        while (t < audioDuration) {
            beats.push(Math.round(t * 100) / 100);
            t += beatInterval;
        }

        // --- 5. Determine hook duration ---
        // Find the first beat that's >= 1 second
        // If no beat is >= 1s, use a multiple of beatInterval that's >= 1s
        let hookDuration = 1;
        const firstBeatAfter1s = beats.find((b) => b >= 1);
        if (firstBeatAfter1s) {
            hookDuration = firstBeatAfter1s;
        } else {
            // Use multiples of beatInterval
            hookDuration = beatInterval;
            while (hookDuration < 1) {
                hookDuration += beatInterval;
            }
        }

        // Round nicely
        beatInterval = Math.round(beatInterval * 100) / 100;
        hookDuration = Math.round(hookDuration * 100) / 100;

        return {
            beats,
            hookDuration,
            beatInterval,
            waveform,
            audioDuration,
        };
    } finally {
        await ctx.close();
    }
}

/** Simple moving average smoothing */
function smoothSignal(signal: number[], radius: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < signal.length; i++) {
        let sum = 0;
        let count = 0;
        for (let j = Math.max(0, i - radius); j <= Math.min(signal.length - 1, i + radius); j++) {
            sum += signal[j];
            count++;
        }
        result.push(sum / count);
    }
    return result;
}

/** Compute autocorrelation for a range of lags */
function autocorrelation(signal: number[], minLag: number, maxLag: number): number[] {
    const n = signal.length;
    // Normalize signal
    let mean = 0;
    for (let i = 0; i < n; i++) mean += signal[i];
    mean /= n;

    const centered = signal.map((v) => v - mean);

    let norm = 0;
    for (let i = 0; i < n; i++) norm += centered[i] * centered[i];
    if (norm === 0) return new Array(maxLag - minLag + 1).fill(0);

    const result: number[] = [];
    for (let lag = minLag; lag <= maxLag; lag++) {
        let sum = 0;
        for (let i = 0; i < n - lag; i++) {
            sum += centered[i] * centered[i + lag];
        }
        result.push(sum / norm);
    }
    return result;
}
