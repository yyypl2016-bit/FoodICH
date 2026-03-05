// ===========================
// FOOD DETAIL PAGE
// 可拖动浮动窗口系统
// ===========================

// 从 URL 获取 dishId
function getDishIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('dish') || 'claypot';
}

// 窗口初始布局配置（随机散落感）
const windowLayouts = {
    'win-cover':   { x: 40,  y: 60,  w: 380, zIndex: 10 },
    'win-video':   { x: 160, y: 30,  w: 460, zIndex: 12 },
    'win-desc':    { x: 520, y: 120, w: 340, zIndex: 8  },
    'win-gallery': { x: 300, y: 300, w: 360, zIndex: 9  },
    'win-info':    { x: 60,  y: 340, w: 260, zIndex: 11 },
    'win-title':   { x: 560, y: 320, w: 220, zIndex: 13 }
};

// 响应式偏移：在小屏上重新布局
function getResponsiveLayout() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw < 900) {
        return {
            'win-title':   { x: vw*0.05, y: 70,       w: Math.min(200, vw*0.4), zIndex: 13 },
            'win-cover':   { x: vw*0.05, y: 180,       w: Math.min(280, vw*0.5), zIndex: 10 },
            'win-video':   { x: vw*0.35, y: 100,       w: Math.min(320, vw*0.55), zIndex: 12 },
            'win-desc':    { x: vw*0.05, y: vh*0.5,    w: Math.min(300, vw*0.55), zIndex: 8  },
            'win-gallery': { x: vw*0.45, y: vh*0.45,   w: Math.min(280, vw*0.5), zIndex: 9  },
            'win-info':    { x: vw*0.05, y: vh*0.75,   w: Math.min(240, vw*0.45), zIndex: 11 }
        };
    }

    // 大屏：基于视口宽度计算
    const scale = Math.min(vw / 1440, 1);
    return {
        'win-cover':   { x: vw*0.03,  y: vh*0.08,  w: Math.round(380*scale), zIndex: 10 },
        'win-video':   { x: vw*0.25,  y: vh*0.04,  w: Math.round(460*scale), zIndex: 12 },
        'win-desc':    { x: vw*0.62,  y: vh*0.14,  w: Math.round(340*scale), zIndex: 8  },
        'win-gallery': { x: vw*0.38,  y: vh*0.48,  w: Math.round(360*scale), zIndex: 9  },
        'win-info':    { x: vw*0.04,  y: vh*0.52,  w: Math.round(260*scale), zIndex: 11 },
        'win-title':   { x: vw*0.68,  y: vh*0.52,  w: Math.round(220*scale), zIndex: 13 }
    };
}

// 已关闭/最小化的窗口记录
const windowStates = {};
let topZIndex = 20;

// ===========================
// 初始化详情页
// ===========================
document.addEventListener('DOMContentLoaded', function () {
    const dishId = getDishIdFromURL();
    const dish = typeof dishData !== 'undefined' ? dishData[dishId] : null;

    if (!dish) {
        document.body.innerHTML = '<div style="color:#fff;padding:40px;font-family:sans-serif">Dish not found. <a href="index.html" style="color:#4a90d9">Go back</a></div>';
        return;
    }

    // 填充桌面背景标题
    const desktopLabel = document.getElementById('desktopLabel');
    if (desktopLabel) desktopLabel.textContent = dish.subtitle.toUpperCase();

    // 填充各窗口内容
    populateWindows(dish);

    // 设置初始布局
    applyLayout();

    // 绑定拖拽
    initDraggable();

    // 初始化任务栏
    updateTaskbar();

    // 图片灯箱
    initLightbox();

    // 窗口点击置顶
    document.querySelectorAll('.float-window').forEach(win => {
        win.addEventListener('mousedown', () => bringToFront(win.id));
    });
});

// ===========================
// 填充窗口内容
// ===========================
function populateWindows(dish) {
    // 标题卡
    setEl('titleCardNumber', dish.number);
    setEl('titleCardZh', dish.title);
    setEl('titleCardEn', dish.subtitle);
    setEl('titleCardLocation', dish.location);

    // 封面图
    const coverImg = document.getElementById('winCoverImg');
    if (coverImg) {
        coverImg.src = dish.coverImage;
        coverImg.alt = dish.title;
    }
    setEl('winCoverTitle', `${dish.subtitle} ${dish.title} - Cover`);

    // 视频
    const videoItems = dish.mediaItems.filter(m => m.type === 'video');
    const videoSrc = document.getElementById('winVideoSrc');
    const videoEl = document.getElementById('winVideo');
    if (videoItems.length > 0 && videoSrc && videoEl) {
        videoSrc.src = videoItems[0].src;
        videoEl.load();
        setEl('winVideoTitle', `${dish.subtitle} ${dish.title} - Interview 訪問`);
    } else {
        // 没有视频则隐藏视频窗口
        const winVideo = document.getElementById('win-video');
        if (winVideo) winVideo.style.display = 'none';
    }

    // 描述
    const descContent = document.getElementById('winDescContent');
    if (descContent) {
        descContent.innerHTML = `
            <h3>${dish.title} — ${dish.subtitle}</h3>
            ${dish.description.map(p => `<p>${p}</p>`).join('')}
        `;
    }

    // 图片集
    const galleryGrid = document.getElementById('winGalleryGrid');
    if (galleryGrid) {
        const imageItems = dish.mediaItems.filter(m => m.type === 'image');
        galleryGrid.innerHTML = imageItems.map(item =>
            `<img src="${item.src}" alt="${item.alt}" data-lightbox="${item.src}" />`
        ).join('');
    }

    // 信息卡
    const infoCard = document.getElementById('winInfoCard');
    if (infoCard) {
        infoCard.innerHTML = `
            <div class="info-row">
                <span class="info-row-label">中文名</span>
                <span class="info-row-value">${dish.title}</span>
            </div>
            <div class="info-row">
                <span class="info-row-label">English</span>
                <span class="info-row-value">${dish.subtitle}</span>
            </div>
            <div class="info-row">
                <span class="info-row-label">Origin</span>
                <span class="info-row-value">${dish.location}</span>
            </div>
            ${dish.info.map(item => `
                <div class="info-row">
                    <span class="info-row-label">${item.label}</span>
                    <span class="info-row-value ${item.large ? 'large' : ''}">${item.value}</span>
                </div>
            `).join('')}
        `;
    }
}

function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// ===========================
// 布局应用
// ===========================
function applyLayout() {
    const layout = getResponsiveLayout();
    Object.entries(layout).forEach(([id, pos]) => {
        const win = document.getElementById(id);
        if (!win) return;
        win.style.left = pos.x + 'px';
        win.style.top  = pos.y + 'px';
        win.style.width = pos.w + 'px';
        win.style.zIndex = pos.zIndex;
        windowStates[id] = { visible: true, minimized: false };
    });
}

// ===========================
// 拖拽系统
// ===========================
function initDraggable() {
    document.querySelectorAll('.float-window').forEach(win => {
        const titlebar = win.querySelector('.win-titlebar');
        if (!titlebar) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        titlebar.addEventListener('mousedown', dragStart);
        titlebar.addEventListener('touchstart', dragStart, { passive: false });

        function dragStart(e) {
            // 不拦截圆点按钮点击
            if (e.target.classList.contains('dot')) return;

            isDragging = true;
            bringToFront(win.id);
            win.classList.add('is-dragging');

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            startX = clientX;
            startY = clientY;
            startLeft = parseInt(win.style.left) || 0;
            startTop  = parseInt(win.style.top)  || 0;

            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup',   dragEnd);
            document.addEventListener('touchmove', dragMove, { passive: false });
            document.addEventListener('touchend',  dragEnd);

            e.preventDefault();
        }

        function dragMove(e) {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const dx = clientX - startX;
            const dy = clientY - startY;

            let newLeft = startLeft + dx;
            let newTop  = startTop  + dy;

            // 边界限制
            const winW = win.offsetWidth;
            const winH = win.offsetHeight;
            newLeft = Math.max(-winW * 0.5, Math.min(window.innerWidth  - winW * 0.5, newLeft));
            newTop  = Math.max(0,            Math.min(window.innerHeight - 40,         newTop));

            win.style.left = newLeft + 'px';
            win.style.top  = newTop  + 'px';

            e.preventDefault();
        }

        function dragEnd() {
            isDragging = false;
            win.classList.remove('is-dragging');
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup',   dragEnd);
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('touchend',  dragEnd);
        }
    });
}

// 置顶窗口
function bringToFront(winId) {
    topZIndex++;
    const win = document.getElementById(winId);
    if (win) win.style.zIndex = topZIndex;
}

// ===========================
// 关闭 / 最小化窗口
// ===========================
function closeWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    win.style.display = 'none';
    windowStates[winId] = { visible: false, minimized: false };
    updateTaskbar();
}

function minimizeWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    win.classList.toggle('minimized');
    const isMin = win.classList.contains('minimized');
    windowStates[winId] = { visible: true, minimized: isMin };
    updateTaskbar();
}

function restoreWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    win.style.display = '';
    win.classList.remove('minimized');
    windowStates[winId] = { visible: true, minimized: false };
    bringToFront(winId);
    updateTaskbar();
}

// ===========================
// 任务栏
// ===========================
const winNames = {
    'win-cover':   'Cover',
    'win-video':   'Video',
    'win-desc':    'Description',
    'win-gallery': 'Gallery',
    'win-info':    'Info',
    'win-title':   'Title'
};

function updateTaskbar() {
    const taskbarItems = document.getElementById('taskbarItems');
    if (!taskbarItems) return;

    const hiddenOrMin = Object.entries(windowStates).filter(([id, state]) =>
        !state.visible || state.minimized
    );

    taskbarItems.innerHTML = hiddenOrMin.map(([id]) => `
        <button class="taskbar-item" onclick="restoreWindow('${id}')">
            ${winNames[id] || id}
        </button>
    `).join('');

    // 任务栏有内容时显示
    const taskbar = document.getElementById('detailTaskbar');
    if (taskbar) {
        taskbar.style.display = hiddenOrMin.length > 0 ? 'flex' : 'none';
    }
}

// ===========================
// 图片灯箱
// ===========================
function initLightbox() {
    // 创建灯箱元素
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.id = 'lightboxOverlay';
    lightbox.innerHTML = '<img id="lightboxImg" src="" alt="" />';
    document.body.appendChild(lightbox);

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // 绑定图片点击
    document.addEventListener('click', function(e) {
        if (e.target.dataset.lightbox) {
            const img = document.getElementById('lightboxImg');
            if (img) img.src = e.target.dataset.lightbox;
            lightbox.classList.add('active');
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        }
    });
}

// ===========================
// 窗口大小变化时重新布局
// ===========================
window.addEventListener('resize', debounce(function() {
    applyLayout();
    if (typeof window.resizeParticleCanvas === 'function') {
        window.resizeParticleCanvas();
    }
}, 300));

function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// ===========================
// 粒子背景系统（与首页一致）
// ===========================
(function initDetailParticles() {
    const canvas = document.getElementById('detail-particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 与首页相同的彩色粒子色板
    const palette = [
        [255, 107, 107],  // accent-red
        [255, 46,  143],  // pink
        [255, 144, 33],   // orange
        [148, 237, 92],   // green
        [254, 202, 87],   // gold
        [255, 159, 243],  // purple-pink
        [186, 234, 169],  // light-green
        [74,  144, 217],  // blue
    ];

    let W, H;
    let particles = [];
    let animId;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    // 暴露给 resize 监听器
    window.resizeParticleCanvas = resize;

    function createParticles() {
        particles = [];
        const count = Math.floor((W * H) / 6000); // 密度自适应
        for (let i = 0; i < count; i++) {
            const col = palette[Math.floor(Math.random() * palette.length)];
            particles.push({
                x:    Math.random() * W,
                y:    Math.random() * H,
                r:    Math.random() * 1.8 + 0.4,
                vx:   (Math.random() - 0.5) * 0.35,
                vy:   (Math.random() - 0.5) * 0.35,
                col:  col,
                a:    Math.random() * 0.5 + 0.15,   // 透明度
                pulse: Math.random() * Math.PI * 2,  // 闪烁相位
                pulseSpeed: Math.random() * 0.02 + 0.005
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach(p => {
            // 缓慢闪烁
            p.pulse += p.pulseSpeed;
            const alpha = p.a + Math.sin(p.pulse) * 0.12;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${alpha})`;
            ctx.fill();

            // 移动
            p.x += p.vx;
            p.y += p.vy;

            // 边界环绕
            if (p.x < -5)  p.x = W + 5;
            if (p.x > W+5) p.x = -5;
            if (p.y < -5)  p.y = H + 5;
            if (p.y > H+5) p.y = -5;
        });

        animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();
})();
