// Get Window Elements
var previewButton = document.getElementById('previewButton');
var previewBlock = document.getElementById('previewBlock');
var preview = false;

// Get form Data
var formData = document.getElementById('form');
var photo = "";

previewButton.addEventListener('click', function() {
    preview = !preview;
    SwitchPreview();
});
function SwitchPreview() {
    if (preview) {
        previewBlock.style.display = 'block';
        previewButton.style.filter = 'invert(1)';
    } else {
        previewBlock.style.display = 'none';
        previewButton.style.filter = 'invert(0)';
    }
    UpdatePreview();
}

formData['photo'].addEventListener('input', (e) => {
    var photoData = e.target.files[0];
    if(photoData) {
        const reader = new FileReader();
        reader.onload = (e) => {
            photo = e.target.result;
            UpdatePreview();
        }
        reader.readAsDataURL(photoData);
    }
});

formData['name'].addEventListener('input', UpdatePreview);
formData['url'].addEventListener('input', UpdatePreview);
formData['description'].addEventListener('input', UpdatePreview);
formData['email'].addEventListener('input', UpdatePreview);

function UpdatePreview() {
    var name = formData['name'].value;
    var mainUrl= formData['url'].value;
    var description = formData['description'].value;
    // [Add Links]
    var email = formData['email'].value;
    // [Add Theme js]

    var photoCode = "";
    if(photo !== '') photoCode = `<img id="userPhoto" src="${photo}" alt="User Photo"></img>`;

    var nameCode = "";
    if(name !== '') nameCode = `<a href="${mainUrl}"><h1 id="userName">${name}</h1></a>`;

    var descriptionCode = "";
    if(description !== '') descriptionCode =`<p id="description">${description}</p>`;

    var emailCode = "";
    if(email !== '') emailCode = `<a class="link" href="mailto:${email}" target="_blank"><ion-icon name="mail"></ion-icon> Email</a>`;

    var previewCode = `${photoCode} ${nameCode} ${descriptionCode} ${emailCode}
        <script type="module" src="https://cdn.jsdelivr.net/npm/ionicons@7.4.0/dist/ionicons/ionicons.esm.js"></script>
        <script nomodule src="https://cdn.jsdelivr.net/npm/ionicons@7.4.0/dist/ionicons/ionicons.js"></script>`;
    
    previewBlock.innerHTML = previewCode;
};

SwitchPreview();