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
    <style>
        #userName,.link,p{display:block;font-family:var(--font);text-align:center;text-decoration:none;font-size:1.25rem}.link:hover,body{background-color:var(--bgColor)}:root{--bgColor:#1C1C1C;--accentColor:#E6E6E6;--font:-apple-system,BlinkMacSystemFont,avenir next,avenir,segoe ui,helvetica neue,helvetica,Cantarell,Ubuntu,roboto,noto,arial,sans-serif}#userPhoto{width:110px;height:110px;display:block;margin:35px auto 20px;border-radius:50%}p{color:#bbb;font-style:italic}#userName{color:#bbb;font-weight:600;line-height:1.25;width:100%}#links{max-width:675px;width:auto;display:block;margin:27px auto}.link{background-color:var(--accentColor);color:var(--bgColor);margin-bottom:20px;padding:17px;transition:.25s cubic-bezier(.08,.59,.29,.99);border:solid var(--accentColor) 2px}.link:hover{color:var(--accentColor)}
    </style>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossorigin="anonymous">
</head>

<body>
    <?php if (!empty($user_photo)) {?>
    <img id="userPhoto" src="<?=$user_photo?>" alt="User Photo">
    <?php }?>

    <a href="<?=(!empty($_POST["url"]) ? $_POST["url"] : ".")?>" id="userName"><?=$_POST["name"]?></a>

    <?php if (!empty($_POST["description"])) {?>
    <p><?=$_POST["description"]?></p>
    <?php }?>

    <div id="links">
        <?php foreach ($links as $link) {if (!empty($link["url"])) {?>
        <a class="link" href="<?=$link["url"]?>" target="_blank">
            <?php if (!empty($link["icon"])) {?>
            <i class="fa fa-<?=$link["icon"]?>" aria-hidden="true"></i>
            <?php }?>
            <?=$link["name"]?>
        </a>
        <?php }}?>
        <?php if (!empty($_POST["email"])) {?>
        <a class="link" href="mailto:<?=$_POST["email"]?>" target="_blank"><i class="fa fa-envelope" aria-hidden="true"></i> Email</a>
        <?php }?>
    </div>

</body>
</html>
