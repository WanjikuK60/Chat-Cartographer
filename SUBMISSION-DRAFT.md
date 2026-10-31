# Chat Cartographer — Submission Draft

## Tagline
Turn fast-moving Twitch chat into a shared map of the stream’s best theories, discoveries, and moments.

## Project description

Chat Cartographer gives a Twitch community a visual way to leave its mark on a live stream. Viewers type `!map` followed by a short thought in chat, and the message appears as a signal on a shared field map. A lightweight keyword heuristic labels each signal as a Theory, Discovery, or Moment. The streamer can archive individual signals or clear the map, while a recent-signal feed keeps the latest community contributions visible.

The prototype connects to Twitch IRC over a secure WebSocket and listens for `!map` messages. It also includes a demo mode that lets someone try the interaction without Twitch credentials. Messages are limited to 100 characters, rendered as escaped text, and kept in a small in-memory feed. OAuth is handled with Twitch CLI for this prototype; the browser holds the token only for its current session.

I used OpenAI Codex throughout the build: to shape the project from the hackathon brief, create the interface and chat-to-map interaction, add the Twitch IRC connection, and work through setup issues. I then connected the app to a Twitch channel and confirmed that a real `!map hello` chat message appeared on the map.

Chat Cartographer is a proof of concept. It does not yet include persistent storage, automatic moderation, or a built-in OAuth authorization flow. The current heuristic categorization is intentionally simple so the streamer can focus on community signals during a live stream.

## Built with

HTML, CSS, JavaScript, Twitch IRC WebSocket, Twitch CLI, OpenAI Codex.

## Intended platform

Desktop web browser; the current demonstrated setup is Windows with Google Chrome.

## Codex Session ID

`01a191d5-5b5d-79b1-853e-21b3537866bf`

Confirm this with `/status` in the Codex thread before submitting.

## Submission links to fill in

- Code repository URL: _add after publishing the Git repository_
- Public YouTube demo URL (under 3 minutes): _add after uploading the demo_
