import { getDetailData } from "../../data/api";
import Database from "../../database";
import { parseActivePathname } from "../../routes/url-parser";
import { generateRemoveStoryButtonTemplate, generateSaveStoryButtonTemplate } from "../../template/save-story-button";
import { getTimeAgo, showFormattedDate } from "../../utils";
import { checkNotificationStatus } from "../../utils/notification";
import DetailPresenter from "./detail-presenter";


export default class DetailPage {
  #presenter = null;
  #detailId = null;
  #currentStory = null;

  async render() {
    return `
      <section class="container">
        <button onclick="window.location.href='#/'">Back to Home</button>
        <h1 class="detail-title">Story Detail</h1>
        <div id="story-save-container"></div>
        <div id="story-detail">Loading...</div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new DetailPresenter(parseActivePathname().id, {
      model: getDetailData,
      view: this,
      dbModel: Database,
    });


    this.#presenter.getDataDetail();
  }

  renderSaveButton() {
    document.getElementById('story-save-container').innerHTML =
      generateSaveStoryButtonTemplate()

    document.getElementById('story-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveStory();
      await this.#presenter.showSaveButton();

      const isPushActive = await checkNotificationStatus();

      if (isPushActive) {

        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('Menyimpan story di bookmarks!', {
          body: 'Story telah di simpan',
        });
      } else {
        console.log('Story berhasil disimpan, tapi push notification tidak aktif.');
      }
    });
  }

  renderRemoveButton() {
    document.getElementById('story-save-container').innerHTML =
      generateRemoveStoryButtonTemplate();

    document.getElementById('story-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeStory();
      await this.#presenter.showSaveButton();

      const isPushActive = await checkNotificationStatus();


      if (isPushActive) {

        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('Menghapus story dari bookmarks!', {
          body: 'Story telah di hapus',
        });
      } else {
        console.log('Story berhasil dihapus, tapi push notification tidak aktif.');
      }

    });
  }

  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }
  removeFromBookmarkFailed(message) {
    alert(message);
  }

  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }

  saveToBookmarkFailed(message) {
    alert(message);
  }

  renderLoading() {
    document.querySelector('#story-detail').innerHTML = 'Loading...';
  }

  renderError(message) {
    document.querySelector('#story-detail').innerHTML = `<p>${message}</p>`;

  }

  async renderStory(story) {
    this.#currentStory = story;
    document.querySelector('#story-detail').innerHTML = `
      <img src="${story.photoUrl}" alt="${story.name}" class="story-image">
      <p>${showFormattedDate(story.createdAt)}</p>
      <p>${getTimeAgo(story.createdAt)}</p>
      <h2>${story.name}</h2>
      <p>${story.description}</p>
    `;

    await this.#presenter.showSaveButton();
  }


}
