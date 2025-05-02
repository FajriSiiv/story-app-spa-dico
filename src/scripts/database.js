import { openDB } from 'idb';
import { getTimeAgo, showFormattedDate } from './utils';

const DATABASE_NAME = 'story-apps';
const DATABASE_VERSION = 2;
const OBJECT_STORE_NAME = 'saved-story';
const OBJECT_STORE_OFFLINE = 'offline-story';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade: (database) => {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, {
        keyPath: 'id',
      });
    }
    if (!database.objectStoreNames.contains(OBJECT_STORE_OFFLINE)) {
      database.createObjectStore(OBJECT_STORE_OFFLINE, {
        keyPath: 'id',
      });
    }
  },
});

const Database = {
  async putStory(story) {
    if (!story || !Object.hasOwn(story, 'id')) {
      throw new Error('`id` is required to save.');
    }
    const db = await dbPromise;
    return db.put(OBJECT_STORE_NAME, story);
  },

  async getStoryById(id) {
    if (!id) {
      throw new Error('`id` is required.');
    }
    const db = await dbPromise;
    console.log(db, 'db');
    console.log(`Fetching story with id: ${id}`);

    const story = await db.get(OBJECT_STORE_NAME, id);
    if (!story) {
      console.log(`Story dengan ID ${id} tidak ditemukan.`);
    }
    return story;
  },

  async getAllStorys() {
    const db = await dbPromise;
    return db.getAll(OBJECT_STORE_NAME);
  },

  async removeStory(id) {
    if (!id) {
      throw new Error('`id` is required.');
    }
    const db = await dbPromise;
    return db.delete(OBJECT_STORE_NAME, id);
  },

  // async saveOfflineStories(stories) {
  //   try {
  //     const db = await dbPromise;
  //     {
  //       const txClear = db.transaction(OBJECT_STORE_OFFLINE, 'readwrite');
  //       const storeClear = txClear.objectStore(OBJECT_STORE_OFFLINE);
  //       await storeClear.clear();
  //       await txClear.done;
  //     }

  //     const sortedStories = stories.sort((a, b) => b.createdAt - a.createdAt);

  //     {
  //       const tx = db.transaction(OBJECT_STORE_OFFLINE, 'readwrite');
  //       const store = tx.objectStore(OBJECT_STORE_OFFLINE);

  //       for (const story of sortedStories) {
  //         await store.put({
  //           ...story,
  //           createdAt: story.createdAt || Date.now(),
  //           id: story.id,
  //         });
  //       }

  //       await tx.done;
  //     }
  //   } catch (err) {
  //     console.error('Error saat saveOfflineStories:', err);
  //   }
  // },

  async saveOfflineStories(stories) {
    try {
      const db = await dbPromise;

      // Bersihkan data lama dulu
      const txClear = db.transaction(OBJECT_STORE_OFFLINE, 'readwrite');
      const storeClear = txClear.objectStore(OBJECT_STORE_OFFLINE);
      await storeClear.clear();
      await txClear.done;

      // Ambil gambar sebagai Blob dan simpan
      const sortedStories = stories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const storiesWithImages = await Promise.all(
        sortedStories.map(async (story) => {
          try {
            const response = await fetch(story.photoUrl);
            const imageBlob = await response.blob();
            return {
              ...story,
              imageBlob,
              createdAt: story.createdAt || Date.now(),
            };
          } catch (error) {
            console.warn(`Gagal mengambil gambar untuk story ${story.id}:`, error);
            return {
              ...story,
              imageBlob: null,
              createdAt: story.createdAt || Date.now(),
            };
          }
        })
      );

      const tx = db.transaction(OBJECT_STORE_OFFLINE, 'readwrite');
      const store = tx.objectStore(OBJECT_STORE_OFFLINE);

      for (const story of storiesWithImages) {
        await store.put(story);
      }

      await tx.done;
    } catch (err) {
      console.error('Error saat saveOfflineStories:', err);
    }
  },


  async getOfflineStories() {
    const db = await dbPromise;
    return db.getAll(OBJECT_STORE_OFFLINE);
  },

  async getOfflineStoryById(id) {
    const db = await dbPromise;
    return db.get(OBJECT_STORE_OFFLINE, id);
  }
};

export default Database;
