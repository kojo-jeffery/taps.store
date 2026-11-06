<?php
$port = getenv('PORT') ?: 'unknown';
$path = $_SERVER['REQUEST_URI'] ?? '/';
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PHP Starter</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.5 }
      main { max-width: 40rem }
    </style>
  </head>
  <body>
    <main>
      <h1>PHP Starter</h1>
      <p>A plain PHP tap with no framework and no install step.</p>
      <dl>
        <dt>Request path</dt>
        <dd><?= htmlspecialchars($path, ENT_QUOTES, 'UTF-8') ?></dd>
        <dt>PORT</dt>
        <dd><?= htmlspecialchars((string) $port, ENT_QUOTES, 'UTF-8') ?></dd>
      </dl>
    </main>
  </body>
</html>
