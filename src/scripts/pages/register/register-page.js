import { register } from "../../data/api";
import RegisterPrenseter from "./register-presenter";

export default class RegisterPage {
  #presenter = null;

  render() {
    return `<div class="main-form">
      <h1 class="form-title">Register</h1>
        <form id="register-form" class="container-form">
        <div class="label-flex">
          <label htmlFor="name" for="name">Name</label>
          <input type="text" id="name" placeholder="Nama" required />
        </div>
        <div class="label-flex">
          <label htmlFor="email" for="email">Email</label>
          <input type="email" id="email" placeholder="Email" required />
        </div>
        <div class="label-flex">
          <label htmlFor="password" for="password">Password</label>
          <input type="password" id="password" placeholder="Password (min 8 karakter)" required />
        </div>
          <button type="submit"  class="btn-login">Daftar</button>
        </form>
        <p id="message"></p>
    </div>
  `
  }


  afterRender() {
    this.#presenter = new RegisterPrenseter({
      view: this,
      model: register,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.querySelector('#register-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
      };
      await this.#presenter.getRegister(data);
    });
  }


  registerSuccess(message) {
    document.querySelector('#message').textContent = message;

    location.hash = '/login';
  }


  registerFailed(message) {
    document.querySelector('#message').textContent = message;

    alert(message);
  }


  loadingRegister() {
    document.querySelector('.btn-login').innerHTML = 'Loading..'
    document.querySelector('.btn-login').disabled = true
  }

  loadingRegisterEnd() {
    document.querySelector('.btn-login').innerHTML = 'Register'
    document.querySelector('.btn-login').disabled = false
  }
}