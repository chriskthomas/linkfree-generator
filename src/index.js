const addClinkBtn = document.querySelector("a.btn");
let index = Number(addClinkBtn.dataset.index);
addClinkBtn.addEventListener("click", (e) => {
  index++;

  /* The hierarchy of nodes/tags in the custom link fields HTML:
  div (outer i.e., newClick)
    label
    div (row)
      div1 (inner)
        input (Name)
        input (Icon)
      div2 (inner)
        input (Link/url)
  */

  // Creating the elements:
  let newClink = document.createElement("div"); // div (outer)
  newClink.className = "mb-3";

  let label = document.createElement("label"); // label
  label.className = "form-label";
  label.appendChild(document.createTextNode(`Custom Link #${index - 4}`));

  let row = document.createElement("div"); // div (row)
  row.setAttribute("class", "row g-2");

  let div1 = document.createElement("div"); // div1 (inner)
  div1.setAttribute("class", "input-group col-sm");

  const createField = (fieldName) => {
    // function to create input fields
    let field = document.createElement("input");

    field.id = `links[${index}][${fieldName}]`;
    field.name = `links[${index}][${fieldName}]`;
    field.type = "text";
    field.className = "form-control";

    if (fieldName != "url") {
      fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      field.placeholder = fieldName;
      field.ariaPlaceholder = fieldName;
    } else {
      field.placeholder = "Link";
      field.ariaPlaceholder = "Link";
    }

    return field;
  };

  let nameField = createField("name"); // input (Name)
  let iconField = createField("icon"); // input (Icon)

  let div2 = document.createElement("div"); // div2 (inner)
  div2.setAttribute("class", "col-sm-7 col-md-8 col-xl-9");

  let urlField = createField("url"); // input (Link/url)

  // Creating the final component:
  div2.appendChild(urlField);

  div1.appendChild(nameField);
  div1.appendChild(iconField);

  row.appendChild(div1);
  row.appendChild(div2);

  newClink.appendChild(label);
  newClink.appendChild(row);

  let lastClink = document.querySelector(`form div:nth-child(${index + 5})`);
  lastClink.after(newClink);
});
