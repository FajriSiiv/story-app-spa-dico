import Database from "../../database";
import { getTimeAgo, showFormattedDate } from "../../utils";
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
  iconUrl: 'images/leaflet/marker-icon.png',
  shadowUrl: 'images/leaflet/marker-shadow.png',
});

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

        if (data.listStory) {
          await Database.saveOfflineStories(data.listStory);
        }
      } else {
        data = {
          listStory: await Database.getOfflineStories(),
        };
        if (!data.listStory || !data.listStory.length) {
          storiesContainer.innerHTML = '<p>No stories available. Please check back when you are online.</p>';
          return;
        }
      }
      const sortedStories = data.listStory.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      this.renderStories(storiesContainer, sortedStories);
      this.initializeMap(mapContainer, sortedStories);
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
