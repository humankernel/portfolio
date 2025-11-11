---
slug: http-server-go
title: HTTP Server From Scratch
description: |-
  ​​Five weeks ago, we selected 50 hardware builders who couldn't let their blueprints die on paper. People already deep in it. Past the point where turning back makes sense. Ideas ranged from $1000 mini humanoids to drones that can traverse land to glasses for performance athletes.
  ​Now, after 38 days of late nights in our labs, complete pivots, and relentless building with 3D printers, CNCs, and soldering stations, they're ready to transform our campus into a wonderland of working hardware, live demos, and things you can actually touch and try.
  ​​Join us November 7 5pm for the Blueprint finale — a festival of inventions where you'll test-drive robots, interact with next-gen hardware, hold devices that were just sketches not too long ago, and see what happens when people bring their blueprints to life.
  ​Live music, DJs, food trucks and local artisans will also be an extension of the experience provided by Fort Mason Night Market. Learn more.
tags:
  - TCP
  - HTTP
tech:
  - Go
date: 2025-04-13
projectUrl: https://github.com/humankernel/chat
status: completed
image: /banner.jpeg
featured: true
---
I wanted to really understand how an HTTP server works under the hood — not just call `http.ListenAndServe()`.  
So I decided to **build one from scratch** using nothing but Go’s `net` package.

## 🧠 Why Do This?

When we call `http.ListenAndServe` in Go, a ton of logic happens silently:

- Accepting TCP connections
- Parsing requests (method, path, headers, body)
- Handling concurrency
- Writing structured HTTP responses

I wanted to see _everything_ that happens between the client and the server — byte by byte.

## ⚙️ Architecture Overview

The program opens a raw TCP socket on port **4221**, waits for connections, and spins up a new goroutine for each one.

```mermaid
flowchart TD
    A["Client (Browser/cURL)"]
    -->|TCP 4221| B["Listener (net.Listen)"]
    B --> C["handleConnection(conn)"]
    C --> D["readRequest()"]
    D --> E["handleRequest()"]
    E --> F["generateResponse()"]
    F --> G["conn.Write()"]
```

Every connection is handled independently, so multiple clients can talk to the server at once.

## 📥 Reading the Request

Instead of using Go’s `http.Request`, I manually read from the socket with a buffered reader:

1. **First line:** `GET /echo/hi HTTP/1.1`
2. **Then headers**, until a blank line
3. **Then body**, based on `Content-Length`

That parsing logic alone made me appreciate how much the `net/http` package normally hides.

I store headers in a map so I can check things like `User-Agent`, `Accept-Encoding`, or `Connection`.

## 🧭 Handling Routes

Once I have the method, path, and headers, I handle requests like this:

|Path|Behavior|
|:--|:--|
|`/`|Just a 200 OK|
|`/echo/<msg>`|Returns the message in plain text|
|`/user-agent`|Returns whatever `User-Agent` the client sent|
|`/files/<name>`|GET reads a file, POST writes one|

Here’s how I think of it:

```mermaid
graph LR
    A["/"] -->|200 OK| Z["Empty response"]
    B["/echo/:msg"] -->|Return :msg| Z
    C["/user-agent"] -->|Return header| Z
    D["/files/:name"] -->|Read/Write file| Z
```

## 📦 Serving and Saving Files

This part was interesting.  
When I start the program, I pass a directory path (like `/tmp/data`) as an argument.  
Then the server joins that path with the file name from the URL.

If I send:

```shell
curl -X POST --data "hello" localhost:4221/files/test.txt
```

It writes `hello` into `/tmp/data/test.txt`.

And later:

```shell
curl localhost:4221/files/test.txt
```

It sends back the file’s content with `Content-Type: application/octet-stream`.

That’s it — I’ve built a basic file server.

## 🌀 Gzip Support

If the request header includes:

```shell
Accept-Encoding: gzip
```

then I compress the response body using Go’s `gzip.Writer`,  
and add `Content-Encoding: gzip` in the headers.

```mermaid
graph LR
    A["Response Body"] --> B["compressGzip()"]
    B --> C["gzip.Writer"]
    C --> D["Compressed []byte"]
    D --> E["Add Content-Encoding: gzip"]
```

It’s a small feature, but it makes the server feel _real_ — like something browsers can actually talk to.

## 🔁 Persistent Connections

The server keeps a connection open unless the client sends:

```shell
Connection: close
```

That means one TCP connection can handle multiple HTTP requests in sequence — just like HTTP/1.1 pipelining.

## 🧱 Constructing Responses

This part feels almost nostalgic:  
I’m literally writing the response string manually:

```shell
HTTP/1.1 200 OK\r\n
Content-Type: text/plain\r\n
Content-Length: 5\r\n
\r\n
hello
```

No magic. Just text over TCP.  
It made me realize how simple and elegant HTTP really is underneath all the abstractions.

