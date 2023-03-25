# Pretty UTEC Dashboard

```js
const { email, tokenV1 } = JSON.parse(localStorage.session)

fetch("http://localhost:3000/api/populate", {
  method: "POST",
  headers: {
    Authorization: tokenV1,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email }),
}).then((res) => res.json()).then(console.log)
```
