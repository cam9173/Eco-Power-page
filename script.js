document.addEventListener('DOMContentLoaded', () => {
    
    // PRELOADER
    window.addEventListener('load', () => document.getElementById('preloader').classList.add('hidden'));

    // SCROLL & NAVBAR
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backTop = document.getElementById('back-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        
        // Barra progreso
        scrollProgress.style.width = `${(scrollY / height) * 100}%`;
        
        // Navbar
        navbar.classList.toggle('scrolled', scrollY > 50);
        
        // Botón subir
        backTop.classList.toggle('visible', scrollY > 400);
        
        // Animaciones scroll
        document.querySelectorAll('.fade-in-scroll').forEach(el => {
            if(el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('active');
        });

        // Progress bars metas
        document.querySelectorAll('.progress').forEach(bar => {
            if(bar.getBoundingClientRect().top < window.innerHeight) bar.style.width = bar.dataset.width;
        });
    });

    backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

    // MENÚ MÓVIL
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    document.querySelectorAll('.nav-menu a').forEach(link => link.addEventListener('click', () => navMenu.classList.remove('active')));

    // CARRUSEL
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function startAutoSlide() { slideInterval = setInterval(() => showSlide(currentSlide + 1), 4500); }
    function resetAutoSlide() { clearInterval(slideInterval); startAutoSlide(); }

    document.querySelector('.next').addEventListener('click', () => { showSlide(currentSlide + 1); resetAutoSlide(); });
    document.querySelector('.prev').addEventListener('click', () => { showSlide(currentSlide - 1); resetAutoSlide(); });
    dots.forEach(dot => dot.addEventListener('click', () => { showSlide(parseInt(dot.dataset.index)); resetAutoSlide(); }));
    startAutoSlide();

    // CONTADORES ESTADÍSTICAS
    const counters = document.querySelectorAll('.stat-num');
    const observerStats = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                const target = +entry.target.dataset.target;
                let count = 0;
                const inc = target / 60;
                const update = () => { count += inc; count < target ? (entry.target.textContent = Math.floor(count).toLocaleString()) && requestAnimationFrame(update) : (entry.target.textContent = target.toLocaleString()); };
                update();
            }
        });
    }, {threshold: 0.5});
    counters.forEach(c => observerStats.observe(c));

    // BLOG MODAL
    const blogModal = document.getElementById('blog-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const blogData = {
        1: { t: "Amina: Micro-redes solares en aldeas (Kenia)", c: "<p>Amina, de 16 años, lideró un equipo escolar para construir micro-redes solares descentralizadas en 4 aldeas rurales de Nairobi. Usando paneles reciclados y baterías de litio de segunda vida, logró que +300 niños pudieran estudiar de noche y que una clínica local refrigerara vacunas. <strong>Impacto:</strong> Reconocimiento del PNUD 2024 y expansión a 3 distritos más.</p>" },
        2: { t: "Rohan: Biogás escolar para cocinar (India)", c: "<p>Rohan y su club de ciencias diseñaron biodigestores portátiles usando plástico reciclado. Capturan metano de residuos agrícolas para cocinar. <strong>Impacto:</strong> Reemplazaron leña en 40 hogares, reduciendo un 70% las enfermedades respiratorias infantiles. Ahora capacitan a otras escuelas en Maharashtra.</p>" },
        3: { t: "Sofía: Eólica para el pueblo Wayúu (Colombia)", c: "<p>Investigando el potencial eólico de La Guajira, Sofía creó turbinas verticales con materiales locales y chatarra tecnológica. <strong>Impacto:</strong> 8 rancherías indígenas ahora tienen electricidad para bombear agua y cargar radios comunitarias. Proyecto avalado por el gobierno departamental.</p>" },
        4: { t: "Lukas: Techos solares en escuelas (Alemania)", c: "<p>Organizó una campaña digital y presión estudiantil en el parlamento local. Logró que el municipio de Berlín destinara fondos para instalar paneles en 15 colegios. <strong>Impacto:</strong> Reducción de 200t CO₂/año y creación de un 'club de eficiencia energética' donde los alumnos monitorean el consumo en tiempo real.</p>" },
        5: { t: "Mariana: Hidroeléctrica comunitaria (Brasil)", c: "<p>Mariana desarrolló una micro-turbina de bajo costo que funciona con corrientes suaves de ríos amazónicos, evitando represas. <strong>Impacto:</strong> Electrificación de 3 comunidades ribereñas sin deforestar ni alterar ecosistemas. Ganó el Premio Juvenil ONU Medio Ambiente 2025.</p>" }
    };

    document.querySelectorAll('.blog-btn').forEach(btn => btn.addEventListener('click', () => {
        const card = btn.closest('.blog-card');
        const id = card.dataset.blog;
        modalTitle.textContent = blogData[id].t;
        modalBody.innerHTML = blogData[id].c;
        blogModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }));

    closeModal.addEventListener('click', () => { blogModal.classList.remove('active'); document.body.style.overflow = ''; });
    blogModal.addEventListener('click', e => e.target === blogModal && closeModal.click());
});