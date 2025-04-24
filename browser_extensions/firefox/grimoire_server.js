let state = {}
const textInputs = ['url', 'title', 'tags']
const textAreas = ['notes']
const radioInputs = ['kind']
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
  textInputs.forEach(input => {
    const inputEl = document.querySelector(`#pop-${input}`)
    inputEl.addEventListener('input', updateStorage)
    inputEl.addEventListener('keydown', (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        return false;
      }
    })
  })
  textAreas.forEach(area => {
    const areaEl = document.querySelector(`#pop-${area}`)
    areaEl.addEventListener('input', updateStorage)
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
    <label for="pop-title">Title</label>
    <input id="pop-title" type="text" />
    <label for="pop-url">URL</label>
    <input id="pop-url" type="text" />
    <!--
    <div></div>
    <div>
      <div>
        <label for="popBookmark">Bookmark</label>
        <input id="popBookmark" type="radio" name="pop-kind" value="bookmark" checked /> 
      </div>
      <div>
        <label for="popQuote">Quote</label>
        <input id="popQuote" type="radio" name="pop-kind" value="quote"/> 
      </div>
      <div>
        <label for="popMusic">Music</label>
        <input id="popMusic" type="radio" name="pop-kind" value="music"/> 
      </div>
      <div>
        <label for="popVideo">Video</label>
        <input id="popVideo" type="radio" name="pop-kind" value="video"/> 
      </div>
    </div>
    -->
    <label for="pop-notes">Notes</label>
    <textarea id="pop-notes"></textarea>
    <label for="pop-tags">Tags</label>
    <input id="pop-tags" type="text" value="" />
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
    #pop-notes{
      width: min(70ch, 100% - 5rem);
      height: 8rem;
    }
  }
  `
  document.head.appendChild(sheet)
}

function getKind() {
  return "bookmark"
}

function getSelection() {
  const selection = document.getSelection();
  const selectedText = selection.toString();
  return selectedText
}

function getValues() {
  const url = window.location
  const checkState = localStorage.getItem(url)
  if (checkState === null) {
    state['url'] = url;
    state['title'] = document.title;
    state['tags'] = '';
    state['notes'] = getSelection();
    state['kind'] = getKind();
  } else {
    state = JSON.parse(checkState)
  }
}

function populateValues() {
  textInputs.forEach(key => {
    const el = document.querySelector(`#pop-${key}`)
    el.value = state[key]
  })
  textAreas.forEach(key => {
    const el = document.querySelector(`#pop-${key}`)
    el.value = state[key]
  })
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
  console.log(".")
  const url = window.location
  textInputs.forEach(key => {
    const el = document.querySelector(`#pop-${key}`)
    state[key] = el.value
  })
  textAreas.forEach(key => {
    const el = document.querySelector(`#pop-${key}`)
    state[key] = el.value
  })
  localStorage.setItem(url, JSON.stringify(state))
}

addStylesheet()
addPopover()
addHandlers()

