(() => {
    const byId = (id) => document.getElementById(id);
    const clamp = (value, min = 0, max = 100) =>
        Math.max(min, Math.min(max, Number(value) || 0));

    const setStatus = (name, value) => {
        const amount = clamp(value);
        const bar = byId(`vehicle${name}Bar`);
        const text = byId(`vehicle${name}`);
        const box = byId(`${name.toLowerCase()}Status`);

        if (bar) bar.style.width = `${amount}%`;
        if (text) text.textContent = `${Math.round(amount)}%`;

        if (box) {
            box.classList.toggle('low', amount <= 35 && amount > 15);
            box.classList.toggle('critical', amount <= 15);
        }
    };

    const updateVehicle = (data) => {
        const hud = byId('vehicleHud');
        if (!hud) return;

        if (!data || data.visible === false) {
            hud.classList.add('hidden-card');
            hud.setAttribute('aria-hidden', 'true');
            return;
        }

        hud.classList.remove('hidden-card');
        hud.setAttribute('aria-hidden', 'false');

        const speed = Math.max(0, Math.round(Number(data.speed) || 0));
        const rpm = clamp(data.rpm);
        const gear = Math.max(0, Math.round(Number(data.gear) || 0));
        const belt = data.belt === true || data.belt === 1;

        if (byId('vehicleSpeed')) byId('vehicleSpeed').textContent = speed;
        if (byId('vehicleUnit')) byId('vehicleUnit').textContent = String(data.unit || 'KM/H').toUpperCase();
        if (byId('vehicleGear')) byId('vehicleGear').textContent = gear <= 0 ? 'N' : String(gear);

        const rpmArc = byId('vehicleRpmArc');
        if (rpmArc) {
            const live = Math.max(4, rpm);
            rpmArc.style.strokeDasharray = `${live} ${100 - live}`;
        }

        setStatus('Fuel', data.fuel);
        setStatus('Engine', data.engine);

        const beltBox = byId('beltStatus');
        if (beltBox) beltBox.classList.toggle('on', belt);
        if (byId('vehicleBeltBar')) byId('vehicleBeltBar').style.width = belt ? '100%' : '20%';
        if (byId('vehicleBelt')) byId('vehicleBelt').textContent = belt ? 'ON' : 'OFF';
    };

    window.addEventListener('message', (event) => {
        const message = event.data || {};
        if (message.action === 'vehicle') updateVehicle(message);
    });
})();
