export default class RegisterPrenseter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getRegister({ name, email, password }) {
    this.#view.loadingRegister();

    try {
      const response = await this.#model(name, email, password);
      if (!response.error) {
        this.#view.registerSuccess(response.message);

      } else {
        this.#view.registerFailed(response.message)
      }

    } catch (err) {
      this.#view.registerFailed(err.message)
    } finally {
      this.#view.loadingRegisterEnd();
    }
  }

};


