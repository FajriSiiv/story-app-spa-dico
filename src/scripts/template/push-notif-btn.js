
export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" style="padding: 8px 16px; margin: 12px; background-color: #0d9488; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Aktifkan Notifikasi
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" style="padding: 8px 16px; margin: 12px; background-color: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Nonaktifkan Notifikasi
    </button>
  `;
}
