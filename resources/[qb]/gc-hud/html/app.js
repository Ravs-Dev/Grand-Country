const hud = document.getElementById('hud');
const vehicleHud = document.getElementById('vehicleHud');
const conditionState = document.getElementById('conditionState');
const logoBox = document.getElementById('logoBox');

const el = (id) => document.getElementById(id);

const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

function clamp(value) {
    value = Number(value) || 0;
    return Math.max(0, Math.min(100, value));
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

    if (valueElement) {
        valueElement.textContent = `${Math.round(amount)}%`;
    }

    if (circle) {
        circle.style.setProperty('--value', amount);

        if (lowAt !== null) {
            circle.classList.toggle('low', amount <= lowAt);
        }

        if (criticalAt !== null) {
            circle.classList.toggle('critical', amount <= criticalAt);
        }
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

function setInjuries(data) {
    const injuries = data || {};

    const bodyMap = {
        injHead: !!injuries.head,
        injTorso: !!injuries.torso,
        injLeftArm: !!injuries.leftarm,
        injRightArm: !!injuries.rightarm,
        injLeftLeg: !!injuries.leftleg,
        injRightLeg: !!injuries.rightleg
    };

    let injured = false;

    Object.entries(bodyMap).forEach(([id, active]) => {
        const zone = el(id);
        if (zone) zone.classList.toggle('active', active);
        if (active) injured = true;
    });

    if (conditionState) {
        conditionState.textContent = injured ? 'INJURED' : 'SAFE';
        conditionState.classList.toggle('danger', injured);
        conditionState.classList.toggle('safe', !injured);
    }

    if (logoBox) {
        logoBox.classList.toggle('danger', injured);
    }
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

    el('dateText').textContent = `${dd}/${mm}/${yyyy}`;
    el('timeText').textContent = `${hh}:${min}`;
}

setInterval(updateClock, 1000);
updateClock();


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
    if (!vehicle) {
        vehicleHud.classList.add('hidden-card');
        return;
    }

    vehicleHud.classList.remove('hidden-card');

    const speed = Math.max(0, Math.round(Number(vehicle.speed) || 0));
    const rpm = clamp(vehicle.rpm);
    const belt = vehicle.belt === true || vehicle.belt === 1;

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

    if (message.action === 'visible') {
        hud.classList.toggle('hidden', !message.visible);
        return;
    }

    if (message.action !== 'update' || !message.data) return;

    const data = message.data;

    hud.classList.remove('hidden');

    el('serverId').textContent = `#${data.serverId ?? 0}`;
    el('playerCount').textContent = `${data.playerCount ?? 0} Players`;
    el('cash').textContent = money.format(Number(data.cash) || 0);
    el('bank').textContent = money.format(Number(data.bank) || 0);
    el('job').textContent = data.job || 'Civilian - Freelancer';
    el('gang').textContent = data.gang || 'No Gang - Unaffiliated';

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
    setInjuries(data.injuries);

    updateVehicleHud(data.vehicle);
});
