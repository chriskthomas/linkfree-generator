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

    $photoBase64 = "";

    if (isset($_FILES["photo"]) && $_FILES["photo"]["tmp_name"]) {
        //Photo submitted during registration
        $imageData = file_get_contents($_FILES["photo"]["tmp_name"]);
        $mime = mime_content_type($_FILES["photo"]["tmp_name"]);
        $photoBase64 = "data:$mime;base64," . base64_encode($imageData);
    } elseif (!empty($_POST["photoBase64"])) {
        //Photo retrieved from import
        $photoBase64 = $_POST["photoBase64"];
    }
?>

<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($_POST["name"]) ?></title>
    <?php if (!empty($theme["css"])) { ?>
        <link rel="stylesheet" href="<?= htmlspecialchars("{$_POST["themes-source"]}/{$theme["css"]}") ?>">
    <?php } else { ?>
        <style>
            <?php include "default.css"; ?>
        </style>
    <?php } ?>
</head>

<body>
    <img src="<?php echo $photoBase64; ?>" id="userPhoto">
    
    <a href="<?= (!empty($_POST["url"]) ? $_POST["url"] : ".") ?>">
        <h1 id="userName"><?= htmlspecialchars($_POST["name"]) ?></h1>
    </a>

    <?php if (!empty($_POST["description"])) { ?>
        <p id="description"><?= htmlspecialchars($_POST["description"]) ?></p>
    <?php } ?>

    <div id="links">
        <?php foreach ($links as $link) {
            if (!empty($link["url"])) { ?>
                <a class="link" href="<?= htmlspecialchars($link["url"]) ?>" target="_blank">
                    <?php if (!empty($link["icon"])) { ?>
                        <ion-icon name="<?= htmlspecialchars($link["icon"]) ?>"></ion-icon>
                    <?php } ?>
                    <?= htmlspecialchars($link["name"]) ?>
                </a>
        <?php }
        } ?>
        <?php if (!empty($_POST["email"])) { ?>
            <!--email_off-->
            <!-- Show Email Address or "Email" in final output -->
            <a class="link" href="mailto:<?= htmlspecialchars($_POST["email"]) ?>" target="_blank">
                <ion-icon name="mail"></ion-icon>
                <?php if (!empty($_POST["useusername"]["email"])):
                    echo htmlspecialchars($_POST["email"]);
                else:
                    echo "Email";
                endif ?>
            </a>
            <!--/email_off-->
        <?php } ?>
    </div>
    <?php if (!empty($theme["js"])) { ?>
        <script src="<?= htmlspecialchars("{$_POST["themes-source"]}/{$theme["js"]}") ?>"></script>
    <?php } ?>
    <script type="module" src="<?= htmlspecialchars($_POST["ionicons-source"] . '/dist/ionicons/ionicons.esm.js') ?>"></script>
    <script nomodule src="<?= htmlspecialchars($_POST["ionicons-source"] . '/dist/ionicons/ionicons.js') ?>"></script>
</body>
<?php
    // Capture all POST fields
    $exportData = [
        "name" => $_POST["name"],
        "url" => $_POST["url"] ?? "",
        "description" => $_POST["description"] ?? "",
        "email" => $_POST["email"] ?? "",
        "useusername" => $_POST["useusername"] ?? [],
        "links" => $_POST["links"] ?? [],
        "theme" => $_POST["theme"] ?? "",
    ];

    // Inserts JSON as a comment in final HTML
    echo "\n<!--LINKFREE_DATA\n" . json_encode($exportData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\nLINKFREE_DATA-->";
?>
</html>