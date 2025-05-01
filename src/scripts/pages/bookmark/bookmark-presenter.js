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

      const storyResults = await Promise.allSettled(
        listOfStorys.map(async (story) => {
          try {
            return await getDetailData(story.id);
          } catch (error) {
            if (error.response?.status === 404) {
              console.warn(`Story dengan ID ${story.id} tidak ditemukan.`);
              return null;
            }
            throw error;
          }
        })
      );

      const successfulStorys = storyResults
        .filter((result) => result.status === 'fulfilled' && result.value !== null)
        .map((result) => result.value);

      const sortedStorys = successfulStorys.sort((a, b) => {
        return new Date(b.story.createdAt) - new Date(a.story.createdAt);
      });

      if (sortedStorys.length === 0) {
        throw new Error('Tidak ada story yang berhasil dimuat.');
      }

      const message = 'Berhasil mendapatkan daftar story tersimpan.';
      this.#view.populateBookmarkedStorys(message, sortedStorys);
    } catch (error) {
      console.error('initialStorysAndMap: error:', error);
      this.#view.populateBookmarkedStorysError(error.message);
    } finally {
      this.#view.hideStorysListLoading();
    }
  }


}