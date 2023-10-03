const localStorageIgnore = ["photo"];

const addCustomLinkButton = document.querySelector("a.btn");
const clearButton = document.querySelector("a.btn-danger");
const form = document.querySelector("form");

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
 * Validates URL inputs and provides visual feedback.
 *
 * @param {NodeListOf<HTMLInputElement>} urlInputs - The URL input elements to validate.
 */
function validateURLInputs(urlInputs) {
  /**
   * Event listener for input changes in URL fields.
   *
   * @param {Event} event - The input event.
   */
  function handleInputChange(event) {
    const input = event.target;
    const url = input.value.trim();
    const validationMessage = input.nextElementSibling;

    if (isValidURL(url)) {
      input.style.borderColor = "green"; // Set border color to green for valid URL
      validationMessage.textContent = "URL is valid.";
      validationMessage.style.color = "green";
    } else {
      input.style.borderColor = "red"; // Set border color to red for invalid URL
      validationMessage.textContent = "Invalid URL. Please enter a valid URL.";
      validationMessage.style.color = "red";
    }
  }

  /**
   * Checks if a URL is valid based on a simple pattern.
   *
   * @param {string} url - The URL to validate.
   * @returns {boolean} - True if the URL is valid, false otherwise.
   */
  function isValidURL(url) {
    const urlPattern =
      /^(www\.)?[A-Za-z0-9_-]+\.[A-Za-z]{2,3}(\.[A-Za-z]{2})?$/;
    return urlPattern.test(url);
  }

  // Attach input event listeners to each URL input field
  urlInputs.forEach(function (input) {
    input.addEventListener("input", handleInputChange);
  });
}

// Get all input elements with the "urlInput" class and set up validation
const urlInputs = document.querySelectorAll(".urlInput");
validateURLInputs(urlInputs);

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

      // If the input is a link that doesnt exist, create it
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
