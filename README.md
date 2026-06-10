# Landing de Navarrete Inmobiliaria

Landing tipo Linktree para Navarrete Inmobiliaria, preparada para publicarse
como sitio estático en GitHub Pages.

## Archivos publicados

- `index.html`: página principal.
- `hero-casa-moderna.png`: imagen del encabezado.
- `logo-navarrete-hero.png`: logo utilizado en la cabecera.
- `og-navarrete-inmobiliaria.jpg`: portada mostrada al compartir el enlace.
- `leaflet.css` y `leaflet.js`: mapa interactivo.
- `.nojekyll`: evita que GitHub Pages procese los archivos con Jekyll.

Todos los recursos locales usan rutas relativas, por lo que funcionan tanto en
la raíz de un dominio como en una dirección del tipo:

`https://USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`

## Publicar desde la web de GitHub

1. Inicia sesión en [GitHub](https://github.com/).
2. Pulsa **New repository**.
3. Usa un nombre como `navarrete-inmobiliaria-linktree`.
4. Selecciona **Public** y crea el repositorio sin añadir archivos iniciales.
5. Dentro del repositorio, pulsa **Add file > Upload files**.
6. Sube los archivos de la raíz de este proyecto:
   - `.nojekyll`
   - `index.html`
   - `hero-casa-moderna.png`
   - `logo-navarrete-hero.png`
   - `og-navarrete-inmobiliaria.jpg`
   - `leaflet.css`
   - `leaflet.js`
   - `README.md`
7. Confirma la carga con **Commit changes**.
8. Abre **Settings > Pages**.
9. En **Build and deployment**, selecciona **Deploy from a branch**.
10. Elige la rama `main`, la carpeta `/ (root)` y pulsa **Save**.

GitHub mostrará la dirección pública cuando termine el despliegue. Normalmente:

`https://USUARIO.github.io/navarrete-inmobiliaria-linktree/`

La primera publicación puede tardar unos minutos.

Antes de compartir la página, abre `index.html` y reemplaza `TU-USUARIO` en
las etiquetas `og:url`, `og:image` y `twitter:image` por tu usuario real de
GitHub. Las redes sociales necesitan direcciones públicas absolutas para leer
la portada correctamente.

## Publicar con Git

Si Git está instalado, ejecuta desde la carpeta del proyecto:

```powershell
git init
git add .
git commit -m "Publicar landing de Navarrete Inmobiliaria"
git branch -M main
git remote add origin https://github.com/USUARIO/NOMBRE-DEL-REPOSITORIO.git
git push -u origin main
```

Después activa GitHub Pages desde `Settings > Pages`, usando la rama `main` y
la carpeta `/ (root)`.

## Actualizar la landing

Modifica los archivos de la raíz, confirma los cambios y vuelve a subirlos a la
rama `main`. GitHub Pages actualizará automáticamente la misma URL pública.

## Notas

- El mapa necesita conexión a internet para cargar las capas de OpenStreetMap o
  Esri.
- Los marcadores y datos de propiedades están incluidos directamente en
  `index.html`.
- No se necesita instalar dependencias ni ejecutar un proceso de compilación.
