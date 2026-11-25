/**
 * model3d.js — Rieles de Bugaba
 * Controla el visor 3D interactivo de la locomotora.
 */

(function () {
  'use strict';

  const shell = document.getElementById('model3dShell');
  if (!shell) return;

  const statusEl = document.getElementById('model3dStatus');
  const errorEl = document.getElementById('model3dError');
  const scene = document.getElementById('model3dScene');
  const locomotoraEntity = document.getElementById('locomotoraEntity');
  const demoPlaceholder = document.getElementById('demoPlaceholder');
  const resetBtn = document.getElementById('model3dReset');
  const zoomInBtn = document.getElementById('model3dZoomIn');
  const zoomOutBtn = document.getElementById('model3dZoomOut');
  const caption = document.getElementById('model3dCaption');
  const cameraEntity = document.getElementById('model3dCamera');

  let revealed = false;
  let modelConfirmedLoaded = false;

  function revealScene() {
    if (revealed) return;
    revealed = true;
    if (statusEl) statusEl.hidden = true;
    if (scene) scene.style.display = 'block';
  }

  function useDemoPlaceholder(reason) {
    if (modelConfirmedLoaded) return; 
    
    console.warn('[model3d] Mostrando demo placeholder. Motivo:', reason);
    revealScene();
    if (locomotoraEntity) locomotoraEntity.setAttribute('visible', 'false');
    if (demoPlaceholder) demoPlaceholder.setAttribute('visible', 'true');
    
    if (errorEl) {
      errorEl.hidden = false;
      const msg = errorEl.querySelector('p');
      if (msg && reason) msg.textContent = reason;
    }
  }

  function confirmModelLoaded(source) {
    console.log('[model3d] Modelo confirmado como cargado. Origen:', source);
    modelConfirmedLoaded = true;
    
    clearTimeout(loadTimeout);
    clearInterval(pollInterval);
    
    revealScene();
    
    // Forzamos la ocultación del mensaje de error
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.style.display = 'none'; 
    }
    
    // Mostramos el modelo real y ocultamos el de demostración
    if (locomotoraEntity) locomotoraEntity.setAttribute('visible', 'true');
    if (demoPlaceholder) {
      demoPlaceholder.setAttribute('visible', 'false');
      demoPlaceholder.style.display = 'none'; 
    }
    
    // Actualizamos el texto descriptivo
    if (caption) {
      caption.textContent = 'Modelo tridimensional interactivo de la histórica locomotora amarilla del Museo del Ferrocarril Bugabeño. Arrastra para rotar y usar la rueda para hacer zoom.';
    }
  }

  if (!locomotoraEntity) return;

  // A-Frame a veces tarda en procesar las texturas, así que esperamos un poco
  const loadTimeout = setTimeout(() => {
    if (!modelConfirmedLoaded) {
      useDemoPlaceholder('El modelo tardó demasiado en cargar.');
    }
  }, 30000); 

  // Escuchamos el evento oficial
  locomotoraEntity.addEventListener('model-loaded', () => confirmModelLoaded('evento model-loaded'));
  
  // Si hay un error, esperamos 2 segundos antes de rendirnos (a veces es un falso positivo)
  locomotoraEntity.addEventListener('model-error', (e) => {
    console.warn('[model3d] Evento model-error (posible falso positivo):', e.detail);
    setTimeout(() => {
      const mesh = locomotoraEntity.getObject3D('mesh');
      if (mesh) {
        confirmModelLoaded('Mesh detectada tras model-error');
      } else {
        useDemoPlaceholder('No se pudo cargar el modelo 3D.');
      }
    }, 2000);
  });

  // Revisamos cada 500ms si el modelo ya está en la escena
  const pollInterval = setInterval(() => {
    if (modelConfirmedLoaded) return;
    
    const mesh = locomotoraEntity.getObject3D('mesh');
    if (mesh) {
      confirmModelLoaded('detectado por sondeo visual');
    }
  }, 500);

  // ----- Controles del visor -----
  if (resetBtn && cameraEntity) {
    resetBtn.addEventListener('click', () => {
      const orbit = cameraEntity.components && cameraEntity.components['orbit-controls'];
      if (orbit && orbit.controls) {
        orbit.controls.reset();
      } else {
        cameraEntity.setAttribute('position', '0 1 3.2');
      }
    });
  }

  function adjustZoom(factor) {
    if (!cameraEntity) return;
    const orbit = cameraEntity.components && cameraEntity.components['orbit-controls'];
    if (orbit && orbit.controls) {
      const controls = orbit.controls;
      const dir = controls.object.position.clone().sub(controls.target);
      dir.multiplyScalar(factor);
      controls.object.position.copy(controls.target).add(dir);
      controls.update();
    }
  }

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => adjustZoom(0.85));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => adjustZoom(1.18));
})();