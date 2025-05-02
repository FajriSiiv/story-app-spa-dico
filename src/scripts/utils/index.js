// import { registerSW } from 'virtual:pwa-register';

export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function setupSkipToContent(element, mainContent) {



  element.addEventListener('click', () => {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();

    const currentHash = window.location.hash.split('#')[1];
    window.location.hash = `${currentHash}#main-content`;
  });
}

export function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds} detik lalu`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} minggu lalu`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} bulan lalu`;
  const years = Math.floor(days / 365);
  return `${years} tahun lalu`;
}


export default async function swRegister() {
  if (!('serviceWorker' in navigator)) {
    console.error('Service Worker API not supported.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    console.log('Service Worker registered with scope:', registration.scope);
  } catch (error) {
    console.error('Service worker registration failed');
  }

  // return registerSW({
  //   onOfflineReady() {
  //     console.log('App siap offline');
  //   },
  //   onNeedRefresh() {
  //     console.log('Update tersedia');
  //   }
  // });
}
