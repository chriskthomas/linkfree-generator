<?php
// get the comment from the POST
$description = $_POST["description"];
$links = $_POST["links"];

// Create theme object
if (!empty($_POST["theme"])) {
    $theme = json_decode($_POST["theme"], true);
} else {
    $theme = array();
}

// Convert uploaded photo to data URI
if (is_uploaded_file($_FILES["photo"]["tmp_name"])) {
    // process image
    $imagesize = getimagesize($_FILES["photo"]["tmp_name"]);
    if ($imagesize !== false) {
        // client uploaded a bona fide image!
        $photo_data = base64_encode(file_get_contents($_FILES["photo"]["tmp_name"]));
        $user_photo = "data:" . $imagesize["mime"] . ";base64," . $photo_data;
    }
}
?>
<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <title><?= $_POST["name"] ?></title>
    <?php if (!empty($theme["css"])) { ?>
        <link rel="stylesheet" href="<?= "{$_POST["themes-source"]}/{$theme["css"]}" ?>">
    <?php } else { ?>
        <style>
            <?php include "default.css"; ?>
        </style>
    <?php } ?>
</head>

<body>
    <?php if (!empty($user_photo)) { ?>
        <img id="userPhoto" src="<?= $user_photo ?>" alt="User Photo">
    <?php } ?>

    <a href="<?= (!empty($_POST["url"]) ? $_POST["url"] : ".") ?>">
        <h1 id="userName"><?= $_POST["name"] ?></h1>
    </a>

    <?php if (!empty($_POST["description"])) { ?>
        <p id="description"><?= $_POST["description"] ?></p>
    <?php } ?>

    <div id="links">
        <?php foreach ($links as $link) {
            if (!empty($link["url"])) { ?>
                <a class="link" href="<?= $link["url"] ?>" target="_blank">
                    <?php if (!empty($link["icon"])) { ?>
                        <ion-icon name="<?= $link["icon"] ?>"></ion-icon>
                    <?php } ?>
                    <?= $link["name"] ?>
                </a>
        <?php }
        } ?>
        <?php if (!empty($_POST["email"])) { ?>
            <!--email_off-->
            <a class="link" href="mailto:<?= $_POST["email"] ?>" target="_blank"><ion-icon name="mail"></ion-icon> Email</a>
            <!--/email_off-->
        <?php } ?>
    </div>
    <?php if (!empty($theme["js"])) { ?>
        <script src="<?= "{$_POST["themes-source"]}/{$theme["js"]}" ?>"></script>
    <?php } ?>
    <script type="module" src="https://cdn.jsdelivr.net/npm/ionicons@7.4.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/ionicons@7.4.0/dist/ionicons/ionicons.js"></script>
</body>

</html>