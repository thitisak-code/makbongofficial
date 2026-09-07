document.addEventListener("DOMContentLoaded", function() {
    // โหลด Navbar กลาง
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            
            // ผูกฟังก์ชันปุ่มเมนูมือถือหลังจากโหลด HTML เข้ามาแล้ว
            const menuBtn = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            if(menuBtn && mobileMenu) {
                menuBtn.addEventListener('click', () => {
                    mobileMenu.classList.toggle('hidden');
                });
            }
        });

    // โหลด Footer กลาง
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        });
});