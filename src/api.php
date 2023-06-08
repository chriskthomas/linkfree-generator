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
    <title><?=$_POST["name"]?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossorigin="anonymous">
    <style>
    <?php
if (isset($_POST['theme'])) {
    $selectedTheme = $_POST['theme'];
    $themeFolderPath = '../Templates/' . $selectedTheme;
    
    if (file_exists($themeFolderPath)) {
        require $themeFolderPath . '\style.css';
    }
}
?>
</style>
</head>

<body>
<div id="pride"><?php

        if ($selectedTheme === 'Pride') {
            echo '<style>#pride {     transform: skewY(-15deg);
                position: absolute;
                width: 120%;
                top: 25%;
                z-index: -1;
                box-shadow:
                0 0 0 35px #E03A3E,
                0 0 0 65px #FCB827,
                0 0 0 95px #62BB47,
                0 0 0 125px #F5831D,
                0 0 0 155px #009DDC,
                0 0 0 185px #963D96 }</style>';
        }
    
?></div>

    <?php if (!empty($user_photo)) {?>
    <img id="userPhoto" src="<?=$user_photo?>" alt="User Photo">
    <?php }?>

    <a href="<?=(!empty($_POST["url"]) ? $_POST["url"] : ".")?>" id="userName"><?=$_POST["name"]?></a>

    <?php if (!empty($_POST["description"])) {?>
        <div class="container"><p style="text-align: center; font-size: 1.25rem;"><?=$_POST["description"]?></p>  </div>
    <?php }?>

    <div id="links">
        <?php foreach ($links as $link) {if (!empty($link["url"])) {?>
        <a class="link" href="<?=$link["url"]?>" target="_blank">
           <span> <?php if (!empty($link["icon"])) {?>
            <i class="fa fa-<?=$link["icon"]?>" aria-hidden="true"></i>
            <?php }?>
            <?=$link["name"]?>
            </span>
        </a>
        
        <?php }}?>
        <?php if (!empty($_POST["email"])) {?>
        <a class="link" href="mailto:<?=$_POST["email"]?>" target="_blank"><i class="fa fa-envelope" aria-hidden="true"></i> Email</a>
        <?php }?>
    </div>

</body>
</html>
