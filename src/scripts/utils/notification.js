import { subscribePushNotification } from "../data/api";

export function notifyRequest() {
  if (!('Notification' in window)) {
    alert('Browser tidak mendukung notifikasi.');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification('Halo!', {
      body: 'Mengaktifkan notifikasi website',
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('Notifikasi aktif!', {
          body: 'Terima kasih telah mengaktifkan notifikasi.',
        });
      }
    });
  }
}



export function convertBase64ToUint8Array(base64String) {
  const base64 = base64String
    .padEnd(base64String.length + ((4 - (base64String.length % 4)) % 4), '=')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);

  return new Uint8Array(rawData.split('').map((char) => char.charCodeAt(0)));
}



export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    alert('Izin notifikasi ditolak.');
    return false;
  }

  if (status === 'default') {
    alert('Izin notifikasi ditutup atau diabaikan.');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}

export async function getPushUnSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  const isSubscribed = await registration.pushManager.getSubscription();

  return isSubscribed.unsubscribe()
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

const VAPID_KEY = "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"


export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_KEY),
  };
}

export async function subscribe() {

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Izin push notification tidak diberikan.');
    return;
  }

  const failureSubscribeMessage = 'Langganan push notification gagal diaktifkan.';
  const successSubscribeMessage = 'Langganan push notification berhasil diaktifkan.';
  let pushSubscription;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });


    if (!response.ok) {
      console.error('subscribe: response:', response);
      alert(failureSubscribeMessage);
      await pushSubscription.unsubscribe();
      return;
    }

    alert(successSubscribeMessage);
  } catch (error) {
    console.error('subscribe: error:', error);
    alert(failureSubscribeMessage);

    await pushSubscription.unsubscribe();
  }

}

export async function checkNotificationStatus() {
  if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notification tidak didukung browser ini.');
    return false;
  }

  const permission = Notification.permission;
  if (permission !== 'granted') {
    console.log('User belum mengizinkan notifikasi.');
    return false;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    console.log('Service worker belum terdaftar.');
    return false;
  }

  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    console.log('User belum subscribe push notification.');
    return false;
  }

  const { endpoint, keys } = subscription.toJSON();
  if (!endpoint || !keys?.auth || !keys?.p256dh) {
    console.log('Subscription tidak valid.');
    return false;
  }

  console.log('Push notification AKTIF.');
  return true;
}



export async function unsubscribe() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await subscription.unsubscribe();
  } else {
    console.log('No active subscription found.');
  }

  const newSubscription = await registration.pushManager.getSubscription();
  if (newSubscription === null) {
    console.log('No active subscription found after unsubscribe.');
  } else {
    console.log('Subscription still exists.');
  }
}