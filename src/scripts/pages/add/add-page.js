import { addStory } from "../../data/api";
import { base64ToFile } from "../../utils";
import { CameraCapture } from "../../utils/useCamera";
import AddPresenter from "./add-presenter";


import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
  iconUrl: 'images/leaflet/marker-icon.png',
  shadowUrl: 'images/leaflet/marker-shadow.png',
});

export default class AddPage {
  #presenter = null;
  #camera = null;
  #isCameraActive = false;

  render() {
    return `
      <section class="add-story-container">
        <h2 class="title-add">Add New Story</h2>
        <form id="add-story-form" enctype="multipart/form-data">
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required></textarea>
          </div>

          <div class="form-group">
            <div id="camera-preview" class="camera-preview"></div>
            <div class="button-group">
              <button type="button" id="start-btn" class="btn">Start Camera</button>
              <button type="button" id="stop-btn" class="btn" disabled>Stop Camera</button>
              <button type="button" id="capture-btn" class="btn" disabled>Capture Photo</button>
            </div>
          </div>

          <div class="form-group">
            <label for="image-input" class="file-label">Choose an Image</label>
            <span class="file-name">No file chosen</span>
            <input type="file" id="image-input" name="image" accept="image/*">
          </div>

          <div class="form-group">
            <img id="photo-preview" class="photo-preview" style="display:none">
          </div>

          <div class="form-group">
            <label for="location">Pilih Lokasi:</label>
            <div id="map" style="height: 300px;"></div>
            <input type="hidden" id="latitude" name="latitude" />
            <input type="hidden" id="longitude" name="longitude" />
          </div>

          <button type="submit" class="submit-btn">Submit Story</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AddPresenter({
      model: addStory,
      view: this
    });
    this.#camera = new CameraCapture();
    this.#setupForm();
    this.#initMap();
    this.#setupCameraControls();
  }

  #setupForm() {
    const form = document.getElementById("add-story-form");

    form.addEventListener("submit", (e) => this.#presenter.submitForm(e));

    const inputFile = document.getElementById("image-input");
    inputFile.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        document.querySelector(".file-name").textContent = file.name;
        const preview = document.getElementById("photo-preview");
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
      }
    });
  }


  #initMap() {
    const map = L.map("map").setView([-6.200000, 106.816666], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    let marker;

    map.on("click", function (e) {
      const { lat, lng } = e.latlng;

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }

      document.getElementById("latitude").value = lat;
      document.getElementById("longitude").value = lng;
    });
  }


  async initCamera() {
    try {
      if (this.#isCameraActive) {
        this.stopCamera();
      }

      const { video } = await this.#camera.startCamera();
      const preview = document.getElementById("camera-preview");
      preview.innerHTML = "";
      preview.appendChild(video);

      this.#isCameraActive = true;
      document.getElementById("capture-btn").disabled = false;
      document.getElementById("stop-btn").disabled = false;

      console.log('cammera');

    } catch (error) {
      alert("Camera access failed.");
    }
  }

  stopCamera() {
    this.#camera.stopCamera();
    this.#isCameraActive = false;
    const preview = document.getElementById("camera-preview");
    preview.innerHTML = "";
    document.getElementById("capture-btn").disabled = true;
    document.getElementById("stop-btn").disabled = true;

  }

  async capturePhoto() {
    const blob = await this.#camera.capturePhoto();
    const preview = document.getElementById("photo-preview");
    preview.src = blob;
    preview.style.display = "block";
    this.photoBlob = blob;

    const fileNameSpan = document.querySelector(".file-name");
    fileNameSpan.textContent = "captured-image.jpg";

    this.stopCamera();
  }

  #setupCameraControls() {
    const startBtn = document.getElementById("start-btn");
    const captureBtn = document.getElementById('capture-btn');
    const stopBtn = document.getElementById("stop-btn");


    startBtn.addEventListener("click", () => this.initCamera());
    stopBtn.addEventListener("click", () => this.stopCamera());
    captureBtn.addEventListener("click", () => this.capturePhoto());
  }

  getBlobPhoto() {
    const fileCapture = base64ToFile(this.photoBlob, 'capture-image.jpg');


    return fileCapture;
  }

}
