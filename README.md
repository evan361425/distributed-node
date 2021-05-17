Follow the book [Thomas Hunter. Distributed Systems with Node.js][1], and write some code.

## Dependencies

use `typescript` dev-dependencies.

- `express` : APP framework
- `@grpc/*` : gRPC
- `graphql`, `express-graphql` : graphql
- `got` : HTTP fetcher
- `pino` : logger
- `statsd-client` : metrics
- `zipkin*` : request tracing

## JavaScript vs Node.js

JavaScript 是單線程的，但可以透過 `message passing` 傳遞訊息來和不同線程溝通

> 即使有方法可以讓他多線程，JavaScript 本身的原理仍然是單線程的

Node.js 底層是使用 C++，多線程的

## What is event loop?

Event → separate stack

```
    bubbles up
c++ ==========> JS
```

### 不同環境對 `event` 的使用位置

- node ⇒ server
- browser ⇒ page

### phase

[![One phase of loop event][2]][2]

[1]: https://www.booktopia.com.au/distributed-systems-with-node-js-thomas-hunter-ii/ebook/9781492077244.html
[2]: https://kroki.io/mermaid/svg/eNptzb8KwjAQx_Hdp7gX6JA0nQR3wUncjg41PZJg_pQmFfTpTUxAhI735ffh1DotGi7X4wFgwIX8bLwaoetOwEqL2119J0pgMo7WOOYKIDBSuuUQtlTnQ5ln_4d6lDZEqqYdQE_yDYk9xFFqko-KeHl0do5mMyWqqt9TDJdgbUUM48tLvQZv3s3wn_kAINlIhQ==
