import { openDB } from 'idb';

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
    return db.get(OBJECT_STORE_NAME, id);
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

  async saveOfflineStories(stories) {
    const db = await dbPromise;
    const tx = db.transaction(OBJECT_STORE_OFFLINE, 'readwrite');
    const store = tx.objectStore(OBJECT_STORE_OFFLINE);
    for (const story of stories) {
      await store.put(story);
    }
    await tx.done;
  },

  async getOfflineStories() {
    const db = await dbPromise;
    return db.getAll(OBJECT_STORE_OFFLINE);
  },
};

export default Database;
