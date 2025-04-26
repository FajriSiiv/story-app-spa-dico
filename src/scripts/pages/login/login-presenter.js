export default class LoginPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getLogin({ email, password }) {
    this.#view.loadingLogin();

    try {
      const response = await this.#model(email, password);


      if (!response.error) {
        localStorage.setItem("authToken", response.loginResult.token);
        localStorage.setItem("name", response.loginResult.name);
        localStorage.setItem("userId", response.loginResult.userId);

        this.#view.loginSuccess(response.message)

      } else {
        this.#view.loginFailed(response.message)
      }
    } catch (err) {
      this.#view.loginFailed(err)
    } finally {
      this.#view.loadingLoginEnd();
    }
  }



};


