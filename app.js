// Обработчик для кнопок контактов
document.querySelectorAll('.contact-button').forEach(button => {
    button.addEventListener('click', () => {
      const qrFile = button.getAttribute('data-qr');
      document.getElementById('qrImage').src = `images/${qrFile}`;
      document.getElementById('qrContainer').style.display = 'block';
    });
  });
  
// Показ QR-кода
document.querySelectorAll('.contact-button').forEach(button => {
    button.addEventListener('click', () => {
      const qrFile = button.getAttribute('data-qr');
      document.getElementById('qrImage').src = `images/${qrFile}`;
      document.getElementById('qrContainer').style.display = 'block';
      document.getElementById('qrOverlay').style.display = 'block';
    });
  });
  
  // Закрытие QR-кода
  document.getElementById('closeQr').addEventListener('click', () => {
    document.getElementById('qrContainer').style.display = 'none';
    document.getElementById('qrOverlay').style.display = 'none';
  });
  
  // Закрытие при клике на оверлей
  document.getElementById('qrOverlay').addEventListener('click', () => {
    document.getElementById('qrContainer').style.display = 'none';
    document.getElementById('qrOverlay').style.display = 'none';
  });
  
  // Service Worker регистрация
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(registration => {
          console.log('ServiceWorker зарегистрирован');
          
          // Проверка офлайн-режима при загрузке
          if (!navigator.onLine) {
            showOfflineMessage();
          }
        })
        .catch(err => {
          console.log('Ошибка регистрации ServiceWorker: ', err);
        });
    });
  }
  
  // Обработчик изменения состояния сети
  window.addEventListener('online', () => {
    hideOfflineMessage();
  });
  
  window.addEventListener('offline', () => {
    showOfflineMessage();
  });
  
  function showOfflineMessage() {
    if (!document.getElementById('offline-message')) {
      const message = document.createElement('div');
      message.id = 'offline-message';
      message.textContent = 'Вы в офлайн-режиме, но приложение работает';
      message.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff9800;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
      `;
      document.body.appendChild(message);
    }
  }
  
  function hideOfflineMessage() {
    const message = document.getElementById('offline-message');
    if (message) {
      message.remove();
    }
  }