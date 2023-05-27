<!DOCTYPE html>
<html>
<head>
  <title>URL Shortener</title>
  <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
  <div class="container">
    <h1>URL Shortener</h1>
    <form id="urlForm">
      <input type="text" id="longUrlInput" name="longUrl" placeholder="Enter long URL" required>
      <button type="submit">Shorten</button>
    </form>
    <div id="shortUrlContainer">
      <h3>Short URL:</h3>
      <p id="shortUrl"></p>
    </div>
  </div>
  
  <script src="index.js"></script>
</body>
</html>

