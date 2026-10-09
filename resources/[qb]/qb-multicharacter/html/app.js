'use strict';
const $ = (s) => document.querySelector(s);
const app = $('#app'), modal = $('#modal');
let characters=[], maxSlots=5, selected=null, deleteAllowed=true, photoAllowed=true, photoMode=false, locked=false;
const post = async (event, data={}) => {
  try {const response = await fetch(`https://${GetParentResourceName()}/${event}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); return await response.json();}
  catch(err){ console.error(event,err); showToast('Could not contact game client'); return null; }
};
const safe = (s) => String(s ?? '');
const money = (n) => new Intl.NumberFormat('en-US').format(Number(n)||0);
const current = () => characters.find(c=>c.citizenid===selected) || null;
function showToast(msg){const box=$('#toast');box.textContent=msg;box.classList.remove('hidden');setTimeout(()=>box.classList.add('hidden'),2800)}
function setText(id,v){document.getElementById(id).textContent=safe(v)}
function closeModal(){modal.classList.add('hidden')}
function openModal(type){
  $('#formArea').classList.toggle('hidden',type!=='create');
  $('#deleteArea').classList.toggle('hidden',type!=='delete');
  $('#creditsArea').classList.toggle('hidden',type!=='credits');
  setText('modalEyebrow',type==='create'?'NEW LIFE':type==='delete'?'DANGER ZONE':'GCR');
  setText('modalHeading',type==='create'?'CREATE YOUR STORY':type==='delete'?'DELETE CHARACTER':'CREDITS');
  modal.classList.remove('hidden');
}
function selectChar(id){selected=id;const c=current();if(c)post('preview',{citizenid:id});render()}
function render(){
  const c=current(), i=c?.charinfo||{}, j=c?.job||{}, m=c?.money||{};
  setText('firstName',c?i.firstname:'YOUR');setText('lastName',c?i.lastname:'STORY');
  setText('cid',c?(c.cid||1):'—');setText('job',j.label||j.name||'CIVILIAN');
  setText('nationality',i.nationality||'—');setText('birthdate',i.birthdate||'—');
  setText('cash',money(m.cash));setText('bank',money(m.bank));
  setText('slotInfo',`${characters.length} / ${maxSlots}`);
  $('#play').disabled=!c;$('#delete').disabled=!c||!deleteAllowed;
  $('#new').disabled=characters.length>=maxSlots;
  $('#photo').style.display=photoAllowed?'':'none';
  const slots=$('#slots');slots.replaceChildren();
  for(let index=1;index<=maxSlots;index++){
    const slotC=characters.find(x=>Number(x.cid)===index);
    const b=document.createElement('button');b.type='button';
    b.className=`slot ${slotC?.citizenid===selected?'selected':''} ${slotC?'':'empty'}`;
    const number=document.createElement('span');number.className='number';number.textContent=`#${String(index).padStart(2,'0')}`;
    const name=document.createElement('span');name.className='smallName';name.textContent=slotC?`${safe(slotC.charinfo?.firstname)} ${safe(slotC.charinfo?.lastname)}`:'＋ EMPTY SLOT';
    b.append(number,name);
    b.addEventListener('click',()=>slotC?selectChar(slotC.citizenid):openModal('create'));
    slots.appendChild(b);
  }
}
window.addEventListener('message',event=>{
  const d=event.data||{};
  if(d.action==='show'){
    locked=false;photoAllowed=d.photo!==false;app.classList.remove('hidden');photoMode=false;
    $('#photoHint').classList.add('hidden');closeModal();render();
  }
  if(d.action==='hide'){app.classList.add('hidden');closeModal();locked=false;}
  if(d.action==='characters'){
    characters=Array.isArray(d.characters)?d.characters:[];
    maxSlots=Math.max(1,Number(d.maxSlots)||5);deleteAllowed=!!d.allowDelete;
    if(!characters.some(c=>c.citizenid===selected))selected=characters[0]?.citizenid||null;
    render();
  }
  if(d.action==='photo'){
    photoMode=!!d.enabled;
    $('.rightPanel').classList.toggle('hidden',photoMode);
    $('.serverBrand').classList.toggle('hidden',photoMode);
    $('#photoHint').classList.toggle('hidden',!photoMode);
  }
});
$('#play').addEventListener('click',()=>{if(locked||!current())return;locked=true;post('select',{citizenid:selected})});
$('#new').addEventListener('click',()=>{if(characters.length<maxSlots)openModal('create')});
$('#delete').addEventListener('click',()=>{if(!current()||!deleteAllowed)return;setText('deleteName',`${current().charinfo?.firstname} ${current().charinfo?.lastname}`);openModal('delete')});
$('#confirmDelete').addEventListener('click',()=>{if(!current())return;post('delete',{citizenid:selected});closeModal();showToast('Deleting character...')});
$('#cancelDelete').addEventListener('click',closeModal);$('#x').addEventListener('click',closeModal);
$('#exit').addEventListener('click',()=>post('disconnect'));
$('#photo').addEventListener('click',()=>post('photo',{enabled:true}));
window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(photoMode){post('photo',{enabled:false})}else closeModal()}});
$('#createForm').addEventListener('submit',e=>{
 e.preventDefault();if(locked)return;
 const form=new FormData(e.currentTarget);
 const values=Object.fromEntries(form.entries());
 const error=$('#formError');error.textContent='';
 const d=new Date(`${values.birthdate}T00:00:00`);
 if(!Number.isFinite(d.getTime())||d.getTime()>Date.now()){error.textContent='Enter a valid past birth date';return;}
 if(!/^[A-Za-z -]{2,32}$/.test(values.firstname)||!/^[A-Za-z -]{2,32}$/.test(values.lastname)){error.textContent='Names must use 2–32 letters';return;}
 locked=true;post('create',{...values,gender:Number(values.gender)});
});
