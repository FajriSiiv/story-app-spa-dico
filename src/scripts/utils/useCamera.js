export class CameraCapture {
  constructor() {
    this.videoElement = document.createElement('video');
    this.canvasElement = document.createElement('canvas');
    this.photoElement = document.createElement('img');
    this.stream = null;
  }

  async startCamera() {
    try {

      if (this.stream) {
        this.stopCamera();
      }


      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 400 },
          aspectRatio: 16 / 9
        },

        audio: false
      });

      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();

      const track = this.stream.getVideoTracks()[0];
      const settings = track.getSettings();
      this.canvasElement.width = settings.width;
      this.canvasElement.height = settings.height;

      return { video: this.videoElement, canvas: this.canvasElement };

    } catch (error) {
      throw new Error("Tidak dapat mengakses kamera");
    }
  }

  capturePhoto() {
    if (!this.stream) {
      throw new Error("Kamera belum diinisialisasi");
    }

    const context = this.canvasElement.getContext('2d');
    context.drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);

    return this.canvasElement.toDataURL('image/jpeg', 0.8);
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;

      if (this.videoElement.srcObject) {
        this.videoElement.srcObject = null;
      }
    }
  }

  dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
}