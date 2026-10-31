# Chat Cartographer — Demo Video Plan

**Target length: 2 minutes 20 seconds. Maximum allowed: 3 minutes.** Record with the working Twitch channel and Chat Cartographer visible. Keep the Twitch OAuth token and any Client Secret off-screen.

## Shot list and narration

**0:00–0:15 — Introduce the idea**  
Show Chat Cartographer beside the Twitch stream. Say: “Chat Cartographer turns chat’s best theories, discoveries, and moments into a shared live map.”

**0:15–0:50 — Prove the Twitch connection**  
Show the channel’s chat and send `!map hello` or a more meaningful thought. Show the message appear on the map and in Recent Signals. Say: “Viewers add a signal with one chat command; the map labels it and makes it visible to everyone.”

**0:50–1:15 — Show streamer controls**  
Send another signal, archive one, and clear the map if time permits. Explain that chat text is limited and only `!map` messages are used.

**1:15–1:50 — Explain the build**  
Show the project files and a Codex moment: the implementation or a brief interaction showing how Codex helped plan, build, and debug the Twitch-connected prototype. Do not show secrets or tokens.

**1:50–2:20 — Close with impact and current limits**  
Say: “The prototype is built with HTML, CSS, JavaScript, Twitch IRC, Twitch CLI, and OpenAI Codex. It’s designed to help a streamer surface community ideas without losing the pace of the stream. OAuth is currently set up with Twitch CLI; moderation and persistence are future work.”

## Before recording

- Start the project with `START-CHAT-CARTOGRAPHER.bat`.
- Confirm the app shows `LIVE · #channel` and the Twitch test signal appears.
- Arrange Twitch chat, the stream, and the map so the interaction is readable.
- Close token and developer-console windows; ensure no credentials appear in the capture.
- Do not add copyrighted music, third-party logos, or other third-party marks unless you have permission. Keep the recording focused on the project UI and chat interaction.
- Keep the final video under three minutes, upload it to YouTube, and set visibility to **Public**.
