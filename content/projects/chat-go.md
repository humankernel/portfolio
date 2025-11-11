---
slug: chat-go
title: Terminal Chat
description: Go it's a "simple" nice language to work with, specially with web related things because of his great language features like go routines that make simple to manage threads, and his good standard library. So I built a small **terminal-based chat system**. It was an experiment to understand **how to manage WebSocket connections, rooms, and file transfers** — all without external frameworks.
tags:
  - Goroutines
  - WebSockets
  - Go-Channels
tech:
  - Go
date: 2025-04-24
projectUrl: https://github.com/humankernel/chat-go
status: completed
image: /banner.jpeg
featured: true
---

The project consists of two main files:

- **[`server.go`](https://github.com/humankernel/chat-go/blob/main/client.go)** — a WebSocket chat server that handles:
    - user registration and disconnection
    - message broadcasting to rooms
    - joining/leaving chat rooms
    - sending files between users

- **[`client.go`](https://github.com/humankernel/chat-go/blob/main/client.go)** — a simple terminal client that connects to the server via WebSocket and allows chatting and file sending (still minimal, but works).

The goal was to explore Go’s **concurrency model (goroutines + channels)** in a practical setting — where multiple clients interact in real time.

## How It Works

![screenshot](https://raw.githubusercontent.com/humankernel/chat-go/main/assets/screenshot.gif)

When a client connects:
1. It sends its username to the server.
2. The server registers the user and assigns them to the default chat room.
3. Messages are broadcast only to users in the same room.

Users can type commands like:
- `/list` — list all available rooms
- `/join roomname` — move to another room
- `FILE:filename:size:receiver` — send a file to another user

The server handles all communication through a `Hub` struct that orchestrates everything via **channels**.
