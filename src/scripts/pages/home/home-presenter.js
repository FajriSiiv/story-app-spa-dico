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
      const data = await this.#model();

      storiesContainer.innerHTML = data.listStory.map((story) => `
        <div class="story-card">
          <img src="${story.photoUrl}" alt="${story.name} image" class="story-image">
          <h2>${story.name}</h2>
          <p>${showFormattedDate(story.createdAt)}</p>
          <p>${getTimeAgo(story.createdAt)}</p>
          <p>${story.description.slice(0, 30)}</p>
          <a href="/#/story/detail/${story.id}" class="detail-link">View Details</a>
        </div>
      `).join('');

      const map = L.map(mapContainer).setView([-6.2088, 106.8456], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      data.listStory.forEach(story => {
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

    } catch (error) {
      storiesContainer.innerHTML = `<p>${error}</p>`;
    }
  }
}
