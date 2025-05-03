export default class DetailPresenter {
  #model;
  #view;
  #detailId;
  #dbModel;

  constructor(detailId, { model, view, dbModel }) {
    this.#model = model;
    this.#view = view;
    this.#detailId = detailId;
    this.#dbModel = dbModel;
  }

  async getDataDetail() {
    this.#view.renderLoading();

    try {

      const checkInBookmark = await this.#dbModel.getStoryById(this.#detailId);
      const offlineStory = await this.#dbModel.getOfflineStoryById(this.#detailId);


      if (navigator.onLine) {
        const data = await this.#model(this.#detailId);
        if (data.error) {
          this.#view.renderError(data.message);
        } else {
          this.#view.renderStory(data);
        }
      } else {
        if (checkInBookmark) {
          this.#view.renderStory(checkInBookmark);
          return;
        }

        if (offlineStory) {
          this.#view.renderStory(offlineStory);
          return;
        }
      }


    } catch (error) {
      this.#view.renderError('Gagal menampilkan cerita: ' + (error.message || 'Tidak diketahui'));
    }
  }

  async saveStory() {
    try {
      const offlineStory = await this.#dbModel.getOfflineStoryById(this.#detailId);
      console.log(offlineStory);

      if (offlineStory) {
        await this.#dbModel.putStory(offlineStory);

        if (offlineStory.photoUrl) {
          try {
            const cache = await caches.open('bookmark-images');
            const match = await cache.match(offlineStory.photoUrl);

            if (!match) {
              await cache.add(offlineStory.photoUrl);
            }
            console.log(`Gambar ${offlineStory.photoUrl} berhasil dicache`);
          } catch (cacheError) {
            console.error('Gagal mencache gambar:', cacheError);
          }
        }

        this.#view.saveToBookmarkSuccessfully('Berhasil disimpan secara offline.');
        return;
      }


      const story = await this.#model(this.#detailId);

      if (story.photoUrl) {
        try {
          const cache = await caches.open('bookmark-images');
          const match = await cache.match(story.photoUrl);

          if (!match) {
            await cache.add(story.photoUrl);
          }

          console.log(`Gambar ${story.photoUrl} berhasil dicache`);

        } catch (cacheError) {
          console.error('Gagal mencache gambar:', cacheError);
        }
      }

      console.log(story);

      if (!story) {
        throw new Error('Story tidak ditemukan dari server.');
      }

      await this.#dbModel.putStory(story);
      this.#view.saveToBookmarkSuccessfully('Berhasil disimpan dari online.');
    } catch (error) {
      this.#view.saveToBookmarkFailed(error.message);
    }
  }


  async removeStory() {
    try {
      await this.#dbModel.removeStory(this.#detailId);
      this.#view.removeFromBookmarkSuccessfully('Success to remove from bookmark');
    } catch (error) {
      this.#view.removeFromBookmarkFailed(error.message);
    }
  }

  async showSaveButton() {
    const story = await this.#dbModel.getStoryById(this.#detailId);
    if (story) {
      this.#view.renderRemoveButton();
    } else {
      this.#view.renderSaveButton();
    }
  }

}
