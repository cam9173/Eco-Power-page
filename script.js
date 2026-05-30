document.addEventListener('DOMContentLoaded', () => {
    
    // ===== PRELOADER =====
    window.addEventListener('load', () => {
        document.getElementById('preloader')?.classList.add('hidden');
    });

    // ===== SCROLL & NAVBAR =====
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backTop = document.getElementById('back-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        
        if(scrollProgress) scrollProgress.style.width = `${(scrollY / height) * 100}%`;
        if(navbar) navbar.classList.toggle('scrolled', scrollY > 50);
        if(backTop) backTop.classList.toggle('visible', scrollY > 400);
        
        document.querySelectorAll('.fade-in-scroll').forEach(el => {
            if(el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('active');
            }
        });

        document.querySelectorAll('.progress').forEach(bar => {
            if(bar.getBoundingClientRect().top < window.innerHeight) {
                bar.style.width = bar.dataset.width;
            }
        });
    });

    if(backTop) backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

    // ===== MENÚ MÓVIL =====
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if(navToggle && navMenu) {
        navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });
    }

    // ===== CARRUSEL =====
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides[currentSlide]?.classList.remove('active');
        dots[currentSlide]?.classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide]?.classList.add('active');
        dots[currentSlide]?.classList.add('active');
    }

    function startAutoSlide() { 
        slideInterval = setInterval(() => showSlide(currentSlide + 1), 4500); 
    }
    
    function resetAutoSlide() { 
        clearInterval(slideInterval); 
        startAutoSlide(); 
    }

    if(nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); resetAutoSlide(); });
    if(prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); resetAutoSlide(); });
    
    dots.forEach(dot => {
        dot?.addEventListener('click', () => { 
            showSlide(parseInt(dot.dataset.index)); 
            resetAutoSlide(); 
        });
    });
    
    startAutoSlide();

    // ===== CONTADORES ESTADÍSTICAS =====
    const counters = document.querySelectorAll('.stat-num');
    const observerStats = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                const target = +entry.target.dataset.target;
                let count = 0;
                const inc = target / 60;
                
                function update() { 
                    count += inc; 
                    if(count < target) { 
                        entry.target.textContent = Math.floor(count).toLocaleString(); 
                        requestAnimationFrame(update); 
                    } else { 
                        entry.target.textContent = target.toLocaleString(); 
                    } 
                }
                update();
            }
        });
    }, {threshold: 0.5});
    
    counters.forEach(c => observerStats.observe(c));

    // ===== BLOG MODAL =====
    const blogModal = document.getElementById('blog-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const blogData = {
        1: { 
            t: "Amina: Micro-redes solares en aldeas (Kenia) 🇰🇪", 
            c: "<p><strong>Amina Juma, 16 años</strong>, lideró un equipo escolar para construir micro-redes solares descentralizadas en 4 aldeas rurales de Nairobi. Usando paneles reciclados y baterías de litio de segunda vida, logró que +300 niños pudieran estudiar de noche y que una clínica local refrigerara vacunas.</p><p><strong>Impacto:</strong> Reconocimiento del PNUD 2024 y expansión a 3 distritos más. El proyecto fue replicado por otras 5 escuelas de la región.</p><p><strong>ODS 7 Meta:</strong> 7.1 - Acceso universal a servicios energéticos modernos.</p>" 
        },
        2: { 
            t: "Rohan: Biogás escolar para cocinar (India) 🇮🇳", 
            c: "<p><strong>Rohan Mehta, 17 años</strong>, y su club de ciencias diseñaron biodigestores portátiles usando plástico reciclado. Capturan metano de residuos agrícolas para cocinar de forma limpia.</p><p><strong>Impacto:</strong> Reemplazaron leña en 40 hogares, reduciendo un 70% las enfermedades respiratorias infantiles. Ahorro promedio de $15 USD/mes por familia en combustible.</p><p><strong>ODS 7 Meta:</strong> 7.1 y 7.2 - Energía limpia y acceso universal.</p>" 
        },
        3: { 
            t: "Sofía: Eólica para el pueblo Wayúu (Colombia) 🇨🇴", 
            c: "<p><strong>Sofía Torres, 16 años</strong>, investigando el potencial eólico de La Guajira, creó turbinas verticales con materiales locales y chatarra tecnológica. Diseño de bajo costo y fácil mantenimiento.</p><p><strong>Impacto:</strong> 8 rancherías indígenas ahora tienen electricidad para bombear agua y cargar radios comunitarias. Proyecto avalado por el gobierno departamental y en proceso de escalado.</p><p><strong>ODS 7 Meta:</strong> 7.b - Tecnología para servicios energéticos en países en desarrollo.</p>" 
        },
        4: { 
            t: "Lukas: Techos solares en escuelas (Alemania) 🇩🇪", 
            c: "<p><strong>Lukas Schmidt, 17 años</strong>, organizó una campaña digital y presión estudiantil en el parlamento local. Logró que el municipio de Berlín destinara fondos para instalar paneles en 15 colegios públicos.</p><p><strong>Impacto:</strong> Reducción de 200t CO₂/año y creación de un 'club de eficiencia energética' donde los alumnos monitorean el consumo en tiempo real. Ahorro de €12,000 anuales en electricidad.</p><p><strong>ODS 7 Meta:</strong> 7.3 - Duplicar la eficiencia energética.</p>" 
        },
        5: { 
            t: "Mariana: Hidroeléctrica comunitaria (Brasil) 🇧🇷", 
            c: "<p><strong>Mariana Silva, 17 años</strong>, desarrolló una micro-turbina de bajo costo que funciona con corrientes suaves de ríos amazónicos, evitando represas grandes que dañan ecosistemas.</p><p><strong>Impacto:</strong> Electrificación de 3 comunidades ribereñas sin deforestar ni alterar ecosistemas. Ganó el Premio Juvenil ONU Medio Ambiente 2025. Modelo replicable en toda la Amazonía.</p><p><strong>ODS 7 Meta:</strong> 7.2 - Aumentar la proporción de energías renovables.</p>" 
        }
    };

    document.querySelectorAll('.blog-btn').forEach(btn => {
        btn?.addEventListener('click', () => {
            const card = btn.closest('.blog-card');
            const id = card?.dataset.blog;
            if(id && blogData[id] && blogModal) {
                modalTitle.textContent = blogData[id].t;
                modalBody.innerHTML = blogData[id].c;
                blogModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if(closeModal) {
        closeModal.addEventListener('click', () => { 
            blogModal?.classList.remove('active'); 
            document.body.style.overflow = ''; 
        });
    }
    
    if(blogModal) {
        blogModal.addEventListener('click', e => {
            if(e.target === blogModal) {
                blogModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== CANVA EMBED: FALLBACK LOGIC =====
    const canvaIframe = document.querySelector('.canva-iframe');
    const canvaFallback = document.querySelector('.canva-fallback');
    
    if(canvaIframe && canvaFallback) {
        // Mostrar fallback por defecto (más seguro)
        canvaFallback.style.display = 'block';
        
        // Intentar cargar el iframe
        let loadTimeout = setTimeout(() => {
            canvaFallback.style.display = 'block';
        }, 6000);
        
        canvaIframe.addEventListener('load', () => {
            clearTimeout(loadTimeout);
            // Si carga correctamente, ocultar fallback
            canvaFallback.style.display = 'none';
        });
        
        canvaIframe.addEventListener('error', () => {
            clearTimeout(loadTimeout);
            canvaFallback.style.display = 'block';
        });
    }

    // ===== TECLAS PARA CERRAR MODAL =====
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && blogModal?.classList.contains('active')) {
            blogModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});