const localStorageIgnore = ["photo"];

// Elements
const addCustomLinkButton = document.querySelector("a.btn");
const clearButton = document.querySelector("a.btn-danger");
const form = document.querySelector("form");
const checkbox_preview = document.getElementById("ispreview");
const checkbox_zip = document.getElementById("getzip");

let linksIndex = Number(addCustomLinkButton.dataset.index);

// Functions

/**
 * Create a custom link field
 * @param {string} name The name of the field
 * @returns {HTMLInputElement} The created field
 * @example
 * createLinkField("name");
 * // <input id="links[0][name]" name="links[0][name]" type="text" class="form-control" placeholder="Name" aria-placeholder="Name">
 * createLinkField("url");
 * // <input id="links[0][url]" name="links[0][url]" type="text" class="form-control" placeholder="Link" aria-placeholder="Link">
 */
function createLinkField(name) {
  let field = document.createElement("input");

  field.id = `links[${linksIndex}][${name}]`;
  field.name = `links[${linksIndex}][${name}]`;
  field.type = "text";
  field.className = "form-control";

  if (name != "url") {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    field.placeholder = name;
    field.ariaPlaceholder = name;
  } else {
    field.placeholder = "Link";
    field.ariaPlaceholder = "Link";
  }

  return field;
}

/**
 * Append custom link fields to the form
 *
 * Based on the following hierarchy of nodes in the custom link fields:
 *
 * ```
 * div (outer i.e., newClick)
 *  label
 *    div (row)
 *      div1 (inner)
 *        input (Name)
 *        input (Icon)
 *      div2 (inner)
 *        input (Link/url)
 * ```
 */
function createCustomLinkFields() {
  linksIndex++;

  // Creating the elements:
  let newCustomLink = document.createElement("div"); // div (outer)
  newCustomLink.className = "mb-3";

  let label = document.createElement("label"); // label
  label.className = "form-label";
  label.appendChild(document.createTextNode(`Custom Link #${linksIndex - 4}`));

  let row = document.createElement("div"); // div (row)
  row.setAttribute("class", "row g-2");

  let div1 = document.createElement("div"); // div1 (inner)
  div1.setAttribute("class", "input-group col-sm");

  let nameField = createLinkField("name"); // input (Name)
  let iconField = createLinkField("icon"); // input (Icon)

  let div2 = document.createElement("div"); // div2 (inner)
  div2.setAttribute("class", "col-sm-7 col-md-8 col-xl-9");

  let urlField = createLinkField("url"); // input (Link/url)

  // Creating the final component:
  div2.appendChild(urlField);

  div1.appendChild(nameField);
  div1.appendChild(iconField);

  row.appendChild(div1);
  row.appendChild(div2);

  newCustomLink.appendChild(label);
  newCustomLink.appendChild(row);

  let lastCustomLink = document.querySelector(
    `form div:nth-child(${linksIndex + 5})`
  );
  lastCustomLink.after(newCustomLink);
}

/**
 * Save all form input values to localStorage
 * @example
 * saveFormToLocalStorage(form);
 * // localStorage.getItem("form");
 * // {
 * //   "name": "John Doe",
 * //   "email": "john.doe@example",
 * // }
 */
function saveFormToLocalStorage() {
  const formData = new FormData(form);

  const data = Object.fromEntries(formData.entries());

  // Remove all localStorage keys that are in localStorageIgnore
  localStorageIgnore.forEach((key) => {
    delete data[key];
  });

  localStorage.setItem("form", JSON.stringify(data));
}

/**
 * Load all form input values from localStorage
 * @example
 * loadFormFromLocalStorage();
 * // localStorage.getItem("form");
 * // {
 * //   "name": "John Doe",
 * //   "email": "john.doe@example",
 * // }
 * // form
 * // <form>
 * //   <input aria-label="Name" name="name" value="John Doe">
 * //   <input aria-label="Email" name="email" value="john.doe@example">
 * // </form>
 */
function loadFormFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("form"));
  if (data) {
    Object.keys(data).forEach((key) => {
      let input = document.querySelector(`[name="${key}"]`);

      // If the input is hidden, continue
      if (input && input.type === "hidden") {
        return;
      }

      // If the input is a link that doesn't exist, create it
      if (key.startsWith("links") && !input) {
        const linkIndex = Number(key.match(/\d+/)[0]);
        if (linkIndex >= linksIndex) {
          createCustomLinkFields();
        }
        input = document.querySelector(`[name="${key}"]`);
      }

      if (input) {
        input.value = data[key];
      }
    });
  }
}

/**
 * Adds the protocol 'http://' to a URL input value if it's missing.
 *
 * @param {HTMLInputElement} input - The URL input element.
 * @returns {void}
 * @example
 * const inputElement = document.getElementById('url');
 * addProtocolIfMissing(inputElement);
 */
function addProtocolIfMissing(input) {
  let url = input.value.trim();
  if (url !== "" && !/:/.test(url)) {
    input.value = "http://" + url;
  }
}

// Event listeners

addCustomLinkButton.addEventListener("click", () => {
  createCustomLinkFields();
});

clearButton.addEventListener("click", () => {
  localStorage.removeItem("form");
  form.reset();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  saveFormToLocalStorage();
  form.submit();
});

document.addEventListener("DOMContentLoaded", () => {
  loadFormFromLocalStorage();
});

let urlInputs = document.querySelectorAll('input[type="url"]');
urlInputs.forEach((input) => {
  input.addEventListener("blur", (event) => {
    addProtocolIfMissing(event.target);
  });
});

// Disable the zip checkbox if the preview checkbox is checked
checkbox_preview.addEventListener("change", () => {
  checkbox_zip.disabled = checkbox_preview.checked;
});

// Disable the preview checkbox if the zip checkbox is checked
checkbox_zip.addEventListener("change", () => {
  checkbox_preview.disabled = checkbox_zip.checked;
});

/*****************************************************/
/***************** Real Time Preview *****************/
/*****************************************************/

// Get Window Elements
var previewButton = document.getElementById('previewButton');
/** 
* [!Note] Body is inside Block. 
* Block is for controling visibility and Body is for preview content 
**/
var previewBody = document.getElementById('previewBody');
var previewBlock = document.getElementById('previewBlock'); 
var additionalLinkButton = document.getElementById("additionalLink");
var formData = document.getElementById('form');
var theme = document.getElementById('theme').value;

// Real time variables
var preview = false;
var photo = "";
var linkCount = Number(additionalLinkButton.getAttribute("data-index")) + 1;

// Preview Button functionality
previewButton.addEventListener('click', () => {
  preview = !preview;
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
});

// Update Preview Photo On Input
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

// Add Listner for additionalLinkButton and for form data
additionalLinkButton.addEventListener('click', () => {
    linkCount++;
    var linkId = `links[${linkCount}]`;
    document.getElementById(linkId + "[url]").addEventListener('input', UpdatePreview);
    document.getElementById(linkId + "[name]").addEventListener('input', UpdatePreview);
    document.getElementById(linkId + "[icon]").addEventListener('input', UpdatePreview);
});

// Update Prview Function
function UpdatePreview() {
    var name = formData['name'].value;
    var mainUrl= formData['url'].value;
    var description = formData['description'].value;
    var email = formData['email'].value;
    var links = "";

    // Links
    for (var i = 0; i < linkCount + 1; i++) {
        var linkId = `links[${i}]`;
        var linkUrl = document.getElementById(linkId + "[url]").value;
        var linkName = document.getElementById(linkId + "[name]").value;
        var linkIcon = document.getElementById(linkId + "[icon]").value;
        if(linkUrl !== ""){
            if(linkIcon !== ""){
              links += 
                `<a class="link" href="${linkUrl}" target="_blank">
                <ion-icon name="${linkIcon}"></ion-icon>
                ${linkName} </a>`;
            }
            else{
              links += 
                `<a class="link" href="${linkUrl}" target="_blank">
                ${linkName} </a>`;
            }
        }
    }

    // [Add Theme js]

    // Check if data is added
    if(photo !== '') photo = `<img id="userPhoto" src="${photo}" alt="User Photo"></img>`;
    if(name !== '') name = `<a href="${mainUrl}"><h1 id="userName">${name}</h1></a>`;
    if(description !== '') description =`<p id="description">${description}</p>`;
    if(email !== '') email = `<a class="link" href="mailto:${email}" target="_blank"><ion-icon name="mail"></ion-icon> Email</a>`;

    // Update Preview
    var previewCode = `${photo} ${name} ${description} ${links} ${email}`;
    previewBody.innerHTML = previewCode;

    // Update Css
    if(theme == "") theme = "default.css";
    // Get data from css file
    fetch(theme).then(response => response.text()).then(data => {
      // Change body to #previewBody
      data = data.replace(new RegExp("body ", 'g'), "#previewBody");
      data = data.replace(new RegExp("p ", 'g'), "#previewBody > p");
      data = data.replace(new RegExp("a ", 'g'), "#previewBody > a");
      const styleElement = document.createElement('style');
      styleElement.textContent = data;
      document.head.appendChild(styleElement);
      console.log(data);
    });
    
};

// Add Listner for all links on file Load
for (var i = 0; i < linkCount; i++) {
  var linkId = `links[${i}]`;
  document.getElementById(linkId + "[url]").addEventListener('input', UpdatePreview);
  document.getElementById(linkId + "[name]").addEventListener('input', UpdatePreview);
  document.getElementById(linkId + "[icon]").addEventListener('input', UpdatePreview);
}
// Add Listner for all forms inputs on file Load
formData['name'].addEventListener('input', UpdatePreview);
formData['url'].addEventListener('input', UpdatePreview);
formData['description'].addEventListener('input', UpdatePreview);
formData['email'].addEventListener('input', UpdatePreview);