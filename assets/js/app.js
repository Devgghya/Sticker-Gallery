// app.js
// Renders the gallery, handles search and modal preview.

/* Typing effect for the animated title
   Cycles between phrases and applies separator classes for color/gradient. */
(function typingEffect(){
  const phrases = [
    { text: 'Whatsapp sticker Gallery', sepClass: 'sep-whatsapp' },
    { text: 'Instagram Sticker Gallery', sepClass: 'sep-instagram' }
  ];
  const typedEl = document.getElementById('typed');
  const sepEl = document.getElementById('sep');
  if (!typedEl || !sepEl) return;

  const typeDelay = 60; // ms per char
  const pauseAfter = 1500; // ms to wait after typing
  const deleteDelay = 30; // ms per char when deleting

  function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

  async function typeText(text){
    typedEl.classList.add('cursor');
    for(let i=0;i<text.length;i++){
      typedEl.textContent = text.slice(0,i+1);
      await sleep(typeDelay + Math.random()*20);
    }
    typedEl.classList.remove('cursor');
  }

  async function deleteText(){
    typedEl.classList.add('cursor');
    while(typedEl.textContent.length>0){
      typedEl.textContent = typedEl.textContent.slice(0,-1);
      await sleep(deleteDelay + Math.random()*10);
    }
    typedEl.classList.remove('cursor');
  }

  (async function loop(){
    let i = 0;
    while(true){
      const p = phrases[i%phrases.length];
      // Update separator class
      sepEl.classList.remove('sep-whatsapp','sep-instagram');
      sepEl.classList.add(p.sepClass);
      // Update quote color spans to match current separator
      try{
        const quotes = document.querySelectorAll('.site-title .quote');
        quotes.forEach(q => q.classList.remove('quote-whatsapp','quote-instagram'));
        const quoteClass = p.sepClass === 'sep-whatsapp' ? 'quote-whatsapp' : 'quote-instagram';
        quotes.forEach(q => q.classList.add(quoteClass));
      }catch(e){/* ignore if DOM not ready */}
      await typeText(p.text);
      await sleep(pauseAfter);
      await deleteText();
      await sleep(300);
      i++;
    }
  })();
})();

/* Footer typing: types the credit once (no delete) */
(function footerTyping(){
  const footerEl = document.getElementById('footer-typed');
  if (!footerEl) return;
  const text = 'Created By Devgghya Kulshrestha "Devu"';
  const delay = 45;
  function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
  (async function(){
    footerEl.textContent = '';
    footerEl.classList.add('cursor');
    for(let i=0;i<text.length;i++){
      footerEl.textContent = text.slice(0,i+1);
      await sleep(delay + Math.random()*10);
    }
    footerEl.classList.remove('cursor');
  })();
})();

(function () {
  const gallery = document.getElementById('gallery');
  const searchInput = document.getElementById('search');
  const modal = document.getElementById('modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalTags = document.getElementById('modal-tags');
  const modalDownload = document.getElementById('modal-download');

  function matchesFilter(sticker, term) {
    if (!term) return true;
    term = term.toLowerCase();
    if (sticker.name.toLowerCase().includes(term)) return true;
    if (sticker.tags.some(t => t.toLowerCase().includes(term))) return true;
    if (sticker.file.toLowerCase().includes(term)) return true;
    return false;
  }

  function createCard(sticker) {
    const el = document.createElement('div');
    el.className = 'card';
    el.tabIndex = 0;

    const img = document.createElement('img');
    img.className = 'thumb';
    img.src = sticker.file;
    img.alt = sticker.name;

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = sticker.name;

    const tagsWrap = document.createElement('div');
    tagsWrap.className = 'tags';
    sticker.tags.forEach(t => {
      const s = document.createElement('span');
      s.className = 'tag';
      s.textContent = t;
      s.addEventListener('click', (ev) => {
        ev.stopPropagation();
        searchInput.value = t;
        render();
      });
      tagsWrap.appendChild(s);
    });

    el.appendChild(img);
    el.appendChild(name);
    el.appendChild(tagsWrap);

    

    el.addEventListener('click', () => openModal(sticker));
    el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') openModal(sticker); });

    return el;
  }

  function render() {
    const term = searchInput.value.trim();
    gallery.innerHTML = '';
    const filtered = stickersData.filter(s => matchesFilter(s, term));
    if (filtered.length === 0) {
      const p = document.createElement('p');
      p.style.color = 'var(--muted)';
      p.textContent = 'No stickers match your search.';
      gallery.appendChild(p);
      return;
    }
    filtered.forEach(sticker => gallery.appendChild(createCard(sticker)));
  }

  function openModal(sticker) {
    modalImage.src = sticker.file;
    modalTitle.textContent = sticker.name;
    modalTags.innerHTML = '';
    sticker.tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      modalTags.appendChild(span);
    });
    modalDownload.href = sticker.file;
    // Try to provide a sensible download filename
    const ext = sticker.file.split('.').pop();
    const safeName = sticker.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    modalDownload.setAttribute('download', safeName ? `${safeName}.${ext}` : sticker.file);

    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
  }

  modalBackdrop.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeModal(); });

  searchInput.addEventListener('input', () => render());

  // initial render
  document.addEventListener('DOMContentLoaded', render);
  // If scripts are loaded after DOMContentLoaded
  if (document.readyState === 'interactive' || document.readyState === 'complete') render();
})();
