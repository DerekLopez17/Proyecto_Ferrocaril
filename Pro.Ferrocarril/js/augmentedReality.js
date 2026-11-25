/**
 * augmentedReality.js — Rieles de Bugaba
 * Lógica simplificada: mostrar/ocultar escena y forzar reproducción de video.
 */

(function () {
  'use strict';

  const startBtn = document.getElementById('arStart');
  const stopBtn = document.getElementById('arStop');
  const container = document.getElementById('arContainer');
  const controls = document.getElementById('arControls');

  if (!startBtn || !container) return;

  startBtn.addEventListener('click', () => {
    // 1. Mostrar la escena y los botones correspondientes
    container.style.display = 'block';
    startBtn.hidden = true;
    if (stopBtn) stopBtn.hidden = false;

    // 2. Forzar la reproducción del video generado por AR.js
    setTimeout(() => {
      const video = container.querySelector('video');
      if (video) {
        video.setAttribute('playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.play().catch(e => console.warn("Autoplay bloqueado. Toca la pantalla.", e));
      }
    }, 1500);
  });

  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      // Detener los tracks de la cámara para liberar el hardware
      const video = container.querySelector('video');
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      
      // Ocultar la escena y restaurar botones
      container.style.display = 'none';
      startBtn.hidden = false;
      stopBtn.hidden = true;
    });
  }
})();