const KEY = 'blogdungaucher.cookieConsent.v1';
let queue = Promise.resolve();
const confirmed = new Map();

export function readPushPreference() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || 'null');
    // Migrate the former button flag once; both controls then share KEY.
    if (localStorage.getItem('push_subscribed') === '1') {
      persist(true);
      return true;
    }
    return value?.notifications === true;
  } catch { return false; }
}
function persist(enabled) {
  const preference = { notifications: enabled, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(preference));
  localStorage.removeItem('push_subscribed');
  document.dispatchEvent(new CustomEvent('push:updated', { detail: preference }));
}
function bytes(key) {
  const raw = atob(key.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}
function currentKey(sub, key) {
  const actual = sub.options.applicationServerKey;
  const expected = bytes(key);
  return !!actual && actual.byteLength === expected.length && new Uint8Array(actual).every((b, i) => b === expected[i]);
}
async function request(route, body) {
  const response = await fetch(`/push/${route}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Notifications : HTTP ${response.status}`);
}
function registerSubscription(subscription) {
  const endpoint = subscription.endpoint;
  if (!confirmed.has(endpoint)) {
    const pending = request('subscribe', subscription.toJSON()).catch(error => {
      confirmed.delete(endpoint); throw error;
    });
    confirmed.set(endpoint, pending);
  }
  return confirmed.get(endpoint);
}
async function ready() {
  let timer;
  try {
    return await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Service indisponible')), 10_000); }),
    ]);
  } finally { clearTimeout(timer); }
}
export function setPushEnabled(enabled, vapidKey, { interactive = true } = {}) {
  const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  // Request permission while the user's click is still active (Safari).
  const permission = enabled && supported && interactive
    ? Notification.requestPermission().catch(() => 'denied') : Promise.resolve(supported ? Notification.permission : 'denied');
  const operation = async () => {
    if (!supported) {
      if (enabled) throw new Error('Notifications indisponibles');
      persist(false); return false;
    }
    if (enabled && (!vapidKey || await permission !== 'granted')) throw new Error('Notifications non autorisées');
    const registration = await ready();
    let subscription = await registration.pushManager.getSubscription();
    if (subscription && (!enabled || !currentKey(subscription, vapidKey))) {
      // Keep the browser subscription available for retry until server removal succeeds.
      await request('unsubscribe', { endpoint: subscription.endpoint });
      confirmed.delete(subscription.endpoint);
      if (!await subscription.unsubscribe()) throw new Error('Désabonnement incomplet');
      subscription = null;
    }
    if (enabled) {
      subscription ||= await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: bytes(vapidKey) });
      await registerSubscription(subscription);
    }
    persist(enabled);
    return enabled;
  };
  const result = queue.then(operation);
  queue = result.catch(() => {});
  return result;
}
export async function getPushActive(vapidKey) {
  if (!readPushPreference() || !('serviceWorker' in navigator) || !('Notification' in window) || Notification.permission !== 'granted') return false;
  const subscription = await (await ready()).pushManager.getSubscription();
  if (!subscription || !currentKey(subscription, vapidKey)) return false;
  await registerSubscription(subscription);
  return true;
}
