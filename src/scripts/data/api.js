import CONFIG from '../config';

const ENDPOINTS = {
  ENDPOINT_REGISTER: `${CONFIG.BASE_URL}/register`,
  ENDPOINT_LOGIN: `${CONFIG.BASE_URL}/login`,
  ENDPOINT_GET_DATA: `${CONFIG.BASE_URL}/stories`,
  ENDPOINT_GET_DETAIL_DATA: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  ENDPOINT_ADD_DATA: `${CONFIG.BASE_URL}/stories`,
  ENDPOINT_NOTIF_SUBS: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export async function getData() {
  const token = localStorage.getItem("authToken");

  try {
    const fetchResponse = await fetch(ENDPOINTS.ENDPOINT_GET_DATA, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });


    return await fetchResponse.json();
  } catch (error) {
    return {
      error: true,
      message: error.message
    };
  }
}

export async function getDetailData(id) {
  const token = localStorage.getItem("authToken");

  try {
    const fetchResponse = await fetch(ENDPOINTS.ENDPOINT_GET_DETAIL_DATA(id), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    return await fetchResponse.json();
  } catch (error) {
    return {
      error: true,
      message: error.message
    };
  }
}


export async function register(name, email, password) {

  const response = await fetch(ENDPOINTS.ENDPOINT_REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const result = await response.json();
  return result;
}

export async function login(email, password) {
  const response = await fetch(ENDPOINTS.ENDPOINT_LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();
  return result;
}

export async function addStory(formData) {
  const token = localStorage.getItem("authToken");

  const allowedFormData = new FormData();

  if (formData.get("description")) {
    allowedFormData.append("description", formData.get("description"));
  }

  if (formData.get("photo")) {
    allowedFormData.append("photo", formData.get("photo"));
  }

  if (formData.get("lat")) {
    allowedFormData.append("lat", formData.get("lat"));
  }
  if (formData.get("lon")) {
    allowedFormData.append("lon", formData.get("lon"));
  }

  try {
    const response = await fetch(ENDPOINTS.ENDPOINT_ADD_DATA, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: allowedFormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    return {
      error: true,
      message: error.message || "Terjadi kesalahan. Coba lagi."
    };
  }
}


const VAPID_KEY = "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const token = localStorage.getItem("authToken");
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT_NOTIF_SUBS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const token = localStorage.getItem("authToken");
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}