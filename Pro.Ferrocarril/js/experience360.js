/**
 * experience360.js — Rieles de Bugaba
 *
 * Controla el recorrido panorámico 360° construido con A-Frame (<a-videosphere>).
 * Usa un VIDEO EQUIRECTANGULAR 360° real proyectado sobre una esfera — no es un
 * video plano simulando ser 360°. Si el archivo no existe o no es reproducible,
 * se muestra un estado de error claro en lugar de fingir que la experiencia funciona.
 *
 * Recurso esperado: assets/360/estacion-360.mp4
 */

(function () {
  'use strict';

  const shell = document.getElementById('tour360Shell');
  if (!shell) return;

  const statusEl = document.getElementById('tour360Status');
  const errorEl = document.getElementById('tour360Error');
  const scene = document.getElementById('tour360Scene');
  const video = document.getElementById('pano360Video');
  const playPauseBtn = document.getElementById('tour360PlayPause');
  const resetBtn = document.getElementById('tour360Reset');
  const cameraEntity = document.getElementById('tour360Camera');

  let resolved = false;

  function showError(message) {
    if (resolved) return;
    resolved = true;
    if (statusEl) statusEl.hidden = true;
    if (scene) scene.style.display = 'none';
    if (errorEl) {
      errorEl.hidden = false;
      const msg = errorEl.querySelector('p');
      if (msg && message) msg.textContent = message;
    }
  }

  function showScene() {
    if (resolved) return;
    resolved = true;
    if (statusEl) statusEl.hidden = true;
    if (scene) scene.style.display = 'block';
    if (playPauseBtn) playPauseBtn.disabled = false;
    if (resetBtn) resetBtn.disabled = false;
  }

  if (!video) {
    showError('No se encontró el elemento de video panorámico.');
    return;
  }

  // Tiempo máximo de espera antes de mostrar error (el recurso puede no existir aún)
  const loadTimeout = setTimeout(() => {
    showError('Tiempo de espera agotado al cargar el video 360°.');
  }, 12000);

  video.addEventListener('loadeddata', () => {
    clearTimeout(loadTimeout);
    showScene();
    // Autoplay silencioso; el usuario puede pausar/reproducir con el control
    video.play().catch(() => {
      /* El navegador bloqueó el autoplay: no es un error fatal, el botón permite iniciarlo */
    });
  });

  video.addEventListener('error', () => {
    clearTimeout(loadTimeout);
    showError('No se pudo cargar el video panorámico 360° (archivo ausente o formato no compatible).');
  });

  // ----- Controles -----
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  }

  if (resetBtn && cameraEntity) {
    resetBtn.addEventListener('click', () => {
      cameraEntity.setAttribute('rotation', '0 0 0');
      // Reinicia también el estado interno de look-controls para evitar saltos
      const lookControls = cameraEntity.components && cameraEntity.components['look-controls'];
      if (lookControls && typeof lookControls.pitchObject !== 'undefined') {
        lookControls.pitchObject.rotation.x = 0;
        lookControls.yawObject.rotation.y = 0;
      }
    });
  }
})();
