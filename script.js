'use strict';
function gradeFieldset(group) {
  const selected=group.querySelector('input:checked');
  const output=group.querySelector('.item-result');
  if(!selected){output.textContent='Vyberte jednu odpověď.';output.className='item-result missing';return null;}
  const correct=selected.value===group.dataset.answer;
  output.textContent=(correct?'Správně. ':'Ještě ne. ')+group.dataset.explanation;
  output.className='item-result '+(correct?'correct':'incorrect');
  return correct;
}
for(const form of document.querySelectorAll('form')) {
  form.addEventListener('change',()=>{
    for(const output of form.querySelectorAll('.item-result,.feedback,.field-result'))output.textContent='';
    for(const input of form.querySelectorAll('select'))input.removeAttribute('aria-invalid');
  });
  form.addEventListener('reset',()=>{
    for(const output of form.querySelectorAll('.item-result,.feedback,.field-result'))output.textContent='';
    for(const input of form.querySelectorAll('select'))input.removeAttribute('aria-invalid');
  });
}
document.getElementById('match-form').addEventListener('submit',event=>{
  event.preventDefault();let correct=0,missing=0;
  const selects=[...event.currentTarget.querySelectorAll('select')];
  for(const select of selects){
    const result=select.parentElement.querySelector('.field-result');
    if(!select.value){missing++;result.textContent='Nejprve vyberte evidenci.';select.setAttribute('aria-invalid','true');continue;}
    const ok=select.value===select.dataset.correct;if(ok)correct++;
    select.setAttribute('aria-invalid',String(!ok));
    const label=[...select.options].find(option=>option.value===select.dataset.correct).textContent;
    result.textContent=ok?'Správně.':'Správné přiřazení: '+label+'.';
  }
  document.getElementById('match-result').textContent=missing?'Doplňte chybějící přiřazení.':`Správně ${correct} ze ${selects.length}.`;
});
document.getElementById('link-form').addEventListener('submit',event=>{event.preventDefault();gradeFieldset(event.currentTarget.querySelector('fieldset'));});
document.getElementById('quiz-form').addEventListener('submit',event=>{
  event.preventDefault();const results=[...event.currentTarget.querySelectorAll('fieldset')].map(gradeFieldset);
  document.getElementById('quiz-result').textContent=results.includes(null)?'Ještě odpovězte na všechny otázky.':`Správně ${results.filter(Boolean).length} ze ${results.length}. Projděte si vysvětlení u odpovědí.`;
});
for(const details of document.querySelectorAll('details')){
 details.addEventListener('toggle',()=>{const label=details.querySelector('.reveal');if(label)label.firstChild.textContent=details.open?'Skrýt námět ':'Zobrazit námět ';});
}
if('IntersectionObserver' in window){
 const links=[...document.querySelectorAll('nav a')];
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;for(const link of links){if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}}},{rootMargin:'-15% 0px -65% 0px',threshold:0});
 for(const link of links)observer.observe(document.querySelector(link.hash));
}
