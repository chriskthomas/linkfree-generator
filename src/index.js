const localStorageIgnore = ["photo"];
const themeUrl = document.getElementById("themes-source").value;
const ioniconsUrl = document.getElementById("ionicons-source").value;

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

  // Add event listener to update the preview (use "blur" for icon and "input" for the rest)
  field.addEventListener(name === "icon" ? "blur" : "input", UpdatePreview);

  if (name === "url") {
    field.placeholder = "Link";
    field.ariaPlaceholder = "Link";

    // If name is "url", add an event listener to add the protocol if missing
    field.addEventListener("blur", (event) => {
      addProtocolIfMissing(event.target);
    });
  } else {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    field.placeholder = name;
    field.ariaPlaceholder = name;
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
      let input = document.querySelector(
        `input[name="${key}"], select[name="${key}"]`
      );

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
var previewButton = document.getElementById("previewButton");
var previewBlock = document.getElementById("previewBlock");
var additionalLinkButton = document.getElementById("additionalLink");
var formData = document.getElementById("form");
var theme = document.getElementById("theme");

// Real time variables
var photo = "";

// Preview Button functionality
previewButton.addEventListener("click", () => {
  previewBlock.classList.toggle("show");
  previewButton.classList.toggle("active");
});

// Update Preview Photo On Input
formData["photo"].addEventListener("input", (e) => {
  var photoData = e.target.files[0];
  if (photoData) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photo = e.target.result;
      UpdatePreview(e);
    };
    reader.readAsDataURL(photoData);
  }
});

// Update Preview Function
function UpdatePreview(e = null) {
  var name = formData["name"].value;
  var mainUrl = formData["url"].value;
  var description = formData["description"].value;
  var email = formData["email"].value;

  // --- Auto-detect usernames for known platforms ---
  for (var i = 0; i <= linksIndex; i++) {
    let linkId = `links[${i}]`;
    let linkUrl =
      document.getElementById(linkId + "[url]")?.value?.trim() || "";
    let linkNameInput = document.getElementById(linkId + "[name]");
    let useUsername = document.getElementById(`useusername[${i}]`)?.checked;

    if (!linkUrl) continue;

    let username = null;

    // Try to extract username using regex for known sites
    for (const site of siteList) {
      let regex; // safely recreate regex from PHP string
      const match = site.regex.match(/^\/(.+)\/([gimsuy]*)$/);
      if (match) {
        regex = new RegExp(match[1], match[2]);
      }
      console.log(regex);
      if (regex.test(linkUrl)) {
        username = linkUrl.match(regex)?.[1];
        // If the checkbox is not checked, override linkName with the site name
        if (!useUsername) {
          linkNameInput.value = site.name;
        } else if (username) {
          linkNameInput.value = username;
        }
        break;
      }
    }
  }

  // Define a function that creates a link element
  function createLinkElement(href, icon = null, name = null, target = null) {
    // Create link
    let userLink = document.createElement("a");

    // Set link attributes
    userLink.href = href;
    userLink.target = target;
    userLink.classList.add("link");

    // Create icon
    if (icon) {
      let userIcon = document.createElement("ion-icon");
      userIcon.setAttribute("name", icon);
      userLink.appendChild(userIcon);
    }

    // Create label
    if (name) {
      userLink.appendChild(document.createTextNode(` ${name}`));
    }

    return userLink;
  }

  // Build entire body from scratch
  var previewBody = document.createElement("body");

  // Check if data is added
  if (photo !== "") {
    let userImg = document.createElement("img");
    userImg.id = "userPhoto";
    userImg.src = photo;
    userImg.alt = "User Photo";
    previewBody.appendChild(userImg);
  }
  if (name !== "") {
    // Create username link
    let userUrl = document.createElement("a");
    userUrl.href = mainUrl;
    userUrl.target = "_blank";

    let userName = document.createElement("h1");
    userName.id = "userName";
    userName.appendChild(document.createTextNode(name));
    userUrl.appendChild(userName);

    previewBody.appendChild(userUrl);
  }
  if (description !== "") {
    let userDescription = document.createElement("p");
    userDescription.id = "description";
    userDescription.appendChild(document.createTextNode(description));
    previewBody.appendChild(userDescription);
  }

  // Links
  {
    // Create links div
    let linksDiv = document.createElement("div");
    linksDiv.id = "links";

    for (var i = 0; i <= linksIndex; i++) {
      let linkId = `links[${i}]`;
      let linkUrl = document.getElementById(linkId + "[url]").value;
      let linkName = document.getElementById(linkId + "[name]").value;
      let linkIcon = document.getElementById(linkId + "[icon]").value;

      if (linkUrl !== "") {
        let userLink = createLinkElement(linkUrl, linkIcon, linkName, "_blank");
        linksDiv.appendChild(userLink);
      }
    }

    if (email !== "") {
      // Create email link
      const emailUseUsername =
        document.getElementById("useusername[email]")?.checked;
      const emailLabel = emailUseUsername ? email : "Email"; // Show email address option
      let userEmail = createLinkElement(`mailto:${email}`, "mail", emailLabel);
      linksDiv.appendChild(userEmail);
    }

    // Append links to the body
    previewBody.appendChild(linksDiv);
  }

  // Read theme data
  var json = theme.value ? JSON.parse(theme.value) : {};
  var themeStylePath = json.css ? themeUrl + "/" + json.css : `default.css`;

  if (json.js) {
    let themeScript = document.createElement("script");
    themeScript.src = themeUrl + "/" + json.js;
    previewBody.appendChild(themeScript);
  }

  // Append ionicons module script to the body
  var ioniconsScriptModule = document.createElement("script");
  ioniconsScriptModule.src = `${ioniconsUrl}/dist/ionicons/ionicons.esm.js`;
  ioniconsScriptModule.type = "module";
  previewBody.appendChild(ioniconsScriptModule);

  // Append ionicons nomodule script to the body
  var ioniconsScriptNoModule = document.createElement("script");
  ioniconsScriptNoModule.src = `${ioniconsUrl}/dist/ionicons/ionicons.js`;
  ioniconsScriptNoModule.noModule = true;
  previewBody.appendChild(ioniconsScriptNoModule);

  // Only define the HTML code once to avoid flickering
  var previewHTMLCode = `<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="UTF-8"><link id="theme-stylesheet" rel="stylesheet" href="${themeStylePath}"></head>${previewBody.outerHTML}</html>`;

  // If previewBlock is empty, append the iframe
  if (previewBlock.childElementCount === 0) {
    // On first run, create iframe to include in previewBlock
    let preview_iframe = document.createElement("iframe");
    preview_iframe.classList.add("w-100", "h-100");
    preview_iframe.srcdoc = previewHTMLCode;
    preview_iframe.id = "preview_iframe";

    // Append the iframe to the previewBlock
    previewBlock.appendChild(preview_iframe);
  } else if (e && e.target === theme) {
    // if the theme is changed, reset the srcdoc
    let preview_iframe = document.getElementById("preview_iframe");
    preview_iframe.srcdoc = previewHTMLCode;
  } else {
    // Get the iframe
    let preview_iframe = document.getElementById("preview_iframe");

    // Update the iframe body content
    preview_iframe.contentWindow.document.body.innerHTML =
      previewBody.innerHTML;
  }
}

// Add Listener for all links on file Load
for (var i = 0; i <= linksIndex; i++) {
  var linkId = `links[${i}]`;
  document
    .getElementById(linkId + "[url]")
    .addEventListener("input", UpdatePreview);
  document
    .getElementById(linkId + "[name]")
    .addEventListener("input", UpdatePreview);
  // Use blur for icons to avoid failed svg requests
  document
    .getElementById(linkId + "[icon]")
    .addEventListener("blur", UpdatePreview);
}

// Add Listener for all forms inputs on file Load
formData["name"].addEventListener("input", UpdatePreview);
formData["url"].addEventListener("input", UpdatePreview);
formData["description"].addEventListener("input", UpdatePreview);
formData["email"].addEventListener("input", UpdatePreview);
theme.addEventListener("input", UpdatePreview);

// Add listeners for all "useusername" checkboxes (email + links)
document.querySelectorAll('input[id^="useusername"]').forEach((checkbox) => {
  checkbox.addEventListener("change", UpdatePreview);
});

/*****************************************************/
/******************** Run on Load ********************/
/*****************************************************/

document.addEventListener("DOMContentLoaded", () => {
  loadFormFromLocalStorage();
  UpdatePreview();
});
