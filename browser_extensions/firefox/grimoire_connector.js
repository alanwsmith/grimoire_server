let state = {};
let popEl;
let url;
let apiRoot = "http://localhost:4545/api";
let kind = "bookmark";

function addHandlers() {
  window.addEventListener('keyup', (event) => {
    const isOpen = popEl.matches(':popover-open')
    if (event.key === "1" && isOpen === false) {
      getValues()
      popEl.showPopover()
    }
  });
  const inputEls = document.querySelectorAll(`input`);
  inputEls.forEach(inputEl => {
    inputEl.addEventListener('input', updateStorage)
    inputEl.addEventListener('keydown', (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        return false;
      }
    })
  })
  const textareaEls = document.querySelectorAll(`textarea`);
  textareaEls.forEach(textareaEl => {
    textareaEl.addEventListener('input', updateStorage)
  })
  const submitEl = document.querySelector(
    '#submit-button'
  );
  submitEl.addEventListener(
    'click', sendData
  );
}

function addPopover() {
  popEl = document.createElement('div');
  popEl.classList.add("grimoirePopover");
  popEl.innerHTML = `
  <h2>Grimoire Capture Tool</h2>
  <div id="inputs">
    <div></div>
    <h3>Bookmark</h3>
    <label for="bookmark-title">Title</label>
    <input id="bookmark-title" data-kind="bookmark" type="text" />
    <label for="bookmark-url">URL</label>
    <input id="bookmark-url" data-kind="bookmark" type="text" disabled/>
    <label for="bookmark-notes">Notes</label>
    <textarea id="bookmark-notes" data-kind="bookmark"></textarea>
    <label for="bookmark-tags">Tags</label>
    <input id="bookmark-tags" data-kind="bookmark" type="text" value="" />
    <label for="password">Password</label>
    <input id="password" type="password" />
    <div></div>
    <button id="submit-button">Submit</button>
  </div>`;
  popEl.setAttribute('popover', '');
  document.body.appendChild(popEl);
}

function addStylesheet() {
  const sheet = document.createElement("style");
  sheet.innerText = `
  .grimoirePopover {
    margin-inline: auto;
    width: min(80ch, 100% - 3rem);
    background-color: green;
    & .error {
      color: red;
    }
    & #inputs {
      display: grid;
      grid-template-columns: 6rem 1fr;
    }
    & input[type=text] {
      width: min(70ch, 100% - 5rem);
    }
    & input[type=password] {
      width: min(70ch, 100% - 5rem);
    }
    & #submit-button {
      width: 10ch;
    }
    & h2 {
      margin: 0;
    }
    #bookmark-notes{
      width: min(70ch, 100% - 5rem);
      height: 8rem;
    }
  }`;
  document.head.appendChild(sheet);
}

function clearStorage() {
  localStorage.removeItem(url);
}

function getDescription() {
  const description = document.querySelector('meta[name="description"]').content;
  if (description !== null) {
    return `${description}\n\n`;
  } else {
    return "";
  }
}

function getSelection() {
  const selection = document.getSelection();
  const selectedText = selection.toString();
  return selectedText;
}

function getValues() {
  url = window.location;
  clearStorage();
  const checkState = localStorage.getItem(url);
  if (checkState === null) {
    const fields = document.querySelectorAll('[data-kind]');
    fields.forEach(field => {
      const key = field.id.split('-')[1];
      switch(key) {
        case "url": 
          state[field.id] = url;
          break;
        case "title":
          state[field.id] = document.title;
          break;
        case "tags":
          state[field.id] = '';
          break;
        case "notes":
          state[field.id] = `${getDescription()}${getSelection()}`;
          break;
      }
    });
  } else {
    state = JSON.parse(checkState);
  }
  for(let id in state) {
    const fieldEl = document.querySelector(`#${id}`);
    fieldEl.value = state[id];
  }
  const password = localStorage.getItem('password');
  if (password !== null) {
    document.querySelector(`#password`).value = password;
  }
}

function showError(err) {
  const spacer = document.createElement('div');
  const errorEl = document.createElement('div');
  errorEl.classList.add('error');
  errorEl.innerHTML = `ERROR: ${err}`;
  const wrapper = document.querySelector('#inputs');
  wrapper.appendChild(spacer);
  wrapper.appendChild(errorEl);
}

async function sendData() {
  const postUrl = `${apiRoot}/make-${kind}`;
  const payload = {
    "password": document.querySelector(`#password`).value
  };
  const fields = document.querySelectorAll(`[data-kind=${kind}]`)
  fields.forEach(field => {
    const key = field.id.split('-')[1];
    payload[key] = field.value;
  });
  console.log(payload);
  try {
    const response = await fetch(
      postUrl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: payload,
    });
    const result = await response.json();
    clearStorage();
  } catch (e) {
    showError(e);
  }
}

function updateStorage() {
  // NOTE: Make a new object, populate it, and
  // then feed it back into `state` to 
  // clear any cruft.
  const stateToStore = {};
  const fields = document.querySelectorAll('[data-kind]');
  fields.forEach(field => {
    stateToStore[field.id] = document.querySelector(`#${field.id}`).value;
  });
  localStorage.setItem(url, JSON.stringify(stateToStore));
  state = stateToStore;
  localStorage.setItem('password', document.querySelector(`#password`).value);
}

addStylesheet();
addPopover();
addHandlers();
