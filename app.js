const TWITCH_IRC_URL = "wss://irc-ws.chat.twitch.tv:443";
const MAP_COMMAND = /^!map\s+/i;
const MAX_SIGNALS = 15;
const MAX_LANDMARKS = 5;
const MAX_TEXT_LENGTH = 100;
const MAX_USER_LENGTH = 24;

const $ = (selector) => document.querySelector(selector);

const store = { signals: [], socket: null };

const landmarks = $("#landmarks");
const feed = $("#signal-feed");
const connectionLabel = $("#connection-label");
const connectionError = $("#connection-error");
const settingsDialog = $("#settings-dialog");

// ---------- Signals ----------

function escapeHtml(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, (char) => entities[char]);
}

function guessType(text) {
  if (/found|discovered|there's|there is|look at|hidden|secret/i.test(text)) return "DISCOVERY";
  if (/!|wow|clutch|amazing|no way|lets go|let's go/i.test(text)) return "MOMENT";
  return "THEORY";
}

function addSignal(text, user = "viewer") {
  const clean = text.trim().replace(/\s+/g, " ").slice(0, MAX_TEXT_LENGTH);
  if (clean.length < 2) return;

  store.signals.unshift({
    id: crypto.randomUUID(),
    text: clean,
    user: user.slice(0, MAX_USER_LENGTH),
    type: guessType(clean),
    time: new Date(),
  });
  store.signals = store.signals.slice(0, MAX_SIGNALS);
  render();
}

function removeSignal(id) {
  store.signals = store.signals.filter((signal) => signal.id !== id);
  render();
}

function clearSignals() {
  store.signals = [];
  render();
}

// ---------- Rendering ----------

function landmarkHtml(signal, slot) {
  return `
    <article class="landmark" data-slot="${slot}" data-type="${signal.type}">
      <div class="landmark-type"><span>✦ ${signal.type}</span><span>◉</span></div>
      <p class="landmark-text">${escapeHtml(signal.text)}</p>
    </article>`;
}

function feedItemHtml(signal) {
  const time = signal.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `
    <article class="feed-item">
      <div class="feed-meta"><b>${escapeHtml(signal.user)}</b><span>${time} · ${signal.type}</span></div>
      <p>${escapeHtml(signal.text)}</p>
      <button type="button" data-remove="${signal.id}">ARCHIVE SIGNAL ×</button>
    </article>`;
}

function render() {
  const count = store.signals.length;
  $("#entry-count").textContent = count;
  $("#feed-count").textContent = count;
  $("#empty-hint").hidden = count > 0;

  landmarks.innerHTML = store.signals.slice(0, MAX_LANDMARKS).map(landmarkHtml).join("");
  feed.innerHTML = count
    ? store.signals.map(feedItemHtml).join("")
    : '<div class="feed-empty">Waiting for your crew to send a signal…</div>';
}

// ---------- Twitch chat ----------

/**
 * Turn one raw Twitch IRC line into a chat message, or null if it is not one.
 * Example line:
 * @badge-info=;display-name=Orbit_Ada;... :orbit_ada!orbit_ada@orbit_ada.tmi.twitch.tv PRIVMSG #chan :!map hello
 */
function parseChatLine(line) {
  const message = line.match(/(?:^| ):([^! ]+)![^ ]* PRIVMSG #[^ ]+ :(.*)$/);
  if (!message) return null;

  const [, login, text] = message;
  // Tags start with "@" and are separated by ";", so display-name follows one of those.
  const displayName = line.match(/(?:^@|;)display-name=([^; ]*)/)?.[1];
  return { user: displayName || login, text };
}

function handleChatData(socket, data) {
  for (const line of String(data).split("\r\n")) {
    if (line.startsWith("PING")) {
      socket.send(line.replace("PING", "PONG"));
      continue;
    }
    if (line.includes(" 001 ")) {
      connectionLabel.textContent = `LIVE · #${store.channel}`;
      connectionError.textContent = "";
      settingsDialog.close();
    }
    if (
      line.includes("Login authentication failed") ||
      line.includes("Improperly formatted auth")
    ) {
      connectionError.textContent = "Twitch rejected that token. Check it and try again.";
      disconnect();
      return;
    }

    const chat = parseChatLine(line);
    if (chat && MAP_COMMAND.test(chat.text)) {
      addSignal(chat.text.replace(MAP_COMMAND, ""), chat.user);
    }
  }
}

function connect() {
  const channel = $("#channel-input").value.trim().replace(/^#/, "").toLowerCase();
  const username = $("#username-input").value.trim().toLowerCase();
  let token = $("#token-input").value.trim();

  if (!channel || !username || !token) {
    connectionError.textContent =
      "Add a channel name, token account username, and chat OAuth token to connect.";
    return;
  }
  if (!token.startsWith("oauth:")) token = `oauth:${token}`;

  disconnect();
  const socket = new WebSocket(TWITCH_IRC_URL);
  store.socket = socket;
  store.channel = channel;
  connectionError.textContent = "Connecting…";

  socket.addEventListener("open", () => {
    socket.send(`PASS ${token}`);
    socket.send(`NICK ${username}`);
    socket.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
    socket.send(`JOIN #${channel}`);
    $("#token-input").value = ""; // never keep the token in the page
  });
  socket.addEventListener("message", (event) => handleChatData(socket, event.data));
  socket.addEventListener("error", () => {
    connectionError.textContent = "Could not connect to Twitch chat. Check your network and token.";
  });
  socket.addEventListener("close", () => {
    if (store.socket === socket) disconnect();
  });
}

function disconnect() {
  const socket = store.socket;
  store.socket = null;
  if (socket) socket.close();
  connectionLabel.textContent = "DEMO MODE";
}

// ---------- Event wiring ----------

$("#mock-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("#mock-input");
  if (!input.value.trim()) return;
  addSignal(input.value, $("#mock-user").value);
  input.value = "";
  input.focus();
});

feed.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (button) removeSignal(button.dataset.remove);
});

$("#clear-button").addEventListener("click", clearSignals);
$("#settings-button").addEventListener("click", () => settingsDialog.showModal());
$("#connect-button").addEventListener("click", connect);
$("#disconnect-button").addEventListener("click", () => {
  disconnect();
  connectionError.textContent = "";
  settingsDialog.close();
});

render();
