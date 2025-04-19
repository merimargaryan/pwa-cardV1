// Показ/скрытие QR-кодов
document.querySelectorAll('.contact-button').forEach(button => {
    button.addEventListener('click', () => {
      const qrFile = button.getAttribute('data-qr');
      document.getElementById('qrImage').src = `images/${qrFile}`;
      document.getElementById('qrContainer').style.display = 'block';
      document.getElementById('qrOverlay').style.display = 'block';
    });
  });
  
  document.getElementById('closeQr').addEventListener('click', closeQrModal);
  document.getElementById('qrOverlay').addEventListener('click', closeQrModal);
  
  function closeQrModal() {
    document.getElementById('qrContainer').style.display = 'none';
    document.getElementById('qrOverlay').style.display = 'none';
  }
  
  // Регистрация Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(registration => {
          console.log('ServiceWorker зарегистрирован:', registration.scope);
          
          // Проверка офлайн-статуса при загрузке
          updateOnlineStatus();
          
          // Периодическая проверка обновлений (каждые 60 минут)
          setInterval(() => registration.update(), 60 * 60 * 1000);
        })
        .catch(err => {
          console.error('Ошибка регистрации ServiceWorker:', err);
        });
    });
  }
  
  // Обработчики изменения сетевого статуса
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  function updateOnlineStatus() {
    const notification = document.getElementById('offlineNotification');
    if (!navigator.onLine) {
      notification.style.display = 'block';
      notification.textContent = 'Офлайн-режим: используется кэшированная версия';
      setTimeout(() => notification.style.display = 'none', 3000);
    } else {
      notification.style.display = 'none';
    }
  }
  
  // Проверка доступности ресурсов в кэше
  function checkCachedResources() {
    caches.open(CACHE_NAME)
      .then(cache => cache.keys())
      .then(requests => {
        console.log('Закэшированные ресурсы:', requests.map(r => r.url));
      });
  }
  
  // Инициализация при загрузке
  document.addEventListener('DOMContentLoaded', () => {
    // Проверяем кэш при разработке
    if (window.location.hostname === 'localhost') {
      checkCachedResources();
    }
  });