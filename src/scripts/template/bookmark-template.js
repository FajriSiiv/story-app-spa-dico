import { getTimeAgo } from "../utils";

export function bookmarkLink() {
  return `
    <a href="/#/bookmarks">Bookmark</a>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader-absolute">
      <div class="spinner"></div>
    </div>
  `;
}

export function generateStoryItemTemplate({ id, name, description, photoUrl, time }) {
  return `  
    <div class="story-item" id="story-${id}">
      <img src="${photoUrl}" alt="${description}" />
      <div>
        <h2 class="story-title">${name}</h2>
        <p class="story-description">${description}</p>
        <p class="story-time">${getTimeAgo(time)}</p>
        <button onclick="window.location.href='#/story/detail/${id}'">Cek Story</button>
      </div>
    </div>
  `;
}

export function generateStorysListEmptyTemplate() {
  return `
    <div class="story-empty">
      <p>Belum ada story yang disimpan.</p>
    </div>
  `;
}

export function generateStorysListErrorTemplate(message) {
  return `
    <div class="storys-error">
      <p>Terjadi kesalahan: ${message}</p>
    </div>
  `;
}
