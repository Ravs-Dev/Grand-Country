const hud = document.getElementById('hud');
const vehicleHud = document.getElementById('vehicleHud');
const logoBox = document.getElementById('logoBox');
const ammoHud = document.getElementById('ammoHud');

const el = (id) => document.getElementById(id);
let hudAllowed = false;

const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

function clamp(value) {
    value = Number(value) || 0;
    return Math.max(0, Math.min(100, value));
}

function setHudVisible(visible) {
    hudAllowed = !!visible;
    if (hud) hud.classList.toggle('hidden', !hudAllowed);

    // Never leave the vehicle card visible while the main HUD is hidden.
    if (!hudAllowed && vehicleHud) {
        vehicleHud.classList.add('hidden-card');
    }
}

function setBar(name, value) {
    const amount = clamp(value);
    const bar = el(`${name}Bar`);
    const text = el(`${name}Text`);

    if (bar) bar.style.width = `${amount}%`;
    if (text) text.textContent = `${Math.round(amount)}%`;
}

function setCircleValue(name, value, lowAt = null, criticalAt = null) {
    const amount = clamp(value);
    const valueElement = el(`${name}Value`);
    const circle = el(`${name}Circle`);

    if (valueElement) valueElement.textContent = `${Math.round(amount)}%`;

    if (circle) {
        circle.style.setProperty('--value', amount);
        if (lowAt !== null) circle.classList.toggle('low', amount <= lowAt);
        if (criticalAt !== null) circle.classList.toggle('critical', amount <= criticalAt);
    }
}

function updateVoice(data) {
    const voice = data || {};
    const talking = !!voice.talking;
    const mode = voice.mode || 'OFF';
    const circle = el('voiceCircle');
    const text = el('voiceText');

    if (circle) {
        circle.classList.toggle('active', talking);
        circle.style.setProperty('--value', talking ? 100 : 35);
    }

    if (text) text.textContent = String(mode).toUpperCase().slice(0, 7);
}

function updateStressStyle(value) {
    const stress = clamp(value);
    const circle = el('stressCircle');

    if (circle) {
        circle.classList.toggle('high', stress >= 70);
        circle.style.setProperty('--value', stress);
    }
}

function updateClock() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    const date = el('dateText');
    const time = el('timeText');
    if (date) date.textContent = `${dd}/${mm}/${yyyy}`;
    if (time) time.textContent = `${hh}:${min}`;
}

setInterval(updateClock, 1000);
updateClock();

function updateAmmo(ammo) {
    const visible = !!(ammo && ammo.visible);

    if (!ammoHud) return;
    ammoHud.classList.toggle('hidden-card', !visible);

    if (!visible) return;

    const clip = Math.max(0, Math.round(Number(ammo.clip) || 0));
    const reserve = Math.max(0, Math.round(Number(ammo.reserve) || 0));

    const clipEl = el('ammoClip');
    const reserveEl = el('ammoReserve');

    if (clipEl) clipEl.textContent = clip;
    if (reserveEl) reserveEl.textContent = reserve;

    ammoHud.classList.toggle('empty', clip <= 0 && reserve <= 0);
}

function setVehicleStatus(name, value) {
    const amount = clamp(value);
    const bar = el(`vehicle${name}Bar`);
    const text = el(`vehicle${name}`);
    const box = el(`${name.toLowerCase()}Status`);

    if (bar) bar.style.width = `${amount}%`;
    if (text) text.textContent = `${Math.round(amount)}%`;

    if (box) {
        box.classList.toggle('low', amount <= 35 && amount > 15);
        box.classList.toggle('critical', amount <= 15);
    }
}

function updateVehicleHud(vehicle) {
    if (!vehicleHud) return;

    if (!hudAllowed || !vehicle) {
        vehicleHud.classList.add('hidden-card');
        return;
    }

    vehicleHud.classList.remove('hidden-card');

    const speed = Math.max(0, Math.round(Number(vehicle.speed) || 0));
    const rpm = clamp(vehicle.rpm);
    const belt = vehicle.belt === true || vehicle.belt === 1 || vehicle.belt === '1' || vehicle.belt === 'true';

    const speedEl = el('vehicleSpeed');
    const unitEl = el('vehicleUnit');
    const rpmArc = el('vehicleRpmArc');

    if (speedEl) speedEl.textContent = speed;
    if (unitEl) unitEl.textContent = String(vehicle.unit || 'KM/H').toUpperCase();

    if (rpmArc) {
        const fill = Math.max(4, rpm);
        rpmArc.style.strokeDasharray = `${fill} ${100 - fill}`;
        rpmArc.classList.toggle('hot', rpm >= 72 && rpm < 90);
        rpmArc.classList.toggle('red', rpm >= 90);
    }

    setVehicleStatus('Fuel', vehicle.fuel);
    setVehicleStatus('Engine', vehicle.engine);

    const beltStatus = el('beltStatus');
    const beltBar = el('vehicleBeltBar');
    const beltText = el('vehicleBelt');

    if (beltStatus) beltStatus.classList.toggle('on', belt);
    if (beltBar) beltBar.style.width = belt ? '100%' : '22%';
    if (beltText) beltText.textContent = belt ? 'ON' : 'OFF';
}

window.addEventListener('message', (event) => {
    const message = event.data || {};

    // Compatibility with older/newer LC HUD visibility messages.
    if (message.action === 'hudVisibility') {
        setHudVisible(!!message.show);
        return;
    }

    if (message.action === 'visible') {
        setHudVisible(!!message.visible);
        return;
    }

    if (message.action === 'show') {
        setHudVisible(true);
        return;
    }

    if (message.action === 'hide') {
        setHudVisible(false);
        return;
    }

    if (message.action !== 'update' || !message.data) return;

    const data = message.data;

    // Important: an update must NEVER make the HUD visible by itself.
    // Only explicit spawn/visibility events are allowed to show it.
    if (!hudAllowed) return;

    const serverId = el('serverId');
    const playerCount = el('playerCount');
    const cash = el('cash');
    const bank = el('bank');
    const job = el('job');
    const gang = el('gang');

    if (serverId) serverId.textContent = `#${data.serverId ?? 0}`;
    if (playerCount) playerCount.textContent = `${data.playerCount ?? 0}`;
    if (cash) cash.textContent = money.format(Number(data.cash) || 0);
    if (bank) bank.textContent = money.format(Number(data.bank) || 0);
    if (job) job.textContent = data.job || 'Civilian - Freelancer';
    if (gang) gang.textContent = data.gang || 'No Gang - Unaffiliated';

    setBar('health', data.health);
    setBar('armor', data.armor);

    setCircleValue('hunger', data.hunger, 25, 10);
    setCircleValue('thirst', data.thirst, 25, 10);
    setCircleValue('stress', data.stress);
    setCircleValue('stamina', data.stamina, 20, 8);

    const staminaCircle = el('staminaCircle');
    if (staminaCircle) staminaCircle.classList.toggle('running', !!data.runActive);

    updateVoice(data.voice);
    updateStressStyle(data.stress);
    updateAmmo(data.ammo);
    updateVehicleHud(data.vehicle);
});

// NUI starts hidden. It is shown only when the Lua client says the character is loaded.
setHudVisible(false);
