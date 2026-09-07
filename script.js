document.addEventListener("DOMContentLoaded", function() {
    // โหลด Navbar และ Footer พร้อมกันแบบ Parallel
    const loadNavbar = fetch('navbar.html')
        .then(response => {
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return response.text();
        })
        .then(data => {
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = data;
                highlightActiveNav();
            }
        })
        .catch(err => {
            console.error("Error loading navbar:", err);
            if (window.location.protocol === 'file:') {
                const navbarContainer = document.getElementById('navbar-container');
                if (navbarContainer) {
                    navbarContainer.innerHTML = `
                        <div style="background:#450a0a; color:#fde047; padding:12px; text-align:center; font-size:14px; font-weight:bold; border-bottom:1px solid #eab308;">
                            ⚠️ กรุณาเปิดดูเว็บผ่าน Apache/XAMPP ที่ URL: <a href="http://localhost/makbong-portal/" style="color:#ffffff; text-decoration:underline;">http://localhost/makbong-portal/</a> (เนื่องจาก Browser ไม่อนุญาตให้ใช้คำสั่ง fetch() บนไฟล์ที่เปิดตรงแบบ file:///)
                        </div>
                    `;
                }
            }
        });

    const loadFooter = fetch('footer.html')
        .then(response => {
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return response.text();
        })
        .then(data => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = data;
            }
        })
        .catch(err => console.error("Error loading footer:", err));

    // เมื่อโหลดส่วนประกอบครบแล้ว ให้ปิดหน้า Preloader แบบ Smooth Fade Out
    Promise.allSettled([loadNavbar, loadFooter]).then(() => {
        setupPageTransitions();
        hidePreloader();
    });

    // Fallback ป้องกันค้าง
    setTimeout(hidePreloader, 2000);
});

// ฟังก์ชันปิดหน้าจอโหลด (Smooth Fade Out)
function hidePreloader() {
    const preloader = document.getElementById('page-preloader');
    if (preloader && !preloader.classList.contains('opacity-0')) {
        setTimeout(() => {
            preloader.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                if (preloader && preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }, 200);
    }
}

// ฟังก์ชันสร้างความสมูทเมื่อคลิกเปลี่ยนหน้า (Page Transition ป้องกันจอกระตุก)
function setupPageTransitions() {
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        const target = link.getAttribute('target');

        // ตรวจสอบว่าเป็นลิงก์ภายในเว็บไซต์
        if (href && href.endsWith('.html') && !href.startsWith('http') && target !== '_blank') {
            link.addEventListener('click', function(e) {
                let currentPath = window.location.pathname.split('/').pop() || 'index.html';
                if (!currentPath.endsWith('.html')) currentPath = 'index.html';
                if (href === currentPath) return;

                e.preventDefault();

                let transitionOverlay = document.getElementById('page-preloader');
                if (!transitionOverlay) {
                    transitionOverlay = document.createElement('div');
                    transitionOverlay.id = 'page-preloader';
                    transitionOverlay.className = 'fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none';
                    transitionOverlay.innerHTML = `
                        <div class="relative flex flex-col items-center">
                            <div class="relative">
                                <div class="absolute -inset-3 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 rounded-full blur-xl opacity-80 animate-pulse"></div>
                                <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-2xl">
                                    <img src="img/Logo.png" alt="Mak Bong Logo" class="w-full h-full object-contain rounded-full bg-black p-2 animate-pulse">
                                </div>
                            </div>
                            <div class="mt-6 flex items-center gap-2">
                                <span class="text-xs sm:text-sm font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400 uppercase">
                                    MAK BONG...
                                </span>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(transitionOverlay);
                }

                requestAnimationFrame(() => {
                    transitionOverlay.classList.remove('opacity-0', 'pointer-events-none');
                    transitionOverlay.classList.add('opacity-100');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 220);
                });
            });
        }
    });
}

// ฟังก์ชันตรวจสอบและแสดงผลว่าผู้ใช้งานกำลังเปิดดูไฟล์ / หน้าไหนใน Navbar
function highlightActiveNav() {
    let path = window.location.pathname;
    let fileName = path.substring(path.lastIndexOf('/') + 1);
    fileName = fileName.split('?')[0].split('#')[0];

    if (!fileName || fileName === '' || !fileName.endsWith('.html')) {
        fileName = 'index.html';
    }

    // 1. ไฮไลต์เมนู Desktop
    const desktopLinks = document.querySelectorAll('#desktop-menu a.nav-link');
    desktopLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === fileName) {
            link.classList.remove('text-gray-300');
            link.className = 'nav-link bg-gradient-to-r from-red-600/30 to-amber-500/20 text-amber-300 font-black px-3.5 py-1.5 rounded-xl border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.35)] transition';
        }
    });

    // 2. ไฮไลต์เมนู Mobile Bottom Navigation
    const mobileLinks = document.querySelectorAll('#mobile-bottom-nav a.mobile-nav-link');
    mobileLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === fileName) {
            link.classList.remove('text-gray-400');
            link.classList.add('text-amber-400', 'font-black', 'bg-gradient-to-t', 'from-red-950/80', 'to-transparent', 'border-t-2', 'border-amber-400');
            const icon = link.querySelector('i');
            if (icon) {
                icon.classList.add('text-amber-400', 'scale-110');
            }
        }
    });
}