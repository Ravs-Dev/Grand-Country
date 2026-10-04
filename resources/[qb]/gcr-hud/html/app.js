const hud = document.getElementById('hud');

const els = {
    playerId: document.getElementById('player-id'),
    dateTime: document.getElementById('datetime'),
    online: document.getElementById('online'),
    bank: document.getElementById('bank'),
    cash: document.getElementById('cash'),
    job: document.getElementById('job'),
    gang: document.getElementById('gang'),

    healthBar: document.getElementById('health-bar'),
    armorBar: document.getElementById('armor-bar'),
    healthValue: document.getElementById('health-value'),
    armorValue: document.getElementById('armor-value'),

    voiceRing: document.getElementById('voice-ring'),
    hungerRing: document.getElementById('hunger-ring'),
    thirstRing: document.getElementById('thirst-ring'),
    staminaRing: document.getElementById('stamina-ring'),
    stressRing: document.getElementById('stress-ring'),

    voiceText: document.getElementById('voice-text'),
    hungerValue: document.getElementById('hunger-value'),
    thirstValue: document.getElementById('thirst-value'),
    staminaValue: document.getElementById('stamina-value'),
    stressValue: document.getElementById('stress-value'),

    radioChannel: document.getElementById('radio-channel'),
    voiceMode: document.getElementById('voice-mode'),

    vehicle: document.getElementById('vehicle-panel'),
    speed: document.getElementById('speed-number'),
    speedUnit: document.getElementById('speed-unit'),
    gear: document.getElementById('gear-value'),
    fuel: document.getElementById('fuel-value'),
    fuelBar: document.getElementById('fuel-bar'),

    logo: document.getElementById('server-logo')
};

const clamp = (v) => Math.max(0, Math.min(100, Number(v ?? 0)));

const money = (value) => {
    const n = Number(value || 0);
    return '$' + n.toLocaleString('en-US');
};

const setRing = (el, value) => {
    el.style.setProperty('--value', clamp(value));
};

function setNeeds(hunger, thirst) {
    const h = Math.round(clamp(hunger));
    const t = Math.round(clamp(thirst));

    setRing(els.hungerRing, h);
    setRing(els.thirstRing, t);

    els.hungerValue.textContent = h;
    els.thirstValue.textContent = t;
}

function updateClock() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');

    els.dateTime.textContent = `${day}/${month}/${year}  ${hour}:${minute}`;
}

updateClock();
setInterval(updateClock, 1000);

window.addEventListener('message', (event) => {
    const data = event.data || {};

    switch (data.action) {
        case 'show':
            hud.style.display = 'block';
            break;

        case 'hide':
            hud.style.display = 'none';
            break;

        case 'status': {
            const hp = Math.round(clamp(data.health));
            const armor = Math.round(clamp(data.armor));
            const stamina = Math.round(clamp(data.stamina));

            els.healthBar.style.width = `${hp}%`;
            els.armorBar.style.width = `${armor}%`;
            els.healthValue.textContent = hp;
            els.armorValue.textContent = armor;

            setRing(els.staminaRing, stamina);
            els.staminaValue.textContent = stamina;

            els.voiceRing.classList.toggle('talking', !!data.talking);

            const voice = String(data.voice || 'NORMAL').toUpperCase();
            els.voiceMode.textContent = voice;
            els.voiceText.textContent =
                voice === 'WHISPER' ? 'W' :
                voice === 'SHOUT' ? 'S' : 'N';

            const radio = Number(data.radio || 0);
            els.radioChannel.textContent = radio > 0 ? radio.toFixed(1) : '0.0';
            break;
        }

        case 'playerInfo': {
            els.playerId.textContent = `#${data.id || 0}`;
            els.cash.textContent = money(data.cash);
            els.bank.textContent = money(data.bank);

            const grade = data.grade !== undefined && data.grade !== ''
                ? ` - ${data.grade}`
                : '';

            els.job.textContent = `${data.job || 'Civilian'}${grade}`;
            els.gang.textContent = data.gang || 'No Gang';

            setNeeds(data.hunger, data.thirst);

            const stress = Math.round(clamp(data.stress));
            setRing(els.stressRing, stress);
            els.stressValue.textContent = stress;

            els.logo.style.display = data.showLogo === false ? 'none' : 'block';
            break;
        }

        case 'needs':
            setNeeds(data.hunger, data.thirst);
            break;

        case 'stress': {
            const stress = Math.round(clamp(data.stress));
            setRing(els.stressRing, stress);
            els.stressValue.textContent = stress;
            break;
        }

        case 'online':
            els.online.textContent = `${Number(data.count || 0)} Players`;
            break;

        case 'vehicle':
            if (data.visible) {
                els.vehicle.classList.remove('hidden');

                const speed = Math.max(0, Number(data.speed || 0));
                els.speed.textContent = String(Math.round(speed)).padStart(3, '0');
                els.speedUnit.textContent = data.unit || 'KM/H';

                const gear = Number(data.gear || 0);
                els.gear.textContent = gear === 0 ? 'R' : String(gear);

                const fuel = Math.round(clamp(data.fuel));
                els.fuel.textContent = `${fuel}%`;
                els.fuelBar.style.width = `${fuel}%`;
            } else {
                els.vehicle.classList.add('hidden');
            }
            break;
    }
});
