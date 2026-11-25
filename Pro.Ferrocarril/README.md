# Rieles de Bugaba — Un viaje por nuestra memoria

Experiencia web inmersiva dedicada al patrimonio histórico de la antigua estación
ferroviaria de Bugaba, Chiriquí, Panamá (Museo del Ferrocarril Bugabeño). Incluye
recorrido 360°, visor 3D de la locomotora, realidad aumentada, sección de historia
y galería fotográfica.

Proyecto académico — ningún dato histórico específico ha sido inventado; las
fechas y hechos pendientes de verificación están marcados explícitamente en la
sección "Historia y memoria" como `[Contenido pendiente de investigación]`.

---

## 1. Estructura del proyecto

```
Pro.Ferrocarril/
│
├── index.html                  ← Página única con todas las secciones
├── README.md                   ← Este archivo
├── css/
│   └── style.css               ← Identidad visual completa
├── js/
│   ├── main.js                 ← Navegación, menú móvil, año del footer
│   ├── experience360.js        ← Lógica del recorrido 360°
│   ├── model3d.js              ← Lógica del visor 3D (A-Frame + GLTF)
│   └── augmentedReality.js     ← Lógica de realidad aumentada (AR.js)
│
└── assets/
    ├── images/
    │   ├── hero-estacion.jpg   ← Foto de la estación (provista)
    │   └── logo.jpg            ← Logotipo del museo (provisto)
    ├── models/
    │   └── locomotora.glb      ← (AÚN NO INCLUIDO — ver sección 3)
    ├── 360/
    │   └── estacion-360.mp4    ← (AÚN NO INCLUIDO — ver sección 4)
    └── markers/
        └── marcador-hiro.txt   ← Instrucciones para el marcador AR
```

> **Nota importante:** los archivos `locomotora.glb` y `estacion-360.mp4` **no
> están incluidos** en esta entrega porque no se proporcionó el modelo 3D real
> ni el video panorámico real. El sitio está completamente preparado para
> recibirlos: mientras no existan, el visor 3D muestra una geometría de
> demostración claramente identificada, y el recorrido 360° muestra un mensaje
> de error claro en lugar de simular que funciona.

---

## 2. Cómo abrir el proyecto en Visual Studio Code

1. Descomprime el archivo ZIP en la ubicación de tu preferencia.
2. Abre Visual Studio Code.
3. Ve a **Archivo → Abrir carpeta…** y selecciona la carpeta `Pro.Ferrocarril`.
4. Instala la extensión **Live Server** (de Ritwick Dey) desde el marketplace de
   extensiones, si no la tienes ya.
5. Haz clic derecho sobre `index.html` → **Open with Live Server**.
6. El sitio se abrirá en `http://127.0.0.1:5500` (o puerto similar).

**¿Por qué Live Server y no abrir el HTML directamente con doble clic?**
Porque varias funciones (carga de modelos GLB, A-Frame, AR.js, acceso a cámara)
requieren que el sitio se sirva mediante HTTP/HTTPS y no mediante el protocolo
`file://`, que los navegadores restringen por seguridad.

---

## 3. Cómo integrar el modelo 3D (GLB/GLTF) de la locomotora

1. Consigue o exporta el modelo de la locomotora en formato `.glb` (preferido,
   es un solo archivo autocontenido) o `.gltf` + texturas.
2. Copia el archivo dentro de `assets/models/`.
3. Nómbralo exactamente `locomotora.glb`.
   - Si prefieres otro nombre, edita en `index.html` la línea:
     ```html
     <a-asset-item id="locomotoraAsset" src="assets/models/locomotora.glb"></a-asset-item>
     ```
     y cambia la ruta `src` por la tuya. Haz lo mismo en `augmentedReality.js`
     (`id="arLocomotoraAsset"`) si también quieres usarlo en la experiencia AR.
4. Recarga la página. El visor 3D (sección "Locomotora 3D") detectará el
   modelo automáticamente:
   - Si carga correctamente, se mostrará con iluminación y controles orbitales.
   - Si falla o no existe, se mostrará la geometría de demostración (una caja y
     un cilindro simples) con el texto "MODELO DE DEMOSTRACIÓN", y un aviso
     explicando que el modelo definitivo aún no se ha incorporado.
5. Recomendaciones de optimización para celulares de gama media:
   - Mantén el archivo `.glb` por debajo de ~10–15 MB.
   - Usa texturas comprimidas (JPG/WebP) y evita mallas con millones de polígonos.
   - Herramientas como [gltf-transform](https://gltf-transform.donmccurdy.com/)
     o [Blender](https://www.blender.org/) (exportación GLB optimizada) ayudan
     a reducir el peso del modelo.

---

## 4. Cómo incorporar el video 360°

1. Consigue un video **equirectangular 360°** real (no un video panorámico plano
   ni un video 360 "falso"). Formato recomendado: `.mp4` (H.264), resolución
   2K–4K, relación de aspecto 2:1.
2. Copia el archivo dentro de `assets/360/`.
3. Nómbralo `estacion-360.mp4`, o actualiza la ruta en `index.html`:
   ```html
   <video id="pano360Video" src="assets/360/estacion-360.mp4" ...></video>
   ```
4. Recarga la página. La sección "Recorrido 360°" reproducirá el video sobre
   una esfera (`<a-videosphere>`), permitiendo mirar alrededor con el mouse
   (clic y arrastra) o con el giroscopio en celulares compatibles.
5. Si el archivo no existe o no es compatible, se mostrará un mensaje de error
   explícito — el sitio nunca simula un recorrido 360° con un video plano.
6. Para reducir el peso en móviles, comprime el video (por ejemplo con
   [HandBrake](https://handbrake.fr/) o `ffmpeg`) manteniendo la proyección
   equirectangular intacta.

---

## 5. Cómo probar WebXR y la realidad aumentada

### Requisitos generales
- **HTTPS obligatorio** (salvo en `localhost`), ya que tanto WebXR como el
  acceso a la cámara (`getUserMedia`) están bloqueados en contextos no seguros.
- Navegador actualizado compatible: Chrome/Edge (Android/desktop), Safari 13+
  (iOS/macOS), Firefox reciente.

### Probar el visor 3D con WebXR (modo inmersivo de A-Frame)
1. Sirve el sitio por HTTPS o `localhost` (ver sección 2).
2. Abre la sección "Locomotora 3D" desde un dispositivo o navegador compatible
   con WebXR (por ejemplo, Chrome en un celular Android con soporte ARCore, o
   un visor VR compatible).
3. A-Frame expondrá automáticamente el botón de entrada a VR/AR si el
   dispositivo lo soporta (`vr-mode-ui` está habilitado en la escena del
   recorrido 360°; en el visor 3D puedes habilitarlo de igual forma si lo
   deseas, ajustando el atributo `vr-mode-ui` en `index.html`).

### Probar la realidad aumentada (AR.js + marcador)
1. Sirve el sitio por HTTPS (en un celular real necesitarás esto; `localhost`
   solo funciona si accedes desde el propio dispositivo donde corre el servidor).
2. Abre la sección "Realidad aumentada" desde el navegador de tu celular.
3. Pulsa **"Iniciar experiencia AR"** y concede el permiso de cámara cuando se
   solicite.
4. Ten a mano el marcador Hiro (ver `assets/markers/marcador-hiro.txt` para
   instrucciones de descarga e impresión) y apúntale con la cámara.
5. El modelo de la locomotora (o la demostración, si el GLB aún no está
   incorporado) aparecerá sobre el marcador.
6. Pulsa **"Detener experiencia"** para liberar la cámara correctamente.

**Manejo de errores incluido:**
- Si el navegador deniega el permiso de cámara, se muestra un mensaje claro.
- Si no hay conexión segura (HTTPS), se informa antes de intentar acceder a la cámara.
- Si no hay cámara disponible en el dispositivo, también se informa.
- Si la librería AR.js no puede descargarse (sin conexión a internet), se informa.

---

## 6. Pasos para publicar el sitio web

Cualquiera de estas opciones funciona, ya que el sitio es 100% estático
(HTML/CSS/JS) y no requiere backend ni build step:

### Opción A — GitHub Pages (gratuita)
1. Crea un repositorio en GitHub y sube el contenido de `Pro.Ferrocarril/`.
2. Ve a **Settings → Pages**.
3. En "Source", selecciona la rama `main` y la carpeta raíz (`/`).
4. Guarda; GitHub te dará una URL `https://usuario.github.io/repositorio/`
   servida automáticamente por HTTPS (necesario para AR y WebXR).

### Opción B — Netlify / Vercel (gratuitas)
1. Crea una cuenta en [Netlify](https://www.netlify.com/) o [Vercel](https://vercel.com/).
2. Arrastra la carpeta `Pro.Ferrocarril/` al panel de despliegue (Netlify Drop),
   o conecta tu repositorio de GitHub.
3. El despliegue es automático y queda servido por HTTPS.

### Opción C — Hosting propio
1. Sube todos los archivos y carpetas tal cual están (manteniendo la
   estructura de rutas relativas) a tu servidor vía FTP/SFTP.
2. Asegúrate de que el servidor tenga certificado SSL/TLS (HTTPS) activo —
   esto es indispensable para que funcionen la cámara (AR) y WebXR.
3. No se requiere configuración de servidor adicional (no hay backend, bases
   de datos ni variables de entorno).

---

## 7. Buenas prácticas y notas técnicas ya aplicadas

- **Accesibilidad**: enlace "saltar al contenido", roles `role="status"` /
  `role="alert"` en los estados de carga y error, texto alternativo
  descriptivo en todas las imágenes, navegación operable por teclado,
  `prefers-reduced-motion` respetado.
- **Responsive**: diseño fluido con `clamp()`, `grid`, `flex` y un menú
  hamburguesa en móviles.
- **Rendimiento**: `loading="lazy"` en imágenes de galería, fuentes con
  `preconnect`, scripts de terceros (A-Frame, AR.js) cargados vía CDN y de
  forma diferida cuando corresponde.
- **Honestidad funcional**: ningún botón es decorativo; cada visor muestra
  estados reales de carga, éxito o error en vez de resultados simulados.

---

## 8. Créditos

- Imágenes provistas por el usuario: fachada del Museo del Ferrocarril
  Bugabeño y logotipo oficial del museo.
- Librerías de terceros: [A-Frame](https://aframe.io/), [AR.js](https://ar-js-org.github.io/AR.js-Docs/).
