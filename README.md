# Pretty UTEC Dashboard

```js
const { email, tokenV1 } = JSON.parse(localStorage.session)

fetch("https://beauty-grades.vercel.app/api/populate", {
  method: "POST",
  headers: {
    Authorization: tokenV1,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email }),
}).then((res) => res.json()).then(console.log)
```
