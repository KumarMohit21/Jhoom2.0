/* ==========================================================================
   JHOOM 2.0 - RKDF UNIVERSITY DANDIYA CELEBRATION
   DYNAMIC DURGA MAA BLINKING EYES & PARTICLES ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initDurgaMaaBlinkingEyes();
    initFloatingParticlesCanvas();
    initInteractiveCardGlow();
});

/* ==========================================================================
   1. DURGA MAA BLINKING EYES CANVAS (CLEANED - NO WHITE BORDER & NO TEXT)
   ========================================================================== */
function initDurgaMaaBlinkingEyes() {
    const canvas = document.getElementById('durgaEyesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const durgaImg = new Image();
    durgaImg.src = 'durga_maa.png';

    // Source Crop Box to skip outer white border frame and bottom text:
    // Original PNG: 600 x 600
    const SX = 16;
    const SY = 16;
    const SW = 568;
    const SH = 428;

    canvas.width = SW;
    canvas.height = SH;

    let isImgLoaded = false;
    durgaImg.onload = () => {
        isImgLoaded = true;
    };
    if (durgaImg.complete) {
        isImgLoaded = true;
    }

    // Blinking State
    let isBlinking = false;
    let blinkProgress = 0; // 0 = open, 1 = closed
    let blinkDuration = 260; // ms
    let lastBlinkTime = performance.now();
    let nextBlinkInterval = 2500 + Math.random() * 1500;
    let flashAlpha = 0;

    function updateBlinkState(now) {
        if (!isBlinking) {
            if (now - lastBlinkTime > nextBlinkInterval) {
                isBlinking = true;
                lastBlinkTime = now;
            }
        } else {
            const elapsed = now - lastBlinkTime;
            if (elapsed < blinkDuration) {
                blinkProgress = Math.sin((elapsed / blinkDuration) * Math.PI);
            } else {
                isBlinking = false;
                blinkProgress = 0;
                lastBlinkTime = now;
                nextBlinkInterval = 2200 + Math.random() * 1800;
                flashAlpha = 1.0; // Divine sparkle flash on reopen
            }
        }

        if (flashAlpha > 0) {
            flashAlpha -= 0.05;
            if (flashAlpha < 0) flashAlpha = 0;
        }
    }

    function renderDurgaMaa(now) {
        ctx.clearRect(0, 0, SW, SH);

        if (isImgLoaded) {
            updateBlinkState(now);

            ctx.save();
            ctx.globalAlpha = 0.96;

            // A) Draw Cropped Durga Maa Image (Cropping outer white border & bottom text!)
            ctx.drawImage(
                durgaImg,
                SX, SY, SW, SH, // Source Crop
                0, 0, SW, SH    // Destination
            );

            // B) Draw Divine Blinking Eyelids
            if (blinkProgress > 0.01) {
                const eyeCenters = [
                    { x: 189, y: 270 }, // Left Eye Center
                    { x: 379, y: 270 }  // Right Eye Center
                ];
                const eyeRadiusX = 66;
                const maxEyelidHeight = 42 * blinkProgress;

                eyeCenters.forEach(eye => {
                    ctx.save();
                    
                    // Eyelid Fill (Deep Red matching Durga Maa skin)
                    ctx.fillStyle = '#d20202';
                    ctx.beginPath();
                    ctx.ellipse(
                        eye.x,
                        eye.y - 16 + maxEyelidHeight,
                        eyeRadiusX,
                        Math.max(1, maxEyelidHeight),
                        0, 0, Math.PI * 2
                    );
                    ctx.fill();

                    // Lash Contour
                    ctx.strokeStyle = '#050000';
                    ctx.lineWidth = 3.5;
                    ctx.stroke();

                    ctx.restore();
                });
            }

            // C) Divine Eye Sparkle Flash on Reopening
            if (flashAlpha > 0) {
                const eyeCenters = [ { x: 189, y: 270 }, { x: 379, y: 270 } ];
                eyeCenters.forEach(eye => {
                    ctx.save();
                    ctx.globalAlpha = flashAlpha * 0.9;

                    const flashGrad = ctx.createRadialGradient(
                        eye.x, eye.y, 0,
                        eye.x, eye.y, 35
                    );
                    flashGrad.addColorStop(0, '#ffffff');
                    flashGrad.addColorStop(0.35, '#ffd700');
                    flashGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');

                    ctx.fillStyle = flashGrad;
                    ctx.beginPath();
                    ctx.arc(eye.x, eye.y, 35, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                });
            }

            ctx.restore();
        }

        requestAnimationFrame(renderDurgaMaa);
    }

    requestAnimationFrame(renderDurgaMaa);
}

/* ==========================================================================
   2. FULL SCREEN FLOATING GARBA PARTICLES & LIGHT TRAILS
   ========================================================================== */
function initFloatingParticlesCanvas() {
    const canvas = document.getElementById('dandiyaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 12), 75);

    const colors = [
        { r: 255, g: 215, b: 0, a: 0.7 },   // Gold
        { r: 224, g: 30,  b: 90, a: 0.6 },  // Garba Magenta
        { r: 255, g: 87,  b: 34, a: 0.6 },  // Saffron Orange
        { r: 255, g: 255, b: 255, a: 0.75 } // Sparkle White
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 5 + 1.5;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = - (Math.random() * 0.8 + 0.3);
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.7 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.008;
            this.pulseFactor = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.03 + 0.01;
            this.wobble = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.speedX + Math.sin(this.wobble) * 0.4;
            this.y += this.speedY;
            this.wobble += this.wobbleSpeed;

            this.pulseFactor += this.pulseSpeed;
            this.currentAlpha = this.alpha + Math.sin(this.pulseFactor) * 0.25;

            if (this.y < -20 || this.x < -20 || this.x > width + 20) {
                this.reset();
                this.y = height + 20;
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 2.2
            );
            gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${Math.max(0, this.currentAlpha)})`);
            gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        const bgGrad = ctx.createRadialGradient(
            width / 2, height / 3, 50,
            width / 2, height / 2, Math.max(width, height)
        );
        bgGrad.addColorStop(0, '#22030f');
        bgGrad.addColorStop(0.5, '#10041a');
        bgGrad.addColorStop(1, '#06020c');

        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateParticles);
    }

    requestAnimationFrame(animateParticles);
}

/* ==========================================================================
   3. INTERACTIVE CARD GLOW EFFECTS
   ========================================================================== */
function initInteractiveCardGlow() {
    const cards = document.querySelectorAll('.guideline-card, .terms-card, .qr-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}
