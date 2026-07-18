# 🎵 MelodySaavan

<div align="center">

### An Open-Source Music Streaming Platform powered by JioSaavn

Beautiful UI • REST API • Cross Platform • Open Source

![Frontend](https://img.shields.io/badge/Frontend-JavaScript-yellow)
![Backend](https://img.shields.io/badge/Backend-.NET%2010-blueviolet)
![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android-success)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

</div>

---

# 📖 Overview

**MelodySaavan** is an open-source music streaming platform built around JioSaavn.

The project consists of two independent applications:

- 🎵 **MelodySaavan UI** – A modern music streaming web application with Android support.
- ⚙️ **MelodySaavan Backend** – An ASP.NET Core REST API wrapper that powers the frontend.

The goal of MelodySaavan is to provide developers with a clean, lightweight, and extensible music platform while also serving as a production-ready full-stack reference project.

---

# 🌐 Live Demo

## 🎵 Web Application

https://pmmelodysaavan.netlify.app/

## 📚 Swagger API

https://melodysaavan.onrender.com/

---

# ✨ Features

### 🎵 Music

- Song Search
- Music Streaming (320 kbps)
- Song Details
- Lyrics
- Album Details
- Artist Details
- Playlist Details

### 📱 User Experience

- Responsive Design
- Fast UI
- Android Support (Capacitor)
- Lightweight Architecture

### ⚙️ Backend

- REST APIs
- Swagger Documentation
- OpenAPI
- Easy Integration

---

# 🏗️ Repository Structure

```text
MelodySaavan
│
├── MelodySaavanBE
│   ├── Controllers
│   ├── Models
│   ├── Services
│   ├── README.md
│   └── ...
│
├── MelodySaavanUI
│   ├── android
│   ├── dist
│   ├── app.js
│   ├── index.html
│   ├── README.md
│   └── ...
│
├── README.md
├── LICENSE
└── .github
```

---

# 🚀 Projects

## 🎵 MelodySaavan UI

Modern music streaming application built with JavaScript and Capacitor.

### Features

- Stream Songs
- Search Songs
- Browse Artists
- Browse Albums
- Browse Playlists
- Lyrics
- Android Support

📂 Folder

```text
MelodySaavanUI/
```

---

## ⚙️ MelodySaavan Backend

Unofficial JioSaavn API Wrapper built with ASP.NET Core.

### Features

- Search API
- Song Details
- Artist API
- Album API
- Playlist API
- Lyrics API
- Swagger Documentation

📂 Folder

```text
MelodySaavanBE/
```

---

# 🛠️ Tech Stack

## Frontend

- JavaScript (ES6)
- HTML5
- CSS3
- Express.js
- Capacitor

## Backend

- ASP.NET Core (.NET 10)
- C#
- HttpClient
- Swagger / OpenAPI

---

# 🚀 Quick Start

Clone the repository

```bash
git clone https://github.com/prasadm11/MelodySaavan.git

cd MelodySaavan
```

### Backend

```bash
cd MelodySaavanBE

dotnet restore

dotnet run
```

### Frontend

```bash
cd ../MelodySaavanUI

npm install

npm run dev
```

---

# 📸 Screenshots

# 🎵 MelodySaavan UI

<div align="center">

### A Beautiful Cross-Platform Music Streaming Client for MelodySaavan API

Modern • Lightweight • Responsive • Android Ready

![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Capacitor](https://img.shields.io/badge/Capacitor-Android-blue)
![License](https://img.shields.io/badge/License-MIT-success)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

</div>

---

# 📖 Overview

**MelodySaavan UI** is the official frontend client for the **MelodySaavan API**.

It provides a fast, responsive, and elegant music streaming experience powered by the MelodySaavan backend. Built with modern JavaScript and packaged using Capacitor, the application runs seamlessly in both web browsers and Android devices.

---

# ✨ Features

- 🎵 Stream music instantly
- 🔍 Fast song search
- ❤️ Like and unlike songs
- 📃 Playlist support
- 💿 Album browsing
- 👨‍🎤 Artist pages
- 🎤 Lyrics support
- ⚡ Responsive design
- 📱 Android application support
- 🌐 REST API powered
- 🚀 Lightweight architecture

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- npm
- Android Studio (Optional for Android)
- Java 17+ (Android builds)

---

## Clone Repository

```bash
git clone https://github.com/prasadm11/MelodySaavan-UI.git

cd MelodySaavan-UI
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Development Server

```bash
npm run dev
```

Application will be available at

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build
```

Production files are generated inside

```
dist/
```

---

# 📱 Android Build

Sync Capacitor

```bash
npx cap sync
```

Open Android Studio

```bash
npx cap open android
```

Build and run the application from Android Studio.

---

# 🔗 Backend API

This frontend communicates with the MelodySaavan Backend API.

Backend Repository

```
https://github.com/prasadm11/MelodySaavan
```

---

# 🛠️ Tech Stack

- JavaScript (ES6)
- HTML5
- CSS3
- Node.js
- Express.js
- Capacitor
- Android

---

# 📂 Project Structure

```text
MelodySaavan-UI
│
├── android/
├── dist/
├── app.js
├── index.html
├── index.css
├── build.js
├── server.js
├── package.json
├── capacitor.config.json
└── README.md
```

---

# 📸 Screenshots

<div align="center">

<img src="MelodySaavanUI/docs/screenshots/home.png" width="230"/>
<img src="MelodySaavanUI/docs/screenshots/searchpage.png" width="230"/>
<img src="MelodySaavanUI/docs/screenshots/album_view.png" width="230"/>

<img src="MelodySaavanUI/docs/screenshots/lyrics.png" width="230"/>
<img src="MelodySaavanUI/docs/screenshots/search.png" width="230"/>
<img src="MelodySaavanUI/docs/screenshots/top_artists.png" width="230"/>

</div>
---

# 🎯 Roadmap

- [x] Music Streaming
- [x] Search
- [x] Responsive UI
- [x] Android Support
- [ ] Playlist Management
- [ ] User Authentication
- [ ] Offline Playback
- [ ] Download Songs
- [ ] Theme Customization

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 📄 License

Distributed under the MIT License.

See the LICENSE file for more information.

---

# ❤️ Acknowledgements

- MelodySaavan Backend API
- Capacitor
- Express.js
- Node.js

---

<div align="center">

### ⭐ If you like this project, consider giving it a Star!


</div>

# 🗺️ Roadmap

## Backend

- [x] Song Search
- [x] Song Details
- [x] Lyrics
- [x] Artist Details
- [x] Album Details
- [x] Playlist Details
- [ ] AI Recommendation APIs

## Frontend

- [x] Music Player
- [x] Search
- [x] Lyrics
- [x] Album Page
- [x] Artist Page
- [ ] Favorites
- [ ] Recently Played
- [ ] Offline Mode
- [ ] PWA Support

---

# 🤖 Future Vision

MelodySaavan is evolving beyond a music player.

Upcoming AI-powered features include:

- 🎧 Mood-based music recommendations
- 💬 AI Music Assistant
- 🎼 Smart Playlist Generation
- 🎤 Voice Search
- 📈 Listening Insights

---

# 🤝 Contributing

Contributions are always welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

# 📄 License

Distributed under the MIT License.

See the `LICENSE` file for more information.

---

# ⚠️ Disclaimer

MelodySaavan is an unofficial project and is **not affiliated with, endorsed by, or maintained by JioSaavn**.

All music content, artwork, trademarks, and related assets belong to their respective owners.

This project is intended for educational and development purposes only.

---

<div align="center">

### ⭐ If you found MelodySaavan useful, please consider giving the repository a Star!


</div>
