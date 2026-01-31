// -----------------------
// Hamburger Menu Logic
// -----------------------
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

// -----------------------
// Global Utilities
// -----------------------
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// -----------------------
// Particle System (Optional)
// -----------------------
(function initGlobalParticles() {
    const container = document.getElementById('particle-container');
    if (!container || typeof THREE === 'undefined') return;

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
            particles.rotation.y += 0.0005;
            particles.rotation.x += 0.0005;
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

// -----------------------
// Global Image Error Handler
// -----------------------
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.error('Image failed to load:', this.src);
            if (!this.src.includes('placehold.co')) {
                this.src = 'https://placehold.co/150x150?text=Image+N/A';
                this.alt = 'Image not available';
            }
        });
    });
});

// -----------------------
// Food Card 3D Viewers (Food Page)
// -----------------------
document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('.model-view');
    if (containers.length === 0 || typeof THREE === 'undefined' || typeof THREE.FBXLoader === 'undefined') return;

    containers.forEach((container) => {
        const modelPath = container.getAttribute('data-model');
        if (!modelPath) return;

        const scene = new THREE.Scene();
        const width = container.clientWidth;
        const height = container.clientHeight;
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        renderer.domElement.style.pointerEvents = 'none';

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(3, 5, 4);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const viewer = { scene, camera, renderer, model: null, container };

        const loader = new THREE.FBXLoader();
        loader.load(modelPath, function(object) {
            object.scale.setScalar(0.025);
            object.rotation.x = Math.PI * 40 / 180;
            object.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        const mats = Array.isArray(child.material) ? child.material : [child.material];
                        mats.forEach(mat => {
                            if (mat.map) { mat.map.flipY = true; mat.map.needsUpdate = true; }
                            if (mat.normalMap) { mat.normalMap.flipY = true; mat.normalMap.needsUpdate = true; }
                            if (mat.roughnessMap) { mat.roughnessMap.flipY = true; mat.roughnessMap.needsUpdate = true; }
                            mat.needsUpdate = true;
                        });
                    }
                }
            });
            scene.add(object);
            viewer.model = object;
        }, undefined, function(error) {
            console.error('FBX Load Failed:', modelPath, error);
        });

        function animate() {
            requestAnimationFrame(animate);
            if (viewer.model) {
                viewer.model.rotation.y += 0.01;
            }
            renderer.render(scene, camera);
        }
        animate();

        function onResize() {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        window.addEventListener('resize', onResize);
    });
});

