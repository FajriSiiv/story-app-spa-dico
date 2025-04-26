import { getData } from "../../data/api";
import HomePresenter from "./home-presenter";

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
        <div id="map-leaflet" style="height: 400px;"></div>
        <div id="stories-container">Loading...</div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      model: getData,
    });

    this.#presenter.init();
  }
}
