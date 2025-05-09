export default class AddPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.lat = -6.200000;
    this.lon = 106.816666;
    this.photoBlob = null;
    this.map = null;
    this.marker = null;
    this.#model = model;
    this.#view = view;
  }

  async submitForm(event) {
    event.preventDefault();
    const form = event.target;
    const description = form.description.value;
    const lat = this.lat;
    const lon = this.lon;
    const fileInput = document.getElementById("image-input");
    const photo = fileInput.files[0] || this.#view.getBlobPhoto();
    if (!photo) {
      alert("Please select or capture a photo.");
      return;
    }
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    formData.append("lat", lat);
    formData.append("lon", lon);
    try {

      // await this.#model(formData);
      alert("Story submitted successfully!");

      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();

      if (subscription) {
        reg.showNotification('Story berhasil dibuat!', {
          body: `Anda telah membuat story baru dengan deskripsi: ${description}`,
        });
      } else {
        console.log('No active subscription found. Skipping push notification.');
      }


      // window.location.hash = "/";
    } catch (error) {
      alert("Failed to submit story.");
    }
  }
}
