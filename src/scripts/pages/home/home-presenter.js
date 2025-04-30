import Database from "../../database";
import { getTimeAgo, showFormattedDate } from "../../utils";

export default class HomePresenter {
  #model;

  constructor({ model }) {
    this.#model = model;
  }

  async init() {
    const storiesContainer = document.getElementById("stories-container");
    const mapContainer = document.getElementById("map-leaflet");

    try {
      let data;
      if (navigator.onLine) {
        data = await this.#model();
        console.log(data);

        if (data.listStory) {
          await Database.saveOfflineStories(data.listStory);
        }
      } else {
        console.error('Fetch online failed, fallback to offline data');
        data = {
          listStory: await Database.getOfflineStories(),
        };

        if (!data.listStory || !data.listStory.length) {
          storiesContainer.innerHTML = '<p>No stories available. Please check back when you are online.</p>';
          return;
        }
      }

      this.renderStories(storiesContainer, data.listStory);
      this.initializeMap(mapContainer, data.listStory);
    } catch (error) {
      storiesContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
      console.error('Error fetching stories:', error);
    }
  }

  renderStories(storiesContainer, listStory) {
    storiesContainer.innerHTML = listStory.map((story) => `
      <div class="story-card">
        <img src="${story.photoUrl}" alt="${story.name} image" class="story-image">
        <h2>${story.name}</h2>
        <p>${showFormattedDate(story.createdAt)}</p>
        <p>${getTimeAgo(story.createdAt)}</p>
        <p>${story.description.slice(0, 30)}</p>
        <a href="/#/story/detail/${story.id}" class="detail-link">View Details</a>
      </div>
    `).join('');
  }

  initializeMap(mapContainer, listStory) {
    const map = L.map(mapContainer).setView([-6.2088, 106.8456], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    listStory.forEach(story => {
      const { lat, lon } = story;
      if (lat && lon) {
        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`
          <strong>${story.name}</strong><br>
          <p>${showFormattedDate(story.createdAt)}</p><br>
          <img src="${story.photoUrl}" alt="${story.name}" style="width: 100px; height: auto;"><br>
          ${story.description}
        `);
      }
    });
  }
}
