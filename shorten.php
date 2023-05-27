<?php
$longUrl = $_POST['longUrl'];

// Generate a unique short code
$shortCode = generateShortCode();

// Create a database connection
$db = new SQLite3('urls.db');

// Check if the short code already exists in the database
$stmt = $db->prepare('SELECT * FROM urls WHERE shortCode = :shortCode');
$stmt->bindValue(':shortCode', $shortCode);
$result = $stmt->execute();
$row = $result->fetchArray(SQLITE3_ASSOC);

// If the short code exists, generate a new one
while ($row) {
    $shortCode = generateShortCode();
    $stmt->bindValue(':shortCode', $shortCode);
    $result = $stmt->execute();
    $row = $result->fetchArray(SQLITE3_ASSOC);
}

// Insert the URL into the database
$stmt = $db->prepare('INSERT INTO urls (longUrl, shortCode, isUsed) VALUES (:longUrl, :shortCode, 0)');
$stmt->bindValue(':longUrl', $longUrl);
$stmt->bindValue(':shortCode', $shortCode);
$stmt->execute();

// Close the database connection
$db->close();

// Create the short URL
$shortUrl = getBaseUrl() . $shortCode;

// Return the short URL
echo $shortUrl;

// Function to generate a random short code
function generateShortCode()
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $codeLength = 6;
    $code = '';

    for ($i = 0; $i < $codeLength; $i++) {
        $code .= $characters[rand(0, strlen($characters) - 1)];
    }

    return $code;
}

// Function to get the base URL
function getBaseUrl()
{
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    return $protocol . '://' . $host . '/';
}
?>
