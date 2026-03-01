document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlideIndex = 0;

    // Inject aurora background layer into each slide
    slides.forEach(slide => {
        const aurora = document.createElement('div');
        aurora.className = 'aurora-layer';
        slide.prepend(aurora);
    });

    const currentSlideIndicator = document.getElementById('current-slide');
    const totalSlidesIndicator = document.getElementById('total-slides');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');

    // Initialize
    if (totalSlidesIndicator) totalSlidesIndicator.textContent = totalSlides;
    updateProgressBar();

    function updatePresentation() {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentSlideIndex].classList.add('active');
        if (currentSlideIndicator) currentSlideIndicator.textContent = currentSlideIndex + 1;
        updateProgressBar();
        manageVideos();
    }

    function updateProgressBar() {
        const pct = ((currentSlideIndex + 1) / totalSlides) * 100;
        if (progressBar) progressBar.style.width = pct + '%';
    }

    // Play videos only on the active slide, pause all others
    let videoPlayTimeout = null;

    function manageVideos() {
        try {
            if (videoPlayTimeout) clearTimeout(videoPlayTimeout);

            slides.forEach((slide, index) => {
                const videos = slide.querySelectorAll('video');
                if (index !== currentSlideIndex) {
                    videos.forEach(video => {
                        try {
                            video.pause();
                            video.currentTime = 0;
                        } catch (err) { }
                    });
                }
            });

            // Wait for the slide transition to finish before playing
            videoPlayTimeout = setTimeout(() => {
                try {
                    const activeSlide = slides[currentSlideIndex];
                    const activeVideos = activeSlide.querySelectorAll('video');
                    activeVideos.forEach(video => {
                        video.muted = true;
                        video.play().catch(() => { });
                    });
                } catch (err) { }
            }, 900);
        } catch (err) { }
    }

    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            updatePresentation();
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updatePresentation();
        }
    }

    function goToSlide(n) {
        if (n >= 0 && n < totalSlides) {
            currentSlideIndex = n;
            updatePresentation();
        }
    }

    // Button controls
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowRight':
            case ' ':
            case 'Enter':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'Backspace':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                toggleFullscreen();
                break;
        }

        // Number keys 1-9 jump to slide
        if (e.key >= '1' && e.key <= '9') {
            const idx = parseInt(e.key) - 1;
            if (idx < totalSlides) goToSlide(idx);
        }
        if (e.key === '0' && totalSlides >= 10) goToSlide(9);
    });

    // Click on slide to advance
    slides.forEach(slide => {
        slide.addEventListener('click', (e) => {
            if (!e.target.closest('button') && !e.target.closest('.controls') && !e.target.closest('a') && !e.target.closest('video')) {
                nextSlide();
            }
        });
    });

    // Fullscreen toggle
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen().catch(() => { });
        }
    }
});
