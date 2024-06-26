
var previewButton = document.getElementById('previewButton');
var previewBlock = document.getElementById('previewBlock');
var preview = false;

previewButton.addEventListener('click', function() {
    preview = !preview;
    UpdatePreview();
});

function UpdatePreview() {
    if (preview) {
        previewBlock.style.display = 'block';
        previewButton.style.filter = 'invert(1)';
    } else {
        previewBlock.style.display = 'none';
        previewButton.style.filter = 'invert(0)';
    }
}

UpdatePreview();