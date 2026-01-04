import { Howl } from 'howler';

class SoundManager {
    private sounds: Map<string, Howl> = new Map();
    private enabled: boolean = true;

    constructor() {
        // Initialize with simple generated sounds
        this.initializeSounds();
    }

    private initializeSounds() {
        // Create simple beep sounds using data URIs
        // These are very lightweight synthesized sounds

        // Hover sound - soft, short beep
        const hoverSound = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFgH10cG1qaGVjYF5bWVdVU1FRUFFPT01NTExMTExMTE1OT1BRUlNUVVZXWFlaW11eYGFjZWdpa2xtb3F0eHuAhYmNkJSXmp2goqSnqautrrCxsrO0tba3t7i4uLm5ubq6urm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubq5ubm5ubi4uLi3t7e3tre2tra2tbW1tLS0s7OzsrKysbGxsK+vra2tq6urqqqqqampp6enpaWlpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSko6SkoqOko6Kjoqmqq6ytrq+wsbKztLW2t7e4uLm5ubi4uLe3t7a2tbW0s7OysK+urKqop6WkoqCem5mWk5CLiIV+enZybmplYV5aVlNPSkdEQD06NjMvKycjHx0aFhMPDQoIBQMCAQ=='],
            volume: 0.12,
            rate: 2.0
        });

        // Click sound - slightly deeper, quick tap
        const clickSound = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAgICAgICAgICAgICAgICAgICBgoODhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNztDR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+//7+/v39/fz8/Pv7+/r6+vn5+fj4+Pf39/b29vX19fT09PPz8/Ly8vHx8fDw8O/v7+7u7u3t7ezs7Ovr6+rq6unp6ejo6Ofn5+bm5uXl5eTk5OPj4+Li4uHh4eHh4ODg4ODg4ODg4ODg4ODg4PDw8PDw8PDw8O/v7+/v7+/v7+7u7u7u7u7u7u3t7e3t7ezs7Ozs7Ozs7Ovr6+vr6+rq6urq6unp6enp6ejo6Ojo6Ofn5+fn5+bm5ubm5uXl5eXl5eTk5OTk5OPj4+Pj4+Li4uLi4uHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4uLi4uLi4+Pj4+Pk5OTk5eXl5ebm5ufn5+jo6Onp6err6+zs7e3u7u/v8PDx8fLy8/P09PX19vb39/j4+fr6+/v8/f3+/v//AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w=='],
            volume: 0.18,
            rate: 1.8
        });

        // Success sound - cheerful, triumphant
        const successSound = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAgICAgICBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/'],
            volume: 0.25,
            rate: 1.5
        });

        this.sounds.set('hover', hoverSound);
        this.sounds.set('click', clickSound);
        this.sounds.set('success', successSound);
    }

    play(soundName: string) {
        if (!this.enabled) return;

        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.play();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }
}

export const soundManager = new SoundManager();
