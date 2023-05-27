// JavaScript code for handling form submission and displaying the short URL
document.getElementById('urlForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const longUrlInput = document.getElementById('longUrlInput');
  const shortUrlContainer = document.getElementById('shortUrlContainer');
  const shortUrl = document.getElementById('shortUrl');
  
  // Send a POST request to shorten.php
  fetch('shorten.php', {
    method: 'POST',
    body: new URLSearchParams(new FormData(event.target))
  })
    .then(response => response.text())
    .then(data => {
      // Display the short URL
      shortUrl.textContent = data;
      shortUrlContainer.style.display = 'block';
    })
    .catch(error => {
      console.error(error);
      alert('An error occurred. Please try again later.');
    });
});
