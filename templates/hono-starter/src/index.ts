import { Hono } from 'hono'

const port = Number(process.env.PORT ?? 3000)

const app = new Hono()

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.5 }
      main { max-width: 40rem }
    </style>
  </head>
  <body>
    <main>${body}</main>
  </body>
</html>`
}

app.get('/', (c) => {
  return c.html(
    layout(
      'Hono Starter',
      '<h1>Hono Starter</h1><p>A minimal Hono tap.</p><a href="/docs">Docs</a>',
    ),
  )
})

app.get('/docs', (c) => {
  return c.html(
    layout(
      'Hono Starter docs',
      '<h1>Docs</h1><p>GET / renders the app page. GET /docs renders this page.</p><a href="/">Back</a>',
    ),
  )
})

app.notFound((c) => c.text('Not found', 404))

export default {
  port,
  fetch: app.fetch,
}
