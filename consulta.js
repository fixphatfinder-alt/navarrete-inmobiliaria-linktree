/* Data remains in this form only; WhatsApp receives it when the visitor continues. */
(() => {
  'use strict';
  function recipient(value) {
    const url = new URL(value);
    if (url.protocol !== 'https:') throw new Error('Enlace no válido');
    let phone = '';
    if (url.hostname === 'wa.me') phone = url.pathname.slice(1);
    else if (['api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) phone = url.searchParams.get('phone') || '';
    if (!/^\d{8,15}$/.test(phone)) throw new Error('Número del asesor no válido');
    return phone;
  }
  function message(property, data) {
    return ['Hola, deseo consultar esta propiedad:', `${property.title} (${property.id})`, property.location,
      '', `Nombre: ${data.nombre.trim()}`, `DNI: ${data.dni.trim()}`, `Celular: ${data.celular.trim()}`,
      ...(data.correo.trim() ? [`Correo: ${data.correo.trim()}`] : []), `Consulta: ${data.motivo}`,
      ...(data.mensaje.trim() ? [`Mensaje: ${data.mensaje.trim()}`] : [])].join('\n');
  }
  // Export pure helpers for local checks without using visitor data.
  if (typeof module !== 'undefined' && module.exports) { module.exports = {recipient, message}; return; }
  const dialog = document.createElement('dialog');
  dialog.id = 'consulta-dialog';
  dialog.setAttribute('aria-labelledby', 'consulta-heading');
  dialog.innerHTML = `
    <button type="button" class="consulta-close" aria-label="Cerrar formulario">×</button>
    <div class="consulta-brand"><img src="logo-original.png" alt="Navarrete Inmobiliaria"></div>
    <p class="consulta-eyebrow">CONSULTA DE PROPIEDAD</p>
    <h2 id="consulta-heading">Conversemos sobre tu próxima propiedad</h2>
    <p class="consulta-intro">Completa tus datos para continuar por WhatsApp.</p>
    <div class="consulta-property"><strong id="consulta-title"></strong><span id="consulta-location"></span><small id="consulta-code"></small></div>
    <form id="consulta-form" autocomplete="off">
      <label for="consulta-nombre">Nombre completo <em>*</em></label>
      <input id="consulta-nombre" name="nombre" required minlength="3" maxlength="120" autocomplete="name" placeholder="Escribe tu nombre y apellido">
      <label for="consulta-dni">DNI <em>*</em></label>
      <input id="consulta-dni" name="dni" required inputmode="numeric" pattern="[0-9]{8}" minlength="8" maxlength="8" autocomplete="off" title="Ingresa los 8 dígitos de tu DNI" placeholder="Ingresa los 8 dígitos de tu DNI">
      <label for="consulta-celular">Celular <em>*</em></label>
      <input id="consulta-celular" name="celular" type="tel" required maxlength="25" autocomplete="tel" placeholder="Ej.: +51 949 123 456">
      <label for="consulta-correo">Correo electrónico <span>(opcional)</span></label>
      <input id="consulta-correo" name="correo" type="email" maxlength="160" autocomplete="email" placeholder="nombre@correo.com">
      <fieldset><legend>¿En qué podemos ayudarte?</legend><div class="consulta-options">
        <label><input type="radio" name="motivo" value="Más información" checked> Más información</label>
        <label><input type="radio" name="motivo" value="Agendar visita"> Agendar visita</label>
        <label><input type="radio" name="motivo" value="Otra consulta"> Otra consulta</label>
      </div></fieldset>
      <label for="consulta-mensaje">Mensaje <span>(opcional)</span></label>
      <textarea id="consulta-mensaje" name="mensaje" rows="3" maxlength="1000" placeholder="Cuéntanos qué te gustaría saber…"></textarea>
      <label class="consulta-consent"><input type="checkbox" name="consentimiento" required> <span>Acepto compartir mis datos, incluido mi DNI, con Navarrete Inmobiliaria para atender esta consulta.</span></label>
      <details class="consulta-privacy"><summary>Cómo se comparten tus datos</summary><p>Este formulario no guarda tus datos en un registro de la web. Al continuar, los datos se incluirán en un enlace que abre WhatsApp. Solo recibiremos el mensaje cuando pulses Enviar en WhatsApp. Puedes cerrar el formulario antes de continuar para borrar los campos.</p></details>
      <p class="consulta-notice">Al continuar, se abrirá WhatsApp con tus datos y consulta. Tú decides cuándo enviar el mensaje.</p>
      <p class="consulta-error" role="alert" hidden></p>
      <button class="consulta-submit" type="submit">Continuar por WhatsApp <span aria-hidden="true">↗</span></button>
      <button class="consulta-back" type="button">Volver a la propiedad</button>
      <small class="consulta-required">* Campos obligatorios</small>
    </form>`;
  document.body.append(dialog);
  const form = dialog.querySelector('form');
  const error = dialog.querySelector('.consulta-error');
  form.addEventListener('reset', () => { for(const field of form.querySelectorAll('input'))field.setCustomValidity(''); });
  let selected = null, opener = null, previousOverflow = '';
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-consulta-id]');
    if (!button) return;
    event.preventDefault();
    selected = {id:button.dataset.consultaId, title:button.dataset.consultaTitle, location:button.dataset.consultaLocation, whatsapp:button.dataset.consultaWhatsapp};
    opener = button; form.reset(); error.hidden = true;
    dialog.querySelector('#consulta-title').textContent = selected.title;
    dialog.querySelector('#consulta-location').textContent = selected.location;
    dialog.querySelector('#consulta-code').textContent = `Código: ${selected.id}`;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal(); dialog.scrollTop = 0;
    dialog.querySelector('.consulta-close').focus();
  });
  for (const button of dialog.querySelectorAll('.consulta-close,.consulta-back')) button.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { form.reset(); selected = null; document.body.style.overflow = previousOverflow; opener?.focus(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) {const rect=dialog.getBoundingClientRect(); if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();} });
  function validateFields() {
    const name=form.elements.nombre, phone=form.elements.celular;
    name.setCustomValidity(name.value.trim().length < 3 ? 'Escribe tu nombre completo.' : '');
    const digits=phone.value.replace(/\D/g,'');
    phone.setCustomValidity(digits.length < 9 || digits.length > 15 ? 'Ingresa un celular válido, con código de país si corresponde.' : '');
  }
  form.addEventListener('input', validateFields);
  form.addEventListener('submit', event => {
    event.preventDefault();
    validateFields();
    if (!form.reportValidity() || !selected) return;
    try {
      const data=Object.fromEntries(new FormData(form));
      const url=`https://wa.me/${recipient(selected.whatsapp)}?text=${encodeURIComponent(message(selected,data))}`;
      window.location.assign(url);
    } catch { error.textContent='No pudimos abrir el WhatsApp de este asesor. Cierra el formulario e intenta nuevamente.'; error.hidden=false; }
  });
  window.addEventListener('pageshow', event => { if(event.persisted && dialog.open)dialog.close(); });
})();
