# Chat Cartographer

Chat Cartographer turns Twitch chat messages into a shared, live field map. Viewers post `!map <thought>`; the signal appears on the map and in the recent-signal feed. Streamers can archive individual signals or clear the map.

## Run the demo

On Windows, double-click `START-CHAT-CARTOGRAPHER.bat`, or open `index.html` in a modern browser. The **Try it out** form works without Twitch credentials.

## Connect Twitch chat

The app connects to Twitch IRC over TLS in the browser. It currently expects a user OAuth access token with the IRC `chat:read` scope.

1. Use Twitch's [official CLI setup guide](https://dev.twitch.tv/docs/cli/) to install and configure Twitch CLI. The Windows launcher scripts use `twitch.exe` from `tools/` if present, otherwise they use `twitch` on your PATH.
2. Run `GET-TWITCH-TOKEN.bat` and authorize the request in Twitch.
3. In Chat Cartographer, open the gear menu. Enter the channel name, the username of the account that authorized the token, and the token.
4. Send `!map your thought here` in that channel's chat.

Tokens are held in browser memory only and cleared from the input after connecting. They are not written to local storage or sent to this project's server. Never commit or share an OAuth token or client secret.

## Behavior

- Only chat messages that start with `!map` are used.
- Messages are limited to 100 characters; the feed retains the 15 newest signals.
- A keyword heuristic labels signals **Theory**, **Discovery**, or **Moment**.
- Message text is escaped before rendering.
- A demo input is available for testing without Twitch credentials.

## Demo video outline

For the hackathon demo, show a Twitch chat message using `!map`, its signal appearing on the map, the archive/clear interaction, and a brief view of the project being built with Codex. Keep the public YouTube video under three minutes.

## Limitations

This is a hackathon proof of concept. OAuth authorization is currently handled outside the app with Twitch CLI; moderator roles, persistent storage, and automatic safety moderation are not implemented. Incoming chat text is untrusted, so a live deployment should add moderator controls and rate limits. Google Fonts load from the network, with system font fallbacks.
