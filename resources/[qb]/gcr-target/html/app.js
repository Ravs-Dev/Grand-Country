document.addEventListener('DOMContentLoaded', () => {
  const eye = document.getElementById('target-eye');
  const label = document.getElementById('target-label');
  const wrapper = document.getElementById('target-wrapper');
  let active = false;
  let focused = false;
  let focusTime = 0;

  function clear() { label.replaceChildren(); }
  function close() { active = false; focused = false; clear(); wrapper.classList.remove('active','found','focused'); eye.className = 'fas fa-eye'; }
  function open() { active = true; focused = false; clear(); wrapper.classList.add('active'); wrapper.classList.remove('found','focused'); eye.className = 'fas fa-eye'; }
  function showOptions(options) {
    clear();
    Object.entries(options || {}).forEach(([index, item]) => {
      if (!item) return;
      const row = document.createElement('div');
      row.className = 'gcr-target-option';
      row.id = `target-option-${Number(index) + 1}`;
      row.dataset.option = String(Number(index) + 1);
      const ico = document.createElement('i');
      ico.className = item.icon || 'fas fa-hand-pointer';
      const txt = document.createElement('span');
      txt.textContent = item.label || 'Interact';
      row.append(ico, txt);
      label.append(row);
    });
  }
  function send(endpoint, data = '') {
    return fetch(`https://${GetParentResourceName()}/${endpoint}`, {
      method: 'POST', headers: {'Content-Type':'application/json; charset=UTF-8'}, body: JSON.stringify(data)
    }).catch(console.error);
  }
  window.addEventListener('message', e => {
    const msg = e.data || {};
    switch (msg.response) {
      case 'openTarget': open(); break;
      case 'closeTarget': close(); break;
      case 'leftTarget': clear(); focused = false; wrapper.classList.remove('found','focused'); eye.className='fas fa-eye'; break;
      case 'foundTarget':
        if (!active) open();
        eye.className = msg.data || 'fas fa-eye';
        wrapper.classList.add('found');
        showOptions(msg.options);
        break;
      case 'validTarget':
        focused = true; focusTime = performance.now();
        wrapper.classList.add('focused');
        showOptions(msg.data);
        break;
    }
  });
  document.addEventListener('mousedown', e => {
    if (!active || !focused || e.button !== 0) return;
    // Prevent the initial focus click from activating a target option.
    if (performance.now() - focusTime < 250) return;
    const option = e.target.closest('.gcr-target-option');
    if (!option) return;
    e.preventDefault();
    const index = Number(option.dataset.option);
    if (!Number.isInteger(index)) return;
    focused = false;
    send('selectTarget', index);
    close();
  });
  document.addEventListener('keydown', e => {
    if (!active || !['Escape','Backspace'].includes(e.key)) return;
    close(); send('closeTarget');
  });
});
