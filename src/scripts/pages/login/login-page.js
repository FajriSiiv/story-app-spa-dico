import { login } from "../../data/api";
import LoginPresenter from "./login-presenter";

export default class LoginPage {
  #presenter = null;

  render() {
    return `
      <div class="main-form">
        <h1 class="form-title">Login</h1>
        <form id="login-form" class="container-form">
          <div class="label-flex">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Email" required />
          </div>
          <div class="label-flex">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Password (min 8 karakter)" required />
          </div>
          <button type="submit" class="btn-login">Login</button>
        </form>
        <p id="message"></p>
      </div>
    `;
  }


  afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: login,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.querySelector('#login-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
      };
      await this.#presenter.getLogin(data);
    });
  }

  loginSuccess(message) {
    document.querySelector('#message').textContent = message;

    location.hash = '/';
  }


  loginFailed(message) {
    alert(message);
  }

  loadingLogin() {
    document.querySelector('.btn-login').innerHTML = 'Loading..'
    document.querySelector('.btn-login').disabled = true
  }

  loadingLoginEnd() {
    document.querySelector('.btn-login').innerHTML = 'Login'
    document.querySelector('.btn-login').disabled = false
  }
}
