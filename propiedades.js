'use strict';
const params = new URLSearchParams(location.search);
let operation = ['venta', 'alquiler'].includes(params.get('operacion')) ? params.get('operacion') : 'all';
let properties = [];
const results = document.getElementById('results');
const search = document.getElementById('search');
const type = document.getElementById('type');
const city = document.getElementById('city');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function safeUrl(value) { try { const url = new URL(value, location.href); return ['https:', 'http:'].includes(url.protocol) ? escapeHtml(url.href) : '#'; } catch { return '#'; } }
function render() {
  document.querySelectorAll('[data-operation]').forEach(button => {
    const active = button.dataset.operation === operation;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const query = normalize(search.value.trim());
  const visible = properties.filter(p => (operation === 'all' || p.operationFilters.includes(operation)) && (type.value === 'all' || p.typeFilter === type.value) && (city.value === 'all' || p.location.includes(city.value)) && normalize(`${p.title} ${p.location} ${p.id}`).includes(query));
  document.getElementById('count').textContent = `${visible.length} ${visible.length === 1 ? 'propiedad' : 'propiedades'}`;
  results.innerHTML = visible.length ? visible.map(p => {
    const dual = p.operationFilters.length > 1;
    const price = operation === 'alquiler' && dual ? 'Consultar' : p.price;
    const note = dual && price !== 'Consultar' ? 'Precio de venta · Alquiler: consultar' : p.operationFilters.length === 1 && p.operationFilters[0] === 'alquiler' ? 'Consultar condiciones de alquiler' : 'Consultar disponibilidad';
    return `<article class="property"><div class="property-code">${escapeHtml(p.id)}<small>${escapeHtml(p.type)}</small></div><div class="photo">${p.image ? `<img src="${safeUrl(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy">` : '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M7 23 24 9l17 14M11 20v21h26V20M20 41V28h8v13M20 20h8"/></svg><span>Foto por incorporar</span>'}</div><div><span class="badge">${escapeHtml(p.operation)}</span><h3>${escapeHtml(p.title)}</h3><p class="location">${escapeHtml(p.location)}</p><div class="features"><span>${escapeHtml(p.area)}</span><span>${escapeHtml(p.type)}</span></div></div><div class="actions"><strong class="price">${escapeHtml(price)}</strong><span class="price-note">${note}</span><button type="button" class="button primary" data-consulta-id="${escapeHtml(p.id)}" data-consulta-title="${escapeHtml(p.title)}" data-consulta-location="${escapeHtml(p.location)}" data-consulta-whatsapp="${escapeHtml(p.whatsapp)}" aria-label="Consultar ${escapeHtml(p.id)}">Consultar ↗</button><a class="button" href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="Ver anuncio ${escapeHtml(p.id)}">Ver anuncio</a></div></article>`;
  }).join('') : '<div class="empty"><h3>No encontramos propiedades con esos filtros.</h3><p>Prueba otra zona o tipo de inmueble.</p><button id="reset">Limpiar filtros</button></div>';
  document.getElementById('reset')?.addEventListener('click', () => { operation = 'all'; search.value = ''; type.value = city.value = 'all'; updateUrl(); render(); });
}
function updateUrl() { const url = new URL(location.href); if(operation === 'all') url.searchParams.delete('operacion'); else url.searchParams.set('operacion', operation); history.replaceState(null, '', url); }
document.querySelectorAll('[data-operation]').forEach(button => button.addEventListener('click', () => { operation = button.dataset.operation; updateUrl(); render(); }));
search.addEventListener('input', render);
type.addEventListener('change', render);
city.addEventListener('change', render);
fetch('propiedades.json').then(response => { if (!response.ok) throw new Error('Catálogo no disponible'); return response.json(); }).then(data => { properties = data; render(); }).catch(() => { document.getElementById('count').textContent = ''; results.innerHTML = '<div class="empty"><h3>No pudimos cargar el catálogo.</h3><p>Recarga la página o comunícate con nuestro asesor.</p><a class="button primary" href="https://wa.me/51949392200">Consultar por WhatsApp</a></div>'; });

