import '../styles/styles.css';

import App from './pages/app';
import swRegister from './utils';
import { notifyRequest, subscribe } from './utils/notification';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await swRegister();
  } catch (err) {
    console.error("Gagal register service worker:", err);
  }

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
    skipLinkButton: document.querySelector("#skip-link")
  });



  app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
