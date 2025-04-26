import Database from "../../database";
import { generateLoaderAbsoluteTemplate, generateStoryItemTemplate, generateStorysListEmptyTemplate, generateStorysListErrorTemplate } from "../../template/bookmark-template";
import BookmarkPresenter from "./bookmark-presenter";


export default class BookmarkPage {
  #presenter = null

  async render() {
    return `
      <section>
        <div class="storys-list__map__container">
          <div id="map" class="storys-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>
 
      <section class="container">
        <h1 class="section-title">Daftar Story Tersimpan</h1>
 
        <div class="storys-list__container">
          <div id="storys-list"></div>
          <div id="storys-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });
    await this.#presenter.initialStorysAndMap();
  }

  populateBookmarkedStorys(message, storys) {
    if (storys.length <= 0) {
      this.populateBookmarkedStorysListEmpty();
      return;
    }
    const html = storys.reduce((accumulator, story) => {
      return accumulator.concat(
        generateStoryItemTemplate({
          ...story,
          id: story.story.id,
          description: story.story.description,
          name: story.story.name,
          photoUrl: story.story.photoUrl,
          time: story.story.createdAt
        }),
      );
    }, '');

    document.getElementById('storys-list').innerHTML = `
      <div class="storys-list">${html}</div>
    `;
  }

  populateBookmarkedStorysListEmpty() {
    document.getElementById('storys-list').innerHTML = generateStorysListEmptyTemplate();
  }

  populateBookmarkedStorysError(message) {
    document.getElementById('storys-list').innerHTML = generateStorysListErrorTemplate(message);
  }

  showStorysListLoading() {
    document.getElementById('storys-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStorysListLoading() {
    document.getElementById('storys-list-loading-container').innerHTML = '';
  }
}