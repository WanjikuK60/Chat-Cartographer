const $ = (selector) => document.querySelector(selector);
const store = { signals: [], socket: null, nick: '', channel: '' };
const landmarks = $('#landmarks');
const feed = $('#signal-feed');
const colors = ['THEORY', 'DISCOVERY', 'MOMENT'];

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
function guessType(text) {
  if (/found|discovered|there's|there is|look at|hidden|secret/i.test(text)) return 'DISCOVERY';
  if (/!|wow|clutch|amazing|no way|lets go|let's go/i.test(text)) return 'MOMENT';
  return 'THEORY';
}
function addSignal(text, user = 'viewer', type = guessType(text)) {
  const clean = text.trim().replace(/\s+/g, ' ').slice(0, 100);
  if (clean.length < 2) return;
  store.signals.unshift({ id: crypto.randomUUID(), text: clean, user: user.slice(0, 24), type, time: new Date() });
  store.signals = store.signals.slice(0, 15);
  render();
}
function render() {
  $('#entry-count').textContent = store.signals.length;
  $('#feed-count').textContent = store.signals.length;
  $('#empty-hint').hidden = store.signals.length > 0;
  landmarks.innerHTML = store.signals.slice(0, 5).map((item, index) => `<article class="landmark" data-slot="${index}" data-type="${item.type}"><div class="landmark-type"><span>✦ ${item.type}</span><span>◉</span></div><p class="landmark-text">${escapeHtml(item.text)}</p></article>`).join('');
  feed.innerHTML = store.signals.length ? store.signals.map((item) => `<article class="feed-item"><div class="feed-meta"><b>${escapeHtml(item.user)}</b><span>${item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${item.type}</span></div><p>${escapeHtml(item.text)}</p><button data-remove="${item.id}">ARCHIVE SIGNAL ×</button></article>`).join('') : '<div class="feed-empty">Waiting for your crew to send a signal…</div>';
}
$('#mock-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('#mock-input');
  if (!input.value.trim()) return;
  addSignal(input.value, $('#mock-user').value);
  input.value = '';
  input.focus();
});
feed.addEventListener('click', (event) => {
  const id = event.target.dataset.remove;
  if (!id) return;
  store.signals = store.signals.filter((item) => item.id !== id);
  render();
});
$('#clear-button').addEventListener('click', () => { store.signals = []; render(); });
$('#settings-button').addEventListener('click', () => $('#settings-dialog').showModal());
$('#disconnect-button').addEventListener('click', () => { disconnect(); $('#connection-error').textContent = ''; $('#settings-dialog').close(); });
$('#connect-button').addEventListener('click', connect);

function connect() {
  const channel = $('#channel-input').value.trim().replace(/^#/, '').toLowerCase();
  const username = $('#username-input').value.trim().toLowerCase();
  let token = $('#token-input').value.trim();
  if (!channel || !username || !token) { $('#connection-error').textContent = 'Add a channel name, token account username, and chat OAuth token to connect.'; return; }
  if (!token.startsWith('oauth:')) token = `oauth:${token}`;
  disconnect();
  const socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
  store.socket = socket;
  store.channel = channel;
  $('#connection-error').textContent = 'Connecting…';
  socket.addEventListener('open', () => {
    socket.send(`PASS ${token}`);
    socket.send(`NICK ${username}`);
    socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
    socket.send(`JOIN #${channel}`);
    $('#token-input').value = '';
  });
  socket.addEventListener('message', (event) => {
    for (const line of String(event.data).split('\r\n')) {
      if (line.startsWith('PING')) { socket.send(line.replace('PING', 'PONG')); continue; }
      if (line.includes(' 001 ')) {
        $('#connection-label').textContent = `LIVE · #${channel}`;
        $('#connection-error').textContent = '';
        $('#settings-dialog').close();
      }
      if (line.includes('Login authentication failed') || line.includes('Improperly formatted auth')) {
        $('#connection-error').textContent = 'Twitch rejected that token. Check it and try again.';
        disconnect();
      }
      const match = line.match(/(?:^| ):([^! ]+)!.* PRIVMSG #[^ ]+ :(.*)$/);
      if (!match) continue;
      const message = match[2];
      if (!/^!map\s+/i.test(message)) continue;
      const tags = line.match(/(?:^| )display-name=([^; ]*)/);
      const username = tags?.[1] || match[1];
      addSignal(message.replace(/^!map\s+/i, ''), username);
    }
  });
  socket.addEventListener('error', () => { $('#connection-error').textContent = 'Could not connect to Twitch chat. Check your network and token.'; });
  socket.addEventListener('close', () => {
    if (store.socket === socket) { store.socket = null; $('#connection-label').textContent = 'DEMO MODE'; }
  });
}
function disconnect() {
  if (store.socket) { const socket = store.socket; store.socket = null; socket.close(); }
  $('#connection-label').textContent = 'DEMO MODE';
}
render();
