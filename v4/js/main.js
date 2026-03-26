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
function escapeSvgText(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function createPlaceholderImage(title, subtitle, accentColor) {
    const safeTitle = escapeSvgText(title);
    const safeSubtitle = escapeSvgText(subtitle);
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#111111" />
                    <stop offset="100%" stop-color="${accentColor}" />
                </linearGradient>
            </defs>
            <rect width="1200" height="800" fill="url(#bg)" />
            <rect x="70" y="70" width="1060" height="660" rx="30" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" />
            <text x="90" y="170" fill="rgba(255,255,255,0.55)" font-size="34" font-family="Arial, sans-serif" letter-spacing="8">FOOD ICH</text>
            <text x="90" y="340" fill="#ffffff" font-size="74" font-family="Georgia, serif">${safeSubtitle}</text>
            <text x="90" y="430" fill="rgba(255,255,255,0.88)" font-size="48" font-family="Arial, sans-serif">${safeTitle}</text>
            <text x="90" y="560" fill="rgba(255,255,255,0.62)" font-size="28" font-family="Arial, sans-serif">CONTENT PLACEHOLDER</text>
            <text x="90" y="610" fill="rgba(255,255,255,0.62)" font-size="28" font-family="Arial, sans-serif">Replace coverImage and mediaItems in main.js</text>
        </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createPlaceholderDish({
    number,
    title,
    subtitle,
    location,
    accentColor,
    origin,
    style,
    pledges,
    description
}) {
    const coverImage = createPlaceholderImage(title, subtitle, accentColor);

    return {
        number,
        title,
        subtitle,
        location,
        coverImage,
        info: [
            { label: 'Origin', value: origin },
            { label: 'Style', value: style },
            { label: 'Pledges', value: pledges, large: true }
        ],
        description,
        mediaItems: [
            { type: 'image', src: coverImage, alt: `${subtitle} Cover` },
            { type: 'image', src: createPlaceholderImage(`${title} 影像 01`, subtitle, accentColor), alt: `${subtitle} Placeholder 1` },
            { type: 'image', src: createPlaceholderImage(`${title} 影像 02`, subtitle, accentColor), alt: `${subtitle} Placeholder 2` }
        ]
    };
}

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
    },
    'healthy-ribs': createPlaceholderDish({
        number: '(04)',
        title: '碳烤羊排',
        subtitle: 'Charcoal Grilled Lamb Chops',
        location: 'Charcoal Grill · China',
        accentColor: '#6d8a57',
        origin: '炭火烤製',
        style: 'Traditional Grilled Dish',
        pledges: '待補充',
        description: [
            '碳烤羊排是以羊排為主料的傳統烤製菜品，通常先以椒鹽等調料腌製，再置於木炭明火上雙面烤製。炭火的直接加熱能帶出外焦裏嫩的口感，也讓羊排同時具有香料氣息與濃郁的炭火香。',
            '製作過程中，常會撒上辣椒粉、孜然粉等調味料，烤至表面焦黃後再刷上蜂蜜增添光澤與層次。成菜可搭配葱絲、香菜、檸檬片或主食一同食用，既保留豪邁的烤製風味，也兼具細膩的口感變化。',
            'Charcoal Grilled Lamb Chops is a traditional grilled dish centered on lamb ribs. Seasoned and cooked over open charcoal, it is prized for its crisp exterior, juicy interior, and the layered aroma of spices and live fire.'
        ]
    }),
    'spicy-ribs': createPlaceholderDish({
        number: '(05)',
        title: '瀏陽蒸排骨',
        subtitle: 'Liuyang Steamed Pork Ribs',
        location: 'Liuyang · Hunan',
        accentColor: '#a43f2f',
        origin: '湖南瀏陽',
        style: 'Hunan Steamed Dish',
        pledges: '待補充',
        description: [
            '瀏陽蒸排骨是湘菜蒸制類中的代表菜品之一，常以小排骨為主料，搭配瀏陽豆豉醬與豆腐同蒸。這道菜的特色在於豆豉經發酵後的濃郁香氣，能與排骨的鮮嫩口感融合，形成醇厚而有層次的地方風味。',
            '製作時，排骨通常需先腌製，再拌入豆豉醬後鋪放於豆腐之上進行蒸製。成菜後盤底湯汁濃香，下飯感很強，最後撒上的葱花也能進一步提鮮增香，讓整道菜在氣味、口感和視覺上都更完整。',
            'Liuyang Steamed Pork Ribs is a representative Hunan steamed dish. It is known for combining tender pork ribs with the fermented aroma of Liuyang douchi sauce, creating a rich, savory flavor with strong regional character.'
        ]
    }),
    'preserved-veg-pork': createPlaceholderDish({
        number: '(06)',
        title: '梅菜燒肉',
        subtitle: 'Braised Pork with Preserved Vegetables',
        location: 'Hakka · Huizhou',
        accentColor: '#8a5a44',
        origin: '客家地區 · 惠州',
        style: 'Hakka Braised Pork Dish',
        pledges: '待補充',
        description: [
            '梅菜燒肉歷史悠久，與客家飲食文化關係密切，其淵源可追溯至宋代，後來隨著梅菜與五花肉的搭配逐漸定型，演變出具有代表性的客家風味。這道菜不僅是一道家常名菜，也承載著團圓、宴席與節慶的文化意涵。',
            '製作時多選用帶皮五花肉與梅乾菜，梅菜需提前浸泡去鹽，五花肉則經汆煮、上色、燒製等步驟，讓肉香與梅菜鹹香相互滲透。成菜通常色澤紅亮、口感軟糯，梅菜吸收肉汁後更顯醇厚，是許多家庭記憶中的「壓軸菜」。',
            'Braised Pork with Preserved Vegetables is closely tied to Hakka culinary tradition. Combining preserved mustard greens with pork belly, it is valued not only for its rich, savory flavor and tender texture, but also for its strong associations with family banquets and festive gatherings.'
        ]
    }),
    'vermicelli-shrimp': createPlaceholderDish({
        number: '(07)',
        title: '蒜蓉粉絲蝦煲',
        subtitle: 'Garlic Vermicelli Shrimp Pot',
        location: 'Claypot Seafood · China',
        accentColor: '#4d6f86',
        origin: '鮮蝦與粉絲煲製',
        style: 'Garlic Claypot Seafood Dish',
        pledges: '待補充',
        description: [
            '蒜蓉粉絲蝦煲常以鮮蝦、粉絲為主料，搭配蒜末、薑片、豆豉、小葱等輔料製作。這道菜的魅力在於蝦仁鮮嫩彈牙，而粉絲則能充分吸收蒜香與醬汁，入口滑潤又飽滿，呈現出鮮香濃郁的砂鍋風味。',
            '常見做法是先將粉絲泡軟，蝦仁經簡單腌製去腥增味，再將蒜蓉與調味料炒香後與粉絲、蝦仁一同煲煮或焖製。火候控制很重要，既要讓粉絲吸飽湯汁，也要避免蝦肉久煮變老，這樣才能保留層次分明的口感。',
            'Garlic Vermicelli Shrimp Pot is built around tender shrimp and vermicelli cooked with garlic-rich sauce in a claypot. Its appeal comes from the contrast between juicy shrimp and noodles that fully absorb the savory broth, creating a dish that is both aromatic and deeply comforting.'
        ]
    })
};

// ===========================
// DISH PREVIEW MODAL (附件1效果)
// ===========================
let previewScene, previewCamera, previewRenderer, previewModel;
let previewAnimId;
let currentPreviewDishId = null;

function openDishModal(dishId) {
    const dish = dishData[dishId];
    if (!dish) return;

    currentPreviewDishId = dishId;
    const modal = document.getElementById('dishPreviewModal');
    if (!modal) return;

    // 填充右侧信息
    document.getElementById('previewNumber').textContent = dish.number;
    document.getElementById('previewTitleEn').textContent = dish.subtitle;
    document.getElementById('previewTitleZh').textContent = dish.title;
    document.getElementById('previewLocation').textContent = dish.location;
    const modelLabel = document.getElementById('previewModelLabel');
    if (modelLabel) modelLabel.textContent = dish.subtitle;

    // 主图
    const img = document.getElementById('previewMainImage');
    img.src = dish.coverImage;
    img.alt = dish.title;

    // 信息列表
    const infoList = document.getElementById('previewInfoList');
    infoList.innerHTML = dish.info.map(item => `
        <div class="preview-info-item">
            <span class="preview-info-label">${item.label}</span>
            <span class="preview-info-value">${item.value}</span>
        </div>
    `).join('');

    // 简介
    document.getElementById('previewDescShort').textContent = dish.description[0];

    // 进入按钮
    const enterBtn = document.getElementById('previewEnterBtn');
    enterBtn.onclick = function() {
        enterDishDetail(dishId);
    };

    // 左侧：启动迷你3D预览
    startPreviewScene(dishId);

    // 显示弹窗
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDishModal() {
    const modal = document.getElementById('dishPreviewModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
    stopPreviewScene();
    currentPreviewDishId = null;
}

function enterDishDetail(dishId) {
    closeDishModal();
    // 跳转到详情页，带上dishId参数
    window.location.href = `food-detail.html?dish=${dishId}`;
}

// 左侧迷你3D场景：从主场景中克隆对应模型并单独渲染
function startPreviewScene() {
    const stage = document.getElementById('previewModelStage');
    if (!stage) return;

    // 清理旧场景
    stopPreviewScene();

    // 创建独立渲染器
    previewScene = new THREE.Scene();
    previewScene.fog = new THREE.Fog(0x080706, 30, 120);

    previewCamera = new THREE.PerspectiveCamera(60, stage.clientWidth / stage.clientHeight, 0.1, 500);
    previewCamera.position.set(0, 5, 30);

    previewRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    previewRenderer.setSize(stage.clientWidth || 600, stage.clientHeight || window.innerHeight);
    previewRenderer.setClearColor(0x000000, 0);
    previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    previewRenderer.domElement.classList.add('preview-model-canvas');
    stage.appendChild(previewRenderer.domElement);

    // 灯光
    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    previewScene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 2);
    dir.position.set(20, 30, 20);
    previewScene.add(dir);
    const pt1 = new THREE.PointLight(0x4a90d9, 1.5, 80);
    pt1.position.set(-15, 10, 15);
    previewScene.add(pt1);
    const pt2 = new THREE.PointLight(0xff9ff3, 0.8, 60);
    pt2.position.set(15, -10, 10);
    previewScene.add(pt2);

    // 找到对应的主场景模型并克隆
    const sourceModel = typeof fbxModels !== 'undefined'
        ? fbxModels.find(model => model && model.userData && model.userData.dishId === currentPreviewDishId)
        : null;

    if (sourceModel) {
        const cloned = sourceModel.clone();
        cloned.position.set(0, 0, 0);
        cloned.scale.setScalar(0.12);
        previewScene.add(cloned);
        previewModel = cloned;
    }

    // 粒子
    const pCount = 300;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);
    const pColors = [0xff6b6b, 0x4a90d9, 0xfeca57, 0x94ed5c, 0xff9ff3];
    for (let i = 0; i < pCount; i++) {
        pPos[i*3]   = (Math.random()-0.5)*80;
        pPos[i*3+1] = (Math.random()-0.5)*80;
        pPos[i*3+2] = (Math.random()-0.5)*80;
        const c = new THREE.Color(pColors[Math.floor(Math.random()*pColors.length)]);
        pCol[i*3]=c.r; pCol[i*3+1]=c.g; pCol[i*3+2]=c.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol,3));
    const pMat = new THREE.PointsMaterial({ size:1.2, vertexColors:true, transparent:true, opacity:0.5 });
    previewScene.add(new THREE.Points(pGeo, pMat));

    // 动画
    let t = 0;
    function animPreview() {
        previewAnimId = requestAnimationFrame(animPreview);
        t += 0.01;
        if (previewModel) {
            previewModel.rotation.y += 0.008;
            previewModel.position.y = Math.sin(t * 0.8) * 2;
        }
        previewRenderer.render(previewScene, previewCamera);
    }
    animPreview();
}

function stopPreviewScene() {
    if (previewAnimId) {
        cancelAnimationFrame(previewAnimId);
        previewAnimId = null;
    }
    const stage = document.getElementById('previewModelStage');
    if (stage && previewRenderer) {
        const canvas = stage.querySelector('canvas');
        if (canvas) canvas.remove();
    }
    previewModel = null;
    previewScene = null;
    previewCamera = null;
    previewRenderer = null;
}

// 关闭按钮
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('previewCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeDishModal);

    const modal = document.getElementById('dishPreviewModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeDishModal();
        });
    }
});

// Escape 关闭
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDishModal();
});

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
