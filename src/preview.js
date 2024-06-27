// Get Window Elements
var previewButton = document.getElementById('previewButton');
var previewBody = document.getElementById('previewBody');
var previewBlock = document.getElementById('previewBlock');
var preview = false;
// Get Link Count from data-index
var addButton = document.getElementById("additionalLink");
var linkCount = Number(addButton.getAttribute("data-index")) + 1;

// Get form Data
var formData = document.getElementById('form');
var photo = "";

previewButton.addEventListener('click', function() {
    preview = !preview;
    SwitchPreview();
});
function SwitchPreview() {
    if (preview) {
        // previewBlock.style.display = 'block';
        previewBlock.style.right = '0';
        previewButton.style.filter = 'invert(1)';
    } else {
        // previewBlock.style.display = 'none';
        previewBlock.style.right = '-100%';
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

addButton.addEventListener('click', () => {
    linkCount++;
    var linkId = `links[${linkCount}]`;
    document.getElementById(linkId + "[url]").addEventListener('input', UpdatePreview);
    document.getElementById(linkId + "[name]").addEventListener('input', UpdatePreview);
    document.getElementById(linkId + "[icon]").addEventListener('input', UpdatePreview);
});

for (var i = 0; i < linkCount; i++) {
    var linkId = `links[${i}]`;
    document.getElementById(linkId + "[url]").addEventListener('input', UpdatePreview);
    document.getElementById(linkId + "[name]").addEventListener('input', UpdatePreview);
    document.getElementById(linkId + "[icon]").addEventListener('input', UpdatePreview);
}
formData['name'].addEventListener('input', UpdatePreview);
formData['url'].addEventListener('input', UpdatePreview);
formData['description'].addEventListener('input', UpdatePreview);
formData['email'].addEventListener('input', UpdatePreview);

function UpdatePreview() {
    var name = formData['name'].value;
    var mainUrl= formData['url'].value;
    var description = formData['description'].value;

    // Links
    var linksCode = "";
    for (var i = 0; i < linkCount + 1; i++) {
        var linkId = `links[${i}]`;
        var linkUrl = document.getElementById(linkId + "[url]").value;
        var linkName = document.getElementById(linkId + "[name]").value;
        var linkIcon = document.getElementById(linkId + "[icon]").value;
        if(linkUrl !== ""){
            if(linkIcon !== ""){
                linksCode += 
                    `<a class="link" href="${linkUrl}" target="_blank">
                    <ion-icon name="${linkIcon}"></ion-icon>
                    ${linkName} </a>`;
            }
            else{
                linksCode += 
                    `<a class="link" href="${linkUrl}" target="_blank">
                    ${linkName} </a>`;
            }
        }
    }
        
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

    var previewCode = `${photoCode} ${nameCode} ${descriptionCode} ${linksCode} ${emailCode}`;
    
    previewBody.innerHTML = previewCode;
};

SwitchPreview();