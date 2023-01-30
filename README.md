# LAN Streaming

> TODO: think of a cooler name

## Goal

Stream data at high bandwidth (100mbps+), sub-frame latency (< 16ms) and high fidelity
(pixel-perfect/lossless if possible), from a process running in a **native desktop**
environment into a **web browser** running on the same computer.

The most direct real-world application is to process video on the desktop with
FFMPEG and pipe the output in realtime to a browser-shell embedded app like
[Tauri](https://tauri.app/) or Electron.

It's deceptively difficult, because few web protocols fit the high bandwidth +
low latency combo, even over localhost. Here's some protocols that _aren't_ a good fit:

- WebRTC MediaTrack*
- Websocket (high overhead on every message)
- HLS streaming from filesystem (format is designed with a several second
  buffer/delay in mind)
- HTTP streaming response + Web [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)

*WebRTC always seems to have around ~0.5sec of delay even with the fastest possible
encoding settings. It also forces you to use a heavy codec like H264 or VP8, and playback is delayed by a
jitter buffer that is outside of any
[direct](https://www.google.com/search?q=playbackdelayhint) control.

Good candidates for this transport might be:

- [WebTransport](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport):
  http3 Websocket successor, with a low-latency [Datagrams
  API](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport/datagrams)
- Websocket Data Channel + WASM custom encoder: actually the approach [used by Zoom](https://youtu.be/99FqwKka6mg)

An embedded browser use-case makes the relative support/adoption level of these
cutting-edge APIs a non-factor, meaning they can be used in this situation much
sooner than they could be relied on for a standard web-only app.

Browser-native APIs are coming close to making this a non-factor, between Screen
Capture, MediaRecorder, Web Codecs, and other similar APIs becoming available
natively in the browser, plus WASM compilation. But in the interim,
there is no widely adopted approach for this niche problem. It's a highly
requested feature in the Tauri Github, and some implementation may appear in
Tauri V2.
