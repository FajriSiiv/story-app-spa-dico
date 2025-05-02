import { getDetailData } from "../../data/api";

export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialStorysAndMap() {
    this.#view.showStorysListLoading();

    try {
      const listOfStorys = await this.#model.getAllStorys();

      const storys = await Promise.all(
        listOfStorys
          .filter(story => story && story.id)
          .map(async (story) => {
            if (navigator.onLine) {
              const onlineStory = await getDetailData(story.id);
              return onlineStory ? onlineStory : null;
            } else {
              const offlineStory = await this.#model.getStoryById(story.id);
              return offlineStory ? offlineStory : null;
            }
          })
      );

      console.log('Processed stories:', storys);

      const message = 'Berhasil mendapatkan daftar story tersimpan.';
      this.#view.populateBookmarkedStorys(message, storys);
    } catch (error) {
      console.error('initialStorysAndMap: error:', error);
      this.#view.populateBookmarkedStorysError(error.message);
    } finally {
      this.#view.hideStorysListLoading();

    }
  }
}