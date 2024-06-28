<?php
$themes_source = "https://cdn.jsdelivr.net/npm/linkfree-themes@1.1.0";

$sites = [
  [
    "name" => "LinkedIn",
    "icon" => "logo-linkedin",
    "placeholder" => "https://linkedin.com/in/...",
  ],
  [
    "name" => "Instagram",
    "icon" => "logo-instagram",
    "placeholder" => "https://instagram.com/...",
  ],
  [
    "name" => "Twitch",
    "icon" => "logo-twitch",
    "placeholder" => "https://twitch.tv/...",
  ],
  [
    "name" => "YouTube",
    "icon" => "logo-youtube",
    "placeholder" => "https://youtube.com/c/...",
  ],
  [
    "name" => "X (Twitter)",
    "icon" => "logo-x",
    "placeholder" => "https://x.com/...",
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
  <link rel="stylesheet" href="index.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>

<body>
  <div class="container my-3">
    <h1>Create your own LinkFree!</h1>
    <p>
      Fill out this form to generate your own single page website. All fields are optional except for your name. So, don't worry if you don't have all these accounts. The output will be a single <code>index.html</code> file that you can upload to any static hosting provider such as GitHub Pages, Cloudflare Pages, Vercel, Netlify, or DigitalOcean Apps.
    </p>
    <form id="form" class="mb-3" action="api.php" method="post" enctype="multipart/form-data" accept-charset="utf-8">
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
      <?php foreach ($sites as $key => $site) { ?>
        <div class="mb-3">
          <label for="links[<?= $key ?>][url]" class="form-label"><?= $site["name"] ?> Link</label>
          <input type="hidden" id="links[<?= $key ?>][name]" name="links[<?= $key ?>][name]" value="<?= $site["name"] ?>">
          <input type="hidden" id="links[<?= $key ?>][icon]" name="links[<?= $key ?>][icon]" value="<?= $site["icon"] ?>">
          <input type="url" id="links[<?= $key ?>][url]" name="links[<?= $key ?>][url]" class="form-control" placeholder="<?= $site["placeholder"] ?>">
        </div>
      <?php } ?>
      <?php for ($i = 1; $i <= $num_clinks; $i++) {
        $key = $lastsite_index + $i; ?>
        <div class="mb-3">
          <label class="form-label">Custom Link #<?= $i ?></label>
          <div class="row g-2">
            <div class="input-group col-sm">
              <input type="text" id="links[<?= $key ?>][name]" name="links[<?= $key ?>][name]" class="form-control" placeholder="Name" aria-label="Name">
              <input type="text" id="links[<?= $key ?>][icon]" name="links[<?= $key ?>][icon]" class="form-control" placeholder="Icon" aria-label="Icon">
            </div>
            <div class="col-sm-7 col-md-8 col-xl-9">
              <input type="url" id="links[<?= $key ?>][url]" name="links[<?= $key ?>][url]" class="form-control" placeholder="Link" aria-label="Link">
            </div>
          </div>
        </div>
      <?php } ?>
      <?php if ($num_clinks < 50) { ?>
        <a id="additionalLink" class="btn btn-secondary mb-2" data-index="<?= ($lastsite_index + $num_clinks) ?>" role="button">+ Add Additional Link</a>
      <?php } ?>
      <div class="mb-3">
        <div class="form-text">
          For custom links, you may use <a href="https://ionic.io/ionicons">any icon from ionicons</a> by name. For example, <code>logo-mastodon</code>. Icon field may be left blank.
        </div>
      </div>
      <div class="mb-3">
        <label for="theme" class="form-label"><span style="font-weight: 500;">Select Template</span></label>
        <select id="theme" name="theme" class="form-select">
          <option value="" selected>Default</option>
          <?php foreach ($themes as $key => $theme) { ?>
            <option value="<?= htmlspecialchars(json_encode($theme)) ?>"><?= $theme['name'] ?></option>
          <?php } ?>
        </select>
        <div class="form-text">
          You can <a href="https://chriskthomas.github.io/linkfree-themes/">preview themes here</a>.
        </div>
        <input type="hidden" id="themes-source" name="themes-source" value="<?= $themes_source ?>">
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" id="ispreview" name="ispreview" class="form-check-input">
        <label for="ispreview" class="form-check-label">Preview?</label>
        <span class="form-text">Make a preview instead of downloading file.</span>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" id="getzip" name="getzip" class="form-check-input">
        <label for="getzip" class="form-check-label">Zip File?</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
      <a id="clear" class="btn btn-danger" role="button">Clear</a>
    </form>
    <p>This project is supported by:</p>
    <a href="https://m.do.co/c/8bd90b1b884d">
      <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px">
    </a>
  </div>
  <footer class="my-4 py-3 border-top">
    <div class="container">
      <p class="text-center text-secondary m-0">
        <a href="https://github.com/chriskthomas/linkfree-generator" rel="self">Open source software</a>
        by
        <a href="https://chriskthomas.com" rel="author">Chris K. Thomas</a>
        and other contributors:
        <a href="https://github.com/chriskthomas/linkfree-generator/graphs/contributors">[1]</a>
        <a href="https://github.com/chriskthomas/linkfree-themes/graphs/contributors">[2]</a>
        <br>
        <a href="https://chriskthomas.github.io/linkfree-generator/">Next Steps: Guides for Hosting LinkFree</a>
      </p>

    </div>
  </footer>
  
  <button id="previewButton"><ion-icon name="eye"></ion-icon></button>
  <div id="previewBlock"></div>
  <script src="./index.js"></script>

  <script type="module" src="https://cdn.jsdelivr.net/npm/ionicons@7.4.0/dist/ionicons/ionicons.esm.js"></script>
</body>
</html>
