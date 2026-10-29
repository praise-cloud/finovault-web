<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$token = trim($data['token'] ?? '');
$newPassword = $data['newPassword'] ?? '';

if (empty($token) || strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid token or password length (minimum 8 characters).']);
    exit;
}

$supabaseUrl = 'https://dvvpkxuajwtezdoucbam.supabase.co';
$supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2dnBreHVhand0ZXpkb3VjYmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTk5OTk2NSwiZXhwIjoyMTA3NTc1OTY1fQ.Cek0pwdQuiMZLnHVm4PL10Az9lQVfFJoY9K6W64pWZo';

// 1. Query token
$ch = curl_init("$supabaseUrl/rest/v1/password_reset_tokens?token=eq." . urlencode($token) . "&select=*");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: $supabaseKey",
    "Authorization: Bearer $supabaseKey",
    "Content-Type: application/json"
]);
$tokRes = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$rows = json_decode($tokRes, true);
if (!is_array($rows) || count($rows) === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'The reset link is invalid or expired.']);
    exit;
}

$row = $rows[0];
if (strtotime($row['expires_at']) < time()) {
    http_response_code(400);
    echo json_encode(['error' => 'The reset link has expired.']);
    exit;
}

$userId = $row['user_id'];

// 2. Update password
$ch = curl_init("$supabaseUrl/auth/v1/admin/users/$userId");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['password' => $newPassword]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: $supabaseKey",
    "Authorization: Bearer $supabaseKey",
    "Content-Type: application/json"
]);
$upRes = curl_exec($ch);
$upCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($upCode >= 400) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update password in Supabase.']);
    exit;
}

// 3. Delete token
$ch = curl_init("$supabaseUrl/rest/v1/password_reset_tokens?token=eq." . urlencode($token));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: $supabaseKey",
    "Authorization: Bearer $supabaseKey"
]);
curl_exec($ch);
curl_close($ch);

echo json_encode(['success' => true]);
