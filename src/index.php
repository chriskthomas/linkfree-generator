<?php
$themes_source = "https://cdn.jsdelivr.net/npm/linkfree-themes@0.0.3";

$sites = [
  [
    "name" => "Twitter",
    "icon" => "twitter",
    "placeholder" => "https://twitter.com/...",
  ],
  [
    "name" => "LinkedIn",
    "icon" => "linkedin-square",
    "placeholder" => "https://linkedin.com/in/...",
  ],
  [
    "name" => "Instagram",
    "icon" => "instagram",
    "placeholder" => "https://instagram.com/...",
  ],
  [
    "name" => "Twitch",
    "icon" => "twitch",
    "placeholder" => "https://twitch.tv/...",
  ],
  [
    "name" => "YouTube",
    "icon" => "youtube-play",
    "placeholder" => "https://youtube.com/c/...",
  ],
];

$num_clinks = 3;

# Retreive the list of themes and read the json file
$themes_json = file_get_contents("{$themes_source}/index.json");
$themes = json_decode($themes_json, true);

$lastsite_index = count($sites) - 1;
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LinkFree Generator</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
</head>
<body>
  <div class="container my-3">
    <h1>Create your own LinkFree!</h1>
    <p>
      Fill out this form to generate your own single page website. All fields are optional except for your name. So, don't worry if you don't have all these accounts. The output will be a single <code>index.html</code> file that you can upload to any static hosting provider such as GitHub Pages, Cloudflare Pages, Vercel, or Netlify.
    </p>
    <form class="mb-3" action="api.php" method="post" enctype="multipart/form-data" accept-charset="utf-8">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" id="name" name="name" class="form-control" placeholder="Chris K. Thomas" required>
        <div class="form-text">Your name is the only required field.</div>
      </div>
      <div class="mb-3">
        <label for="url" class="form-label">Main Link</label>
        <input type="url" id="url" name="url" class="form-control" placeholder="https://chriskthomas.com">
        <div class="form-text">Your name will link to this URL (optional).</div>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <input type="text" id="description" name="description" class="form-control" placeholder="Author, Teacher, Collector of Plushies">
        <div class="form-text">A subtitle that appears below your name (optional).</div>
      </div>
      <div class="mb-3">
        <label for="photo" class="form-label">Photo</label>
        <input type="file" id="photo" name="photo" class="form-control">
          <div class="form-text">Make it small and square (about 220x220px). It will be embedded into the page (optional, max 2mb).</div>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" name="email" class="form-control" placeholder="linkfree@ckt.im">
      </div>
<?php foreach ($sites as $key => $site) {?>
          <div class="mb-3">
          <label for="links[<?=$key?>][url]" class="form-label"><?=$site["name"]?> Link</label>
          <input type="hidden" id="links[<?=$key?>][name]" name="links[<?=$key?>][name]" value="<?=$site["name"]?>">
          <input type="hidden" id="links[<?=$key?>][icon]" name="links[<?=$key?>][icon]" value="<?=$site["icon"]?>">
          <input type="url" id="links[<?=$key?>][url]" name="links[<?=$key?>][url]" class="form-control" placeholder="<?=$site["placeholder"]?>">
          </div>
<?php }?>
<?php for ($i = 1; $i <= $num_clinks; $i++) {
    $key = $lastsite_index + $i;?>
          <div class="mb-3">
          <label class="form-label">Custom Link #<?=$i?></label>
            <div class="row g-2">
              <div class="input-group col-sm">
              <input type="text" id="links[<?=$key?>][name]" name="links[<?=$key?>][name]" class="form-control" placeholder="Name" aria-label="Name">
              <input type="text" id="links[<?=$key?>][icon]" name="links[<?=$key?>][icon]" class="form-control" placeholder="Icon" aria-label="Icon">
              </div>
              <div class="col-sm-7 col-md-8 col-xl-9">
              <input type="url" id="links[<?=$key?>][url]" name="links[<?=$key?>][url]" class="form-control" placeholder="Link" aria-label="Link">
              </div>
            </div>
          </div>
<?php }?>
      <div class="mb-3">
        <label for="theme" class="form-label"><span style="font-weight: 500;">Select Template</span></label>
        <select id="theme" name="theme" class="form-select">
          <option value="" selected>Default</option>
<?php foreach ($themes as $key => $theme) {?>
          <option value="<?=htmlspecialchars(json_encode($theme))?>"><?=$theme['name']?></option>
<?php }?>
        </select>
        <input type="hidden" id="themes-source" name="themes-source" value="<?=$themes_source?>">
      </div>

      <div class="mb-3">
        <div class="form-text">
          For custom links, you may use <a href="https://forkaweso.me/Fork-Awesome/icons/">any icon name from Fork-Awesome</a>. For example, <code>mastodon</code>. Icon field may be left blank.
        </div>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" id="ispreview" name="ispreview" class="form-check-input">
        <label for="ispreview" class="form-check-label">Preview?</label>
        <span class="form-text">Make a preview instead of downloading file.</span>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
<?php if ($num_clinks < 50) {?>
        <a class="btn btn-secondary" data-index="<?=($lastsite_index + $num_clinks)?>" role="button">Add Custom Link</a>
<?php }?>
    </form>
    <p>This project is supported by:</p>
    <a href="https://m.do.co/c/8bd90b1b884d">
      <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px">
    </a>
  </div>
  <script src="./index.js"></script>
</body>
</html>
