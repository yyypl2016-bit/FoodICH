// ===========================
// NAVIGATION MENU
// ===========================
function toggleMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menuDropdown = document.getElementById('menuDropdown');

    if (!hamburgerBtn || !menuDropdown) return;

    hamburgerBtn.classList.toggle('active');
    menuDropdown.classList.toggle('show');
}

// Close menu when clicking outside
document.addEventListener('click', function (event) {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menuDropdown = document.getElementById('menuDropdown');
    const hamburgerBtn = document.querySelector('.hamburger-btn');

    if (hamburgerMenu && !hamburgerMenu.contains(event.target)) {
        if (menuDropdown) menuDropdown.classList.remove('show');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    }
});

// Prevent closing when clicking inside the menu
const menuEl = document.querySelector('.hamburger-menu');
if (menuEl) {
    menuEl.addEventListener('click', function (event) {
        event.stopPropagation();
    });
}

// ===========================
// GLOBAL UTILITIES
// ===========================
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// ===========================
// PARTICLE SYSTEM (Colorful Theme)
// ===========================
(function initGlobalParticles() {
    const container = document.getElementById('particle-container');
    if (!container || typeof THREE === 'undefined') return;

    // Colorful particle colors matching v2
    const particleColors = [0xff6b6b, 0xff2e8f, 0xff9021, 0x94ed5c, 0xfeca57, 0xff9ff3, 0xbaeaa9];
    let scene, camera, renderer, particles;

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        addParticles();
        animateParticles();

        window.addEventListener('resize', onWindowResize, false);
    }

    function addParticles() {
        const particleCount = 500;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            const color = new THREE.Color(particleColors[Math.floor(Math.random() * particleColors.length)]);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.7
        });

        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        if (particles) {
            particles.rotation.y += 0.0002;
            particles.rotation.x += 0.0001;
        }
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    init();
})();

// ===========================
// DISH DATA
// ===========================
const dishData = {
    'claypot': {
        number: '(01)',
        title: '煲仔飯',
        subtitle: 'Clay Pot Rice',
        location: 'Guangdong · Hong Kong',
        coverImage: '../food/claypot-rice/a (3).png',
        info: [
            { label: 'Origin', value: '廣東省 · 香港' },
            { label: 'Era', value: 'Ming & Qing Dynasty' },
            { label: 'Pledges', value: '9/100', large: true }
        ],
        description: [
            '煲仔飯的起源可以追溯到中國南方的農村地區。早在明清時期，廣東、福建等地的農民在勞動之餘，會將米、菜、肉等食材放入瓦煲中，用慢火燉煮，製成美味煲仔飯。',
            '我們邀請到了嚐囍煲仔小菜的康哥，分享了他對煲仔飯的見解以及如何使用AI進行記錄變化與創新的過程。',
            'The origins of clay pot rice can be traced back to rural areas in southern China. As early as during the Ming and Qing dynasties, farmers in Guangdong and Fujian provinces would place rice, vegetables, and meat into a clay pot and slowly simmer them over low heat.'
        ],
        mediaItems: [
            { type: 'image', src: '../food/claypot-rice/a (3).png', alt: 'Clay Pot Rice' },
            { type: 'image', src: '../food/claypot-rice/1.png', alt: 'Clay Pot Rice Preparation' },
            { type: 'image', src: '../food/claypot-rice/1 (2).png', alt: 'Cooking Process' },
            { type: 'image', src: '../food/claypot-rice/PressedRice.png', alt: 'Pressed Rice' },
            { type: 'image', src: '../food/claypot-rice/a (1).png', alt: 'Ingredient 1' },
            { type: 'image', src: '../food/claypot-rice/a (2).png', alt: 'Ingredient 2' },
            { type: 'image', src: '../food/claypot-rice/a (4).png', alt: 'Final Dish' },
            { type: 'video', src: '../food/claypot-rice/VID20241112204653.mp4', alt: 'Cooking Video 1' },
            { type: 'video', src: '../food/claypot-rice/VID20241112204313.mp4', alt: 'Cooking Video 2' }
        ]
    },
    'steam-buns': {
        number: '(02)',
        title: '流汁湯包',
        subtitle: 'Steam Buns',
        location: 'Jiangnan · China',
        coverImage: '../food/steamed-buns/1.png',
        info: [
            { label: 'Origin', value: '江南地區' },
            { label: 'Style', value: 'Traditional Dim Sum' },
            { label: 'Pledges', value: '12/100', large: true }
        ],
        description: [
            '「輕輕提，慢慢移，先開窗，後喝湯。」這句順口溜，精準地概括了品嚐流汁湯包的精髓。流汁湯包，一道源自中國江南地區的傳統名點，以其皮薄、餡大、湯多、味鮮的特點，贏得了無數食客的青睞。',
            '我們邀請到了小李（化名），分享了他對流汁湯包的見解以及如何使用AI進行記錄變化與創新的過程。',
            '"Gently lift, move slowly, first open the window, then drink the soup." This catchy phrase accurately summarizes the essence of tasting steam buns.'
        ],
        mediaItems: [
            { type: 'image', src: '../food/steamed-buns/1.png', alt: 'Steam Buns 1' },
            { type: 'image', src: '../food/steamed-buns/2.png', alt: 'Steam Buns 2' },
            { type: 'image', src: '../food/steamed-buns/3.png', alt: 'Steam Buns 3' },
            { type: 'image', src: '../food/steamed-buns/4.png', alt: 'Steam Buns 4' },
            { type: 'image', src: '../food/steamed-buns/5.png', alt: 'Steam Buns 5' },
            { type: 'video', src: '../food/steamed-buns/fen_DJI_0003.mp4', alt: 'Making Process 1' },
            { type: 'video', src: '../food/steamed-buns/ya_DJI_0006.mp4', alt: 'Making Process 2' },
            { type: 'video', src: '../food/steamed-buns/bao_DJI_0044.mp4', alt: 'Wrapping Process' },
            { type: 'video', src: '../food/steamed-buns/steam_DJI_0050.mp4', alt: 'Steaming Process' }
        ]
    },
    'hakka-tofu': {
        number: '(03)',
        title: '客家釀豆腐',
        subtitle: 'Hakka Stuffed Tofu',
        location: 'Hakka · Guangdong',
        coverImage: '../food/hakka-tofu/73baa3575d77c954323cf25f93704f58aecbeb4b.jpg',
        info: [
            { label: 'Origin', value: '客家地區' },
            { label: 'Style', value: 'Hakka Cuisine' },
            { label: 'Pledges', value: '7/100', large: true }
        ],
        description: [
            '客家釀豆腐作為一道極具代表性的客家名菜，承載著深厚的歷史文化內涵，其起源與發展和客家人的遷徙歷程緊密相連。',
            '身為客家人，小李（化名）為我們展示了他們家庭製作客家釀豆腐的過程，並嘗試使用AI記錄了不同的偶然性，及根據AI的提示，創作了一道保留傳統味道的創新菜。',
            'As a representative Hakka dish, Hakka Stuffed Tofu carries profound historical and cultural connotations. Its origin and development are closely linked to the migration of Hakka people.'
        ],
        mediaItems: [
            { type: 'image', src: '../food/hakka-tofu/73baa3575d77c954323cf25f93704f58aecbeb4b.jpg', alt: 'Hakka Tofu' },
            { type: 'image', src: '../food/hakka-tofu/79e1578f883159895015bffe8915e0d0e51d6949.png', alt: 'Hakka Tofu Prepared' },
            { type: 'video', src: '../food/hakka-tofu/VID20241215111124.mp4', alt: 'Cooking Video 1' },
            { type: 'video', src: '../food/hakka-tofu/VID20241215111137.mp4', alt: 'Cooking Video 2' },
            { type: 'video', src: '../food/hakka-tofu/cut_VID20241215110009.mp4', alt: 'Cutting Process' },
            { type: 'video', src: '../food/hakka-tofu/fry_VID20241215111725.mp4', alt: 'Frying Process' }
        ]
    }
};

// ===========================
// NAVIGATE TO DETAIL PAGE
// ===========================
function enterDishDetail(dishId) {
    window.location.href = `food-detail.html?dish=${dishId}`;
}

// ===========================
// IMAGE ERROR HANDLER
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.error('Image failed to load:', this.src);
            if (!this.src.includes('placehold.co')) {
                this.src = 'https://placehold.co/150x150/2b1d1d/b5a59a?text=N/A';
                this.alt = 'Image not available';
            }
        });
    });
});

// ===========================
// SCROLLABLE CARDS
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const header = card.querySelector('.card-header');
        const toggle = card.querySelector('.card-toggle');

        if (header) {
            header.addEventListener('click', function() {
                const isExpanded = card.classList.contains('expanded');

                cards.forEach(c => {
                    if (c !== card && c.classList.contains('expanded')) {
                        c.classList.remove('expanded');
                    }
                });

                card.classList.toggle('expanded');
            });
        }

        if (toggle) {
            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                const isExpanded = card.classList.contains('expanded');

                cards.forEach(c => {
                    if (c !== card && c.classList.contains('expanded')) {
                        c.classList.remove('expanded');
                    }
                });

                card.classList.toggle('expanded');
            });
        }
    });
});
