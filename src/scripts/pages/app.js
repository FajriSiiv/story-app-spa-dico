import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { bookmarkLink } from '../template/bookmark-template';
import { generateSubscribeButtonTemplate, generateUnsubscribeButtonTemplate } from '../template/push-notif-btn';
import swRegister, { setupSkipToContent } from '../utils';
import { getPushUnSubscription, isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } from '../utils/notification';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipLinkButton;

  constructor({ navigationDrawer, drawerButton, content, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }



  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        unsubscribe().finally(async () => {
          this.#setupPushNotification();

          const reg = await navigator.serviceWorker.ready;
          reg.showNotification('Kamu telah men-unsubscribe notifikasi!', {
            body: 'Kamu tidak akan menerima notifikasi story.',
          });

        });
      });
    } else {
      pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
      document.getElementById('subscribe-button').addEventListener('click', () => {
        subscribe().finally(async () => {
          this.#setupPushNotification();

          const reg = await navigator.serviceWorker.ready;
          reg.showNotification('Kamu telah men-subscribe notifikasi!', {
            body: 'Selamat! Kamu akan menerima notifikasi story.',
          });

        });
      });
    }
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  updateNavList() {
    const navList = document.getElementById('nav-list');
    const pushNotificationTools = document.getElementById('push-notification-tools');
    const isLoggedIn = !!localStorage.getItem('authToken');

    navList.innerHTML = '';
    pushNotificationTools.innerHTML = '';

    if (isLoggedIn) {
      navList.innerHTML = `
        <li><a href="#/">Beranda</a></li>
        <li><a href="#/bookmarks">Bookmark</a></li>
        <li><a href="#/add">Add</a></li>
        <li><a href="#/about">About</a></li>
        <li><a href="#" id="logout-link">Logout</a></li>
      `;


      this.#setupPushNotification();
    } else {
      navList.innerHTML = `
        <li><a href="#/register">Register</a></li>
        <li><a href="#/login">Login</a></li>
      `;
    }

    if (isLoggedIn) {
      const logoutLink = document.getElementById('logout-link');
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        window.location.hash = '/login';
        this.updateNavList();
      });

      if (swRegister()) {
        this.#setupPushNotification();
      }
    }
  }



  async renderPage() {
    const url = getActiveRoute();

    const page = routes[url];

    const protectedRoutes = ['/add', '/', '/about'];
    const isLoggedIn = !!localStorage.getItem('authToken');

    if (protectedRoutes.includes(url) && !isLoggedIn) {
      alert('Kamu harus login terlebih dahulu!');
      window.location.hash = '/login';
      return;
    }

    const render = async () => {
      if (page) {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      } else {
        this.#content.innerHTML = '<h2>404 - Page Not Found</h2>';
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(render);
    } else {
      await render();
    }

    this.updateNavList();
  }
}

export default App;
