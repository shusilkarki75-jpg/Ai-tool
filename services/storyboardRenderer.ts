/**
 * Free cinematic visual storyboard renderer using HTML5 Canvas.
 * Creates artistic, high-resolution (1280x720) cinematic storyboard frames
 * based on scene descriptions without requiring paid AI image models.
 */

interface RenderOptions {
    sceneId: number;
    prompt: string;
    summary?: string;
    aspectRatio?: '16:9' | '9:16' | '1:1';
}

export function renderCinematicStoryboard(options: RenderOptions): string {
    const { sceneId, prompt, summary } = options;
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const lower = (prompt + ' ' + (summary || '')).toLowerCase();

    // Determine color mood
    let bgColors = ['#0f172a', '#1e1b4b', '#311042'];
    let sunColor = '#fbbf24';
    let hasMoon = false;
    let hasMountains = true;
    let hasTemple = false;
    let hasFlags = false;
    let hasStage = false;

    if (lower.includes('sunset') || lower.includes('dusk') || lower.includes('golden') || lower.includes('साँझ')) {
        bgColors = ['#1e102d', '#7c2d12', '#ea580c', '#fbbf24'];
        sunColor = '#fef08a';
    } else if (lower.includes('night') || lower.includes('moon') || lower.includes('dark') || lower.includes('रात') || lower.includes('तारा')) {
        bgColors = ['#020617', '#0f172a', '#1e1b4b'];
        hasMoon = true;
    } else if (lower.includes('morning') || lower.includes('sunrise') || lower.includes('dawn') || lower.includes('बिहान')) {
        bgColors = ['#082f49', '#155e75', '#0284c7', '#fed7aa'];
        sunColor = '#fff7ed';
    } else if (lower.includes('rain') || lower.includes('cloud') || lower.includes('storm') || lower.includes('पानी')) {
        bgColors = ['#090d16', '#1e293b', '#334155'];
        hasMoon = false;
    } else if (lower.includes('temple') || lower.includes('kathmandu') || lower.includes('stupa') || lower.includes('मन्दिर') || lower.includes('गुम्बा')) {
        bgColors = ['#2e1065', '#831843', '#be123c', '#f59e0b'];
        hasTemple = true;
        hasFlags = true;
    } else if (lower.includes('stage') || lower.includes('concert') || lower.includes('music') || lower.includes('गीत') || lower.includes('गायन')) {
        bgColors = ['#0a0a0f', '#2e0854', '#831843'];
        hasStage = true;
        hasMountains = false;
    }

    if (lower.includes('flag') || lower.includes('prayer') || lower.includes('धोजा') || lower.includes('लुङ्दर')) {
        hasFlags = true;
    }

    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgColors.forEach((col, idx) => {
        skyGrad.addColorStop(idx / (bgColors.length - 1), col);
    });
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Stars for night scenes
    if (hasMoon || lower.includes('night')) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 90; i++) {
            const sx = (Math.sin(i * 997) * 0.5 + 0.5) * canvas.width;
            const sy = (Math.cos(i * 541) * 0.5 + 0.5) * (canvas.height * 0.55);
            const sr = (i % 3) * 0.8 + 0.6;
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 3. Sun or Moon
    if (hasMoon) {
        ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
        ctx.shadowColor = 'rgba(254, 240, 138, 0.6)';
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.arc(950, 180, 48, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    } else if (sunColor && !hasStage) {
        ctx.fillStyle = sunColor;
        ctx.shadowColor = sunColor;
        ctx.shadowBlur = 60;
        ctx.beginPath();
        ctx.arc(750, 240, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // 4. Stage Lights if concert/music
    if (hasStage) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const beam1 = ctx.createLinearGradient(300, 0, 640, 650);
        beam1.addColorStop(0, 'rgba(244, 63, 94, 0.45)');
        beam1.addColorStop(1, 'rgba(244, 63, 94, 0)');
        ctx.fillStyle = beam1;
        ctx.beginPath();
        ctx.moveTo(250, 0);
        ctx.lineTo(350, 0);
        ctx.lineTo(750, 650);
        ctx.lineTo(500, 650);
        ctx.closePath();
        ctx.fill();

        const beam2 = ctx.createLinearGradient(980, 0, 640, 650);
        beam2.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
        beam2.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = beam2;
        ctx.beginPath();
        ctx.moveTo(930, 0);
        ctx.lineTo(1030, 0);
        ctx.lineTo(780, 650);
        ctx.lineTo(530, 650);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // 5. Himalayan Mountains (Layer 1 - Far peaks with snow)
    if (hasMountains) {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
        ctx.beginPath();
        ctx.moveTo(0, 420);
        ctx.lineTo(180, 310);
        ctx.lineTo(320, 360);
        ctx.lineTo(520, 260);
        ctx.lineTo(700, 340);
        ctx.lineTo(920, 230);
        ctx.lineTo(1120, 330);
        ctx.lineTo(1280, 270);
        ctx.lineTo(1280, 720);
        ctx.lineTo(0, 720);
        ctx.closePath();
        ctx.fill();

        // Layer 2 - Mid Mountain ridge
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.moveTo(0, 480);
        ctx.lineTo(240, 390);
        ctx.lineTo(460, 450);
        ctx.lineTo(680, 360);
        ctx.lineTo(900, 430);
        ctx.lineTo(1140, 380);
        ctx.lineTo(1280, 450);
        ctx.lineTo(1280, 720);
        ctx.lineTo(0, 720);
        ctx.closePath();
        ctx.fill();

        // Layer 3 - Foreground hills
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.moveTo(0, 560);
        ctx.bezierCurveTo(340, 510, 520, 580, 800, 530);
        ctx.bezierCurveTo(1000, 500, 1160, 540, 1280, 520);
        ctx.lineTo(1280, 720);
        ctx.lineTo(0, 720);
        ctx.closePath();
        ctx.fill();
    }

    // 6. Nepali Pagoda Temple Silhouette
    if (hasTemple) {
        ctx.fillStyle = '#05070c';
        // Base roof
        const tx = 640;
        const ty = 480;
        // Tier 3 (Bottom)
        ctx.beginPath();
        ctx.moveTo(tx - 130, ty + 60);
        ctx.lineTo(tx, ty + 10);
        ctx.lineTo(tx + 130, ty + 60);
        ctx.lineTo(tx + 115, ty + 70);
        ctx.lineTo(tx - 115, ty + 70);
        ctx.closePath();
        ctx.fill();
        // Tier 2 (Middle)
        ctx.beginPath();
        ctx.moveTo(tx - 90, ty + 10);
        ctx.lineTo(tx, ty - 30);
        ctx.lineTo(tx + 90, ty + 10);
        ctx.lineTo(tx + 75, ty + 20);
        ctx.lineTo(tx - 75, ty + 20);
        ctx.closePath();
        ctx.fill();
        // Tier 1 (Top)
        ctx.beginPath();
        ctx.moveTo(tx - 60, ty - 30);
        ctx.lineTo(tx, ty - 65);
        ctx.lineTo(tx + 60, ty - 30);
        ctx.lineTo(tx + 50, ty - 22);
        ctx.lineTo(tx - 50, ty - 22);
        ctx.closePath();
        ctx.fill();
        // Pinnacle (Gajur)
        ctx.fillRect(tx - 3, ty - 90, 6, 25);
    }

    // 7. Prayer Flags String (Lungdar)
    if (hasFlags) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 140);
        ctx.quadraticCurveTo(640, 260, 1280, 160);
        ctx.stroke();

        const flagColors = ['#3b82f6', '#ffffff', '#ef4444', '#22c55e', '#eab308'];
        for (let i = 40; i < 1240; i += 32) {
            const t = i / 1280;
            const fy = (1 - t) * (1 - t) * 140 + 2 * (1 - t) * t * 260 + t * t * 160;
            ctx.fillStyle = flagColors[(Math.floor(i / 32)) % flagColors.length];
            ctx.beginPath();
            ctx.moveTo(i, fy);
            ctx.lineTo(i + 20, fy + 3);
            ctx.lineTo(i + 14, fy + 24);
            ctx.lineTo(i, fy + 18);
            ctx.closePath();
            ctx.fill();
        }
    }

    // 8. Atmospheric Cinematic Fog / Mist
    const mistGrad = ctx.createLinearGradient(0, 520, 0, 720);
    mistGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
    mistGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, 520, canvas.width, 200);

    // 9. Cinematic Vignette (dark corners)
    const vig = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 300, canvas.width / 2, canvas.height / 2, 750);
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 10. Cinematic Storyboard Overlays (Scene Metadata Stamp)
    ctx.save();
    // Top Bar Badge
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(36, 36, 310, 38);
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, 310, 38);

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(54, 55, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`SCENE ${sceneId.toString().padStart(2, '0')}`, 68, 60);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('16:9 • 4K CINEMATIC • DRAFT', 145, 60);

    // Bottom Caption Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(36, canvas.height - 105, canvas.width - 72, 68);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(36, canvas.height - 105, canvas.width - 72, 68);

    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillStyle = '#f8fafc';
    const displayPrompt = prompt.length > 115 ? prompt.slice(0, 112) + '...' : prompt;
    ctx.fillText(displayPrompt, 54, canvas.height - 70);

    if (summary) {
        ctx.font = '13px Inter, sans-serif';
        ctx.fillStyle = '#fb7185';
        const displaySummary = summary.length > 100 ? summary.slice(0, 97) + '...' : summary;
        ctx.fillText(displaySummary, 54, canvas.height - 48);
    }
    ctx.restore();

    return canvas.toDataURL('image/png');
}
