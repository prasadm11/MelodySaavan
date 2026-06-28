# 🎵 MelodySaavan

<div align="center">

### An Open-Source ASP.NET Core Wrapper for JioSaavn

Fast • Lightweight • REST API • Swagger • Developer Friendly

![.NET](https://img.shields.io/badge/.NET-8.0-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Platform](https://img.shields.io/badge/Platform-ASP.NET%20Core-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

</div>

---

## 📖 Overview

**MelodySaavan** is an unofficial JioSaavn API wrapper built with **ASP.NET Core**.

It provides simple and well-documented REST APIs to search songs, retrieve song metadata, lyrics, albums, artists, and playlists, making it easy to integrate JioSaavn into your own applications.

---

## ✨ Features

- 🔍 Search Songs
- 🎵 Song Details
- 🎤 Song Lyrics
- 💿 Album Information
- 👨‍🎤 Artist Details
- 📃 Playlist Details
- ⚡ Fast REST APIs
- 📖 Swagger/OpenAPI Documentation
- 🛠️ Built with ASP.NET Core
- ❤️ Easy to Integrate

---

# 🚀 Getting Started

## Prerequisites

- .NET 8 SDK or later
- Visual Studio 2022 / VS Code

## Clone Repository

```bash
git clone https://github.com/prasadm11/MelodySaavan.git
cd MelodySaavan
```

## Restore Packages

```bash
dotnet restore
```

## Run

```bash
dotnet run
```

---

# 📚 Swagger

Once the application starts, open:

```text
https://localhost:5148/swagger
```

Example:

```text
https://localhost:5148/swagger
```

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/song` | Search songs |
| GET | `/song/{id}` | Get song details |
| GET | `/lyrics/` | Get lyrics |
| GET | `/album/` | Album details |
| GET | `/artist/` | Artist details |
| GET | `/playlist/` | Playlist details |

> More endpoints coming soon...

---

# 🛠️ Tech Stack

- ASP.NET Core
- C#
- HttpClient
- Swagger / OpenAPI

---

# 📁 Project Structure

```text
MelodySaavan
│
├── Controllers
├── Models
├── Services
├── Program.cs
├── appsettings.json
└── README.md
```

---

# 📸 Swagger UI

Add a screenshot after deployment:

```md
![Swagger](docs/swagger.png)
```

---

# 🤝 Contributing

Contributions are always welcome!

1. Fork the repository.
2. Create your feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

# 📄 License

Distributed under the **MIT License**.

See the `LICENSE` file for more information.

---

# ⚠️ Disclaimer

MelodySaavan is an unofficial API wrapper.

It is **not affiliated with, endorsed by, or maintained by JioSaavn**.

All trademarks, music content, and related assets belong to their respective owners.

This project is intended for educational and development purposes only.

---

<div align="center">

### ⭐ If you found this project useful, please consider giving it a Star!


</div>
