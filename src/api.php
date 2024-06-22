<?php

// If the request method is not POST, return a 405 Method Not Allowed response
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('allow: POST');
    print "You can only access this page by submission of a form.";
    die();
}

if (!isset($_POST["getzip"])) {
    // If the "getzip" box is not checked, set the template to be downloaded as "index.html"

    // If the "ispreview" box is not checked, set the template to be downloaded as "index.html"
    if (!isset($_POST["ispreview"])) {
        header('Content-Disposition: attachment; filename="index.html"');
    }

    // Include the template.php file
    include "template.php";

    // Exit the script
    die();
} else {
    // If the "getzip" box is checked, capture the output of template.php and create a zip file

    // Start output buffering
    ob_start();

    // Include the template.php file
    include "template.php";

    // Get the contents of the output buffer
    $buffer = ob_get_clean();

    try {
        // Create a temporary zip file
        $tmpfile = tempnam(sys_get_temp_dir(), "linkfree");

        // Register a shutdown function to delete the temporary file
        register_shutdown_function('unlink', $tmpfile);

        // Create a new ZipArchive object
        $zip = new ZipArchive();
        $zip->open($tmpfile, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        // Add the index.html file to the zip
        $zip->addFromString("index.html", $buffer);

        $zip->close();
    } catch (Exception $e) {
        // If an exception is thrown, return a 500 Server Error response
        http_response_code(500);
        print "An error occurred while creating the zip file.";
        die();
    }

    // Set the headers to download the zip file
    header('Content-Type: application/zip');
    header('Content-Length: ' . filesize($tmpfile));
    header('Content-Disposition: attachment; filename="linkfree.zip"');

    // Output the contents of the zip file
    readfile($tmpfile);

    // Exit the script
    die();
}
