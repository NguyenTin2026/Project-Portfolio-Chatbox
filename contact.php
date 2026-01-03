<?php
session_start();
header('Content-Type: application/json');

// ----------------------------
// 1️⃣ Create CSRF token If it is not available
// ----------------------------
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// ----------------------------
// 2️⃣ Handling form submit
// ----------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = ['status' => 'error', 'message' => 'Unknown error'];

    // Checking CSRF token
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        http_response_code(403);
        $response['message'] = "CSRF validation failed";
        echo json_encode($response);
        exit;
    }

    // Taking data from form
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // ----------------------------
    // Solve email sending
    // Example: mail($to, $subject, $body, $headers);
    // ----------------------------

    // Return Successfully
    $response = [
        'status' => 'success',
        'message' => 'Email Sent Successfully, Hoorray 🎉🎉🎉!'
    ];
    echo json_encode($response);
    exit;
}

// ----------------------------
// 3️⃣ Return CSRF token if GET
// ----------------------------
echo json_encode([
    'csrf_token' => $_SESSION['csrf_token']
]);
?>
