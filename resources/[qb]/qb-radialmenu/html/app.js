const app = document.getElementById('app');
const itemsLayer = document.getElementById('items');
const connectorLayer = document.getElementById('connectorLayer');
const center = document.getElementById('center');
const centerTitle = document.getElementById('centerTitle');
const centerHint = document.getElementById('centerHint');

const state = {
    open: false,
    rootItems: [],
    stack: [],
    resourceName: 'qb-radialmenu',
};

const iconPaths = {
    dot: '<circle cx="12" cy="12" r="3"/>',
    user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    car: '<path d="M5 17h14l1-5-3-5H7l-3 5 1 5Z"/><path d="M7 17v2M17 17v2M6 12h12"/>',
    shirt: '<path d="m8 4 4 2 4-2 4 3-3 4v9H7v-9L4 7l4-3Z"/>',
    house: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
    key: '<circle cx="7.5" cy="15.5" r="3.5"/><path d="m10 13 9-9M16 7l2 2M14 9l2 2"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    hands: '<path d="M7 13V5a2 2 0 0 1 4 0v6M11 11V4a2 2 0 0 1 4 0v7M15 11V6a2 2 0 0 1 4 0v8a7 7 0 0 1-7 7h-1a7 7 0 0 1-7-7v-2a2 2 0 0 1 4 0v1"/>',
    point: '<path d="M8 12V6a2 2 0 0 1 4 0v5l7-1a2 2 0 0 1 2 2v1a8 8 0 0 1-8 8h-1a7 7 0 0 1-7-7v-1a2 2 0 0 1 3-1Z"/>',
    person: '<circle cx="12" cy="5" r="3"/><path d="M7 21v-4l2-7h6l2 7v4M9 11l-4 4M15 11l4 4"/>',
    salute: '<circle cx="11" cy="6" r="3"/><path d="M6 21v-5a5 5 0 0 1 10 0v5M14 8l7-3M17 4l4 1"/>',
    refresh: '<path d="M20 6v5h-5M4 18v-5h5"/><path d="M18 9a7 7 0 0 0-12-2L4 11M6 15a7 7 0 0 0 12 2l2-4"/>',
    badge: '<path d="M12 2 7 5H4v6c0 5 3.3 8.4 8 11 4.7-2.6 8-6 8-11V5h-3l-5-3Z"/><path d="m9 12 2 2 4-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M7 6l1 15h8l1-15M10 10v7M14 10v7"/>',
    heart: '<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    medkit: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 6V4h6v2M12 10v6M9 13h6"/>',
    taxi: '<path d="M5 17h14l1-5-3-5H7l-3 5 1 5Z"/><path d="M9 7V4h6v3M7 17v2M17 17v2"/>',
    meter: '<path d="M5 19a8 8 0 1 1 14 0"/><path d="m12 12 4-3M8 19h8"/>',
    play: '<path d="m8 5 11 7-11 7V5Z"/>',
    truck: '<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 9.6 6 7.3 3.7a4 4 0 0 0 5 5L4 17l3 3 8.3-8.3a4 4 0 0 0-.6-5.4Z"/>',
    engine: '<path d="M4 9h3l2-3h6l2 3h3v9h-3l-2 2H8l-2-2H4V9Z"/><path d="M9 11h6v5H9z"/>',
    door: '<path d="M6 3h12v18H6z"/><path d="M10 12h.01"/>',
    window: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16M12 4v16"/>',
    seat: '<path d="M7 3v9h8l3 8M7 12l-2 8M10 8h6a3 3 0 0 1 3 3v2"/>',
    box: '<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
};

function svgIcon(name) {
    const path = iconPaths[name] || iconPaths.dot;
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
}

function post(endpoint, data = {}) {
    const resource = typeof GetParentResourceName === 'function'
        ? GetParentResourceName()
        : state.resourceName;

    return fetch(`https://${resource}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data),
    }).catch(() => null);
}

function applyTheme(theme = {}) {
    const root = document.documentElement;
    if (theme.accent) root.style.setProperty('--accent', theme.accent);
    if (theme.accentSoft) root.style.setProperty('--accent-soft', theme.accentSoft);
    if (theme.panel) root.style.setProperty('--panel', theme.panel);
    if (theme.panelSoft) root.style.setProperty('--panel-soft', theme.panelSoft);
    if (theme.text) root.style.setProperty('--text', theme.text);
    if (theme.muted) root.style.setProperty('--muted', theme.muted);
}

function currentItems() {
    return state.stack.length
        ? state.stack[state.stack.length - 1].items
        : state.rootItems;
}

function currentTitle() {
    return state.stack.length
        ? state.stack[state.stack.length - 1].title
        : 'RADIAL';
}

function setCenter(title, hint) {
    centerTitle.textContent = title || currentTitle();
    centerHint.textContent = hint || (state.stack.length ? 'BACK' : 'MENU');
}

function getRadius(count) {
    if (count <= 4) return 92;
    if (count <= 6) return 112;
    if (count <= 8) return 127;
    return 140;
}

function render() {
    const items = currentItems();
    itemsLayer.innerHTML = '';
    connectorLayer.innerHTML = '';
    setCenter(currentTitle(), state.stack.length ? 'BACK' : 'MENU');

    const count = Math.max(items.length, 1);
    const radius = getRadius(count);
    const start = -90;

    items.forEach((item, index) => {
        const angle = start + (360 / count) * index;
        const rad = angle * Math.PI / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        const connector = document.createElement('span');
        connector.className = 'connector';
        connector.style.width = `${Math.max(36, radius - 42)}px`;
        connector.style.transform = `rotate(${angle}deg)`;
        connectorLayer.appendChild(connector);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'radial-item';
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
        button.style.setProperty('--delay', `${index * 18}ms`);
        button.dataset.id = item.id || '';
        button.setAttribute('aria-label', item.title || 'Option');
        button.innerHTML = `${svgIcon(item.icon)}${item.items ? '<span class="submenu-mark">›</span>' : ''}`;

        button.addEventListener('mouseenter', () => {
            setCenter(item.title, item.description || (item.items ? 'OPEN' : 'SELECT'));
        });

        button.addEventListener('mouseleave', () => {
            setCenter(currentTitle(), state.stack.length ? 'BACK' : 'MENU');
        });

        button.addEventListener('click', () => {
            if (Array.isArray(item.items) && item.items.length) {
                state.stack.push({ title: item.title || 'MENU', items: item.items });
                render();
                return;
            }

            if (item.actionId) {
                post('select', { actionId: item.actionId });
            }
        });

        itemsLayer.appendChild(button);
    });
}

function openMenu(items, theme) {
    state.rootItems = Array.isArray(items) ? items : [];
    state.stack = [];
    applyTheme(theme);
    render();
    state.open = true;
    app.classList.add('open');
    app.setAttribute('aria-hidden', 'false');
}

function closeMenu(send = false) {
    if (!state.open) return;
    state.open = false;
    state.stack = [];
    app.classList.remove('open');
    app.setAttribute('aria-hidden', 'true');
    if (send) post('close');
}

function goBack() {
    if (state.stack.length) {
        state.stack.pop();
        render();
    } else {
        closeMenu(true);
    }
}

center.addEventListener('click', goBack);

window.addEventListener('keydown', (event) => {
    if (!state.open) return;

    if (event.key === 'Escape' || event.key === 'F1') {
        event.preventDefault();
        closeMenu(true);
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        goBack();
    }
});

window.addEventListener('message', (event) => {
    const data = event.data || {};

    if (data.action === 'open') {
        openMenu(data.items, data.theme || {});
    } else if (data.action === 'close') {
        closeMenu(false);
    } else if (data.action === 'refresh') {
        state.rootItems = Array.isArray(data.items) ? data.items : [];
        state.stack = [];
        render();
    }
});
