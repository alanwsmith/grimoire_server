let state = {}
let popEl;

function addHandlers() {
  window.addEventListener('keyup', (event) => {
    const isOpen = popEl.matches(':popover-open')
    if (event.key === "1" && isOpen === false) {
      getValues()
      populateValues()
      popEl.showPopover()
    }
  })
  const inputEls = document.querySelectorAll(`input[type=text]`)
  inputEls.forEach(inputEl => {
    inputEl.addEventListener('input', updateStorage)
    inputEl.addEventListener('keydown', (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        return false;
      }
    })
  })
  const textareaEls = document.querySelectorAll(`textarea`)
  textareaEls.forEach(textareaEl => {
    textareaEl.addEventListener('input', updateStorage)
  })
  const submitEl = document.querySelector(
    '#submit-button'
  );
  submitEl.addEventListener(
    'click', sendData
  )
}

function addPopover() {
  popEl = document.createElement('div')
  popEl.classList.add("grimoirePopover")
  popEl.innerHTML = `
  <h2>Grimoire Capture Tool</h2>
  <div class="inputs">
    <div></div>
    <h3>Bookmark</h3>
    <label for="bookmark-title">Title</label>
    <input id="bookmark-title" data-kind="bookmark" type="text" />
    <label for="bookmark-url">URL</label>
    <input id="bookmark-url" data-kind="bookmark" type="text" />
    <label for="bookmark-notes">Notes</label>
    <textarea id="bookmark-notes" data-kind="bookmark"></textarea>
    <label for="bookmark-tags">Tags</label>
    <input id="bookmark-tags" data-kind="bookmark" type="text" value="" />
    <div></div>
    <button id="submit-button">Submit</button>
  </div>
  `
  popEl.setAttribute('popover', '')
  document.body.appendChild(popEl)
}

function addStylesheet() {
  const sheet = document.createElement("style")
  sheet.innerText = `
  .grimoirePopover {
    width: min(80ch, 100% - 3rem);
    background-color: green;
    & .inputs {
      display: grid;
      grid-template-columns: 4rem 1fr;
    }
    & input[type=text] {
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
  }
  `
  document.head.appendChild(sheet)
}

function getSelection() {
  const selection = document.getSelection();
  const selectedText = selection.toString();
  return selectedText
}

function getValues() {
  const url = window.location

  // const checkState = localStorage.getItem(url)
  // if (checkState === null) {
  //   state['url'] = url;
  //   state['title'] = document.title;
  //   state['tags'] = '';
  //   state['notes'] = getSelection();
  //   state['kind'] = getKind();
  // } else {
  //   state = JSON.parse(checkState)
  // }

}

function populateValues() {

  // textInputs.forEach(key => {
  //   const el = document.querySelector(`#bookmark-${key}`)
  //   el.value = state[key]
  // })
  // textAreas.forEach(key => {
  //   const el = document.querySelector(`#bookmark-${key}`)
  //   el.value = state[key]
  // })

}

async function sendData() {
  const postToUrl = "http://localhost:4545/api/make-note";
  const bodyData = JSON.stringify(state);
  console.log(bodyData);
  try {
    const response = await fetch(
      postToUrl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyData,
    });
    console.log(response);
    const result = await response.json();
    console.log(result);
    // showOutput(result);
  } catch (e) {
    console.error(e);
  }
}

function updateStorage() {
  console.log(".x")
  const url = window.location

  // textInputs.forEach(key => {
  //   const el = document.querySelector(`#bookmark-${key}`)
  //   state[key] = el.value
  // })
  // textAreas.forEach(key => {
  //   const el = document.querySelector(`#bookmark-${key}`)
  //   state[key] = el.value
  // })
  // localStorage.setItem(url, JSON.stringify(state))

}

addStylesheet()
addPopover()
addHandlers()

