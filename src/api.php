<?php if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // get the comment from the POST
    $description = $_POST["description"];
    $links = $_POST["links"];
} else {
    http_response_code(405);
    header('allow: POST');
    print "You can only access this page by submission of a form.";
    exit();
}

if (is_uploaded_file($_FILES["photo"]["tmp_name"])) {
    // process image
    $imagesize = getimagesize($_FILES["photo"]["tmp_name"]);
    if ($imagesize !== false) {
        // client uploaded a bona fide image!
        $photo_data = base64_encode(file_get_contents($_FILES["photo"]["tmp_name"]));
        $user_photo = "data:" . $imagesize["mime"] . ";base64," . $photo_data;
    }
}

if (!isset($_POST["ispreview"])) {
    header('Content-Disposition: attachment; filename="index.html"');
}

?>
<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <title><?= $_POST["name"] ?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossorigin="anonymous">
    <style>
        <?php
        require_once './themes.php';
        if (isset($_POST['theme'])) {
            $selectedTheme = filter_var($_POST['theme']);
            // validate selected theme using the existing $themes array 
            $themeFound = false;
            foreach ($themes as $theme) {
                if (strpos($theme, $selectedTheme) !== false) {
                    $themeFound = true;
                    break;
                }
            }
            if ($themeFound) {
                $themeFolderPath = './templates/' . $selectedTheme;
                if (is_dir($themeFolderPath)) {
                    $realThemeFolderPath = realpath($themeFolderPath); //real path = absolute/full location 

                    if (!empty($realThemeFolderPath)) {
                        $stylePaths = glob($realThemeFolderPath . '/style.css');

                        if ($stylePaths !== false && in_array($stylePaths[0], $stylePaths)) {
                            require $stylePaths[0];
                        }
                    }
                }
            }
        }
        ?>
    </style>
    <?php
    if (isset($_POST['theme'])) {
        $selectedTheme = filter_var($_POST['theme']);
        $faviconPath = './templates/' . $selectedTheme . '/favicon.ico';

        if (file_exists($faviconPath)) {
            echo '<link rel="icon" type="image/x-icon" href="' . $faviconPath . '" />';
        }
    }
    ?>
</head>

<body>
    <?php if (!empty($user_photo)) { ?>
        <img id="userPhoto" src="<?= $user_photo ?>" alt="User Photo">
    <?php } ?>

    <a href="<?= (!empty($_POST["url"]) ? $_POST["url"] : ".") ?>" id="userName"><?= $_POST["name"] ?></a>

    <?php if (!empty($_POST["description"])) { ?>
        <div class="container">
            <p><?= $_POST["description"] ?></p>
        </div>
    <?php } ?>

    <div id="links">
        <?php foreach ($links as $link) {
            if (!empty($link["url"])) { ?>
                <a class="link" href="<?= $link["url"] ?>" target="_blank">
                    <span> <?php if (!empty($link["icon"])) { ?>
                            <i class="fa fa-<?= $link["icon"] ?>" aria-hidden="true"></i>
                        <?php } ?>
                        <?= $link["name"] ?>
                    </span>
                </a>

        <?php }
        } ?>
        <?php if (!empty($_POST["email"])) { ?>
            <a class="link" href="mailto:<?= $_POST["email"] ?>" target="_blank"><i class="fa fa-envelope" aria-hidden="true"></i> Email</a>
        <?php } ?>
    </div>

    <?php if (isset($_POST['theme']) && $_POST['theme'] === 'PurpleSideOfTheForce') : ?>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="../../linkfree-generator/src/templates/PurpleSideOfTheForce/index.js"></script>
        <audio id="lightsaber-ignition-0">
            <source src="../../linkfree-generator/src/templates/PurpleSideOfTheForce/lightsaber-ignition-0.mp3">
        </audio>
        <audio id="lightsaber-ignition-1">
            <source src="../../linkfree-generator/src/templates/PurpleSideOfTheForce/lightsaber-ignition-1.mp3">
        </audio>
        <audio id="lightsaber-ignition-2">
            <source src="../../linkfree-generator/src/templates/PurpleSideOfTheForce/lightsaber-ignition-2.mp3">
        </audio>
    <?php endif; ?>
    <script>
        console.log(<?php echo ($_POST['theme'] === 'PurpleSideOfTheForce') ? 'true' : 'false'; ?>);
    </script>

</body>

</html>