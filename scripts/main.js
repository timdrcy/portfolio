// =========================================
// INITIAL SETUP & INTERACTIONS
// =========================================
document.addEventListener('DOMContentLoaded', () => 
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const sections = document.querySelectorAll('.section-hidden');
    const cursor = document.querySelector('.custom-cursor');
    const infiniteWaveContainer = document.querySelector('.infinite-wave-container');
    const projectLinks = document.querySelectorAll('[data-project]');
    const circleTransition = document.querySelector('.circle-transition');

    const hero = document.querySelector('.hero');
    const aboutSection = document.querySelector('#about');
    const projectsSection = document.querySelector('#projects');
    const navLogo = document.querySelector('.nav-logo');
    const navAboutLinks = document.querySelectorAll('.nav-menu li a[href="#about"], .nav-menu li a[href="index.html#about"]');
    const navProjectsLinks = document.querySelectorAll('.nav-menu li a[href="#projects"], .nav-menu li a[href="index.html#projects"]');


    if (circleTransition && sessionStorage.getItem('circleActive') === 'true') {
        document.body.style.background = '#000';
        circleTransition.classList.add('active');
        setTimeout(() => {
            circleTransition.classList.remove('active');
            setTimeout(() => {
                document.body.style.transition = 'background 0.8s ease';
                document.body.style.background = 'var(--bg-color)';
                sessionStorage.removeItem('circleActive');
            }, 1300); 
        }, 1300);
    }

    // =========================================
    // HELPER FUNCTIONS
    // =========================================
    function isOnDetailPage() {
        return hero && hero.style && hero.style.display === 'none';
    }

    function showCircleTransition(callback) {
        if (!circleTransition) {
            callback();
            return;
        }
        sessionStorage.setItem('circleActive', 'true');
        circleTransition.classList.add('active');
        setTimeout(() => {
            callback();
        }, 1600);
    }

    function navigateToSection(hash) {
        if (isOnDetailPage()) {
            if (circleTransition && hero && aboutSection && projectsSection) {
                showCircleTransition(() => {
                    hero.style.display = 'flex';
                    aboutSection.style.display = 'block';
                    projectsSection.style.display = 'block';
                    window.location.hash = hash;
                });
            } else {
                window.location.hash = hash;
            }
        } else {
            window.location.hash = hash;
        }
    }

    function handlePageNavigation(e, url) {
        e.preventDefault();
        showCircleTransition(() => {
            window.location.href = url;
        });
    }

    // =========================================
    // CURSOR INTERACTIONS
    // =========================================
    document.addEventListener('mousemove', (e) => {
        if (!cursor) return;
        cursor.style.top = `${e.clientY - 15}px`;
        cursor.style.left = `${e.clientX - 15}px`;
    });

    const interactiveElements = document.querySelectorAll('a, .hover-glow, .hover-scale');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (!cursor) return;
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            cursor.style.background = '#fff';
        });
        el.addEventListener('mouseleave', () => {
            if (!cursor) return;
            cursor.style.width = '30px';
            cursor.style.height = '30px';
            cursor.style.background = 'var(--accent-color)';
        });
    });

    // =========================================
    // HERO TYPEWRITER EFFECT
    // =========================================
    if (heroTitle && heroSubtitle) {
        const titleText = "Creating Fun Sounds & Games";
        heroTitle.textContent = "";
        let index = 0;
        function typeTitle() {
            if (index < titleText.length) {
                heroTitle.textContent += titleText.charAt(index);
                index++;
                setTimeout(typeTitle, 80);
            } else {
                heroSubtitle.style.opacity = 1;
                heroSubtitle.style.transition = "opacity 1s ease";
            }
        }
        setTimeout(() => {
            heroTitle.style.opacity = 1;
            typeTitle();
        }, 500);
    }

    // =========================================
    // SECTION ANIMATIONS ON SCROLL
    // =========================================
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold: 0.1});
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // =========================================
    // INFINITE WAVE SCROLL EFFECT
    // =========================================
    if (infiniteWaveContainer) {
        function updateWavePosition() {
            const scrollY = window.scrollY;
            const factor = 0.5; 
            const offsetX = (-scrollY * factor);
            infiniteWaveContainer.style.backgroundPositionX = offsetX + 'px';
            requestAnimationFrame(updateWavePosition);
        }
        requestAnimationFrame(updateWavePosition);
    }

    // =========================================
    // PROJECT LINK INTERACTIONS
    // =========================================
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const url = link.getAttribute('href');
            handlePageNavigation(e, url);
        });
    });

    // =========================================
    // NAVIGATION CLICKS
    // =========================================
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            const href = navLogo.getAttribute('href');
            if (href && href.includes('.html')) {
                handlePageNavigation(e, href);
            } else {
                e.preventDefault();
                navigateToSection('#hero');
            }
        });
    }

    navAboutLinks.forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href && href.includes('.html')) {
                handlePageNavigation(e, href);
            } else {
                e.preventDefault();
                navigateToSection('#about');
            }
        });
    });

    navProjectsLinks.forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href && href.includes('.html')) {
                handlePageNavigation(e, href);
            } else {
                e.preventDefault();
                navigateToSection('#projects');
            }
        });
    });

    document.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.includes('.html') && !a.dataset.project && a !== navLogo) {
            a.addEventListener('click', (e) => {
                handlePageNavigation(e, href);
            });
        }
    });

    // =========================================
    // AUDIO PLAYER FOR PROJECT DETAIL PAGES
    // =========================================
    const audioPlayers = document.querySelectorAll('.audio-player');
    audioPlayers.forEach(player => {
        const audio = player.querySelector('audio');
        const playButton = player.querySelector('.play-button');
        const disc = player.querySelector('.disc');
        const timeDisplay = player.querySelector('.time-display');
        const progressBar = player.querySelector('.progress-bar');

        let isPlaying = false;
        let duration = 0;
        let currentTime = 0;

        if (audio) {
            audio.addEventListener('loadedmetadata', () => {
                duration = audio.duration;
                updateTimeDisplay();
            });

            audio.addEventListener('timeupdate', () => {
                currentTime = audio.currentTime;
                updateTimeDisplay();
                updateProgressBar();
            });
        }

        if (playButton && audio && disc) {
            playButton.addEventListener('click', () => {
                if (!isPlaying) {
                    audio.play();
                    isPlaying = true;
                    playButton.textContent = 'Pause';
                    disc.style.animation = 'spin 3s linear infinite';
                } else {
                    audio.pause();
                    isPlaying = false;
                    playButton.textContent = 'Play';
                    disc.style.animation = 'spinPaused 3s linear infinite';
                }
            });
        }

        if (progressBar && audio) {
            progressBar.addEventListener('input', () => {
                if (!isNaN(duration)) {
                    audio.currentTime = (progressBar.value / 100) * duration;
                }
            });
        }

        function updateTimeDisplay() {
            if (!timeDisplay) return;
            const cur = formatTime(currentTime);
            const dur = formatTime(duration);
            timeDisplay.textContent = `${cur} / ${dur}`;
        }

        function updateProgressBar() {
            if (!isNaN(duration)) {
                const percent = (currentTime / duration) * 100;
                progressBar.value = percent;
            }
        }

        function formatTime(sec) {
            if (isNaN(sec)) return "00:00";
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60);
            return `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
        }
    });
});
