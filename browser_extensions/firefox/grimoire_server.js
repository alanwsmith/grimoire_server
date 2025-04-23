let captureState = {}
const textInputs = ['url', 'title', 'tags']
const textAreas = ['notes']
let popEl;

function addStylesheet() {
  const sheet = document.createElement("style")
  sheet.innerText = `
  .grimoirePopover {
    width: min(80ch, 100% - 3rem);
    background-color: green;
    & form {
      display: grid;
      grid-template-columns: 4rem 1fr;
    }
    & input[type=text] {
      width: min(70ch, 100% - 5rem);
    }
    & input[type=submit] {
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


function getValues() {
  const url = window.location
  const storedState = localStorage.getItem(url)
  if (storedState === null) {
    captureState['url'] = url;
    captureState['title'] = document.title;
    captureState['tags'] = '';
    captureState['notes'] = getSelection();
  } else {
    captureState = JSON.parse(storedState)
  }
}

function populateValues() {
  textInputs.forEach(key => {
    const el = document.querySelector(`#pop-${key}`)
    el.value = captureState[key]
  })
  textAreas.forEach(key => {
    const el = document.querySelector(`#pop-${key}`)
    el.value = captureState[key]
  })
}


// const inputs = document.querySelectorAll('.grimoirePopover input')
// console.log(inputs)
// inputs.forEach(input => {
//   console.log(input)
// })

// function getSelection() {
//   return "TODO: get the selection"
// }

function updateStorage() {
  console.log(".")
  const url = window.location
  const stateToStore = {}
  textInputs.forEach(key => {
    const el = document.querySelector(`#pop-${key}`)
    stateToStore[key] = el.value
  })
  textAreas.forEach(key => {
    const el = document.querySelector(`#pop-${key}`)
    stateToStore[key] = el.value
    console.log(el.value)
  })
  localStorage.setItem(url, JSON.stringify(stateToStore))
}

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
  const formEl = document.querySelector(
    '.grimoirePopover > form'
  );
  formEl.addEventListener(
    'submit', 
    (event) => {
      event.preventDefault();
      localStorage.removeItem(window.location);
      formEl.submit();
    }
  )
}


function addPopover() {
  popEl = document.createElement('div')
  popEl.classList.add("grimoirePopover")
  popEl.innerHTML = `
  <h2>Grimoire Capture Tool</h2>
  <form>
    <label for="pop-title">Title</label>
    <input id="pop-title" type="text" />
    <label for="pop-url">URL</label>
    <input id="pop-url" type="text" />
  <!--
  <div>
    <label for="popBookmark">Bookmark</label>
    <input id="popBookmark" type="radio" name="popType" value="bookmark" checked /> 
  </div>
  <div>
    <label for="popQuote">Quote</label>
    <input id="popQuote" type="radio" name="popType" value="quote"/> 
  </div>
  <div>
    <label for="popMusic">Music</label>
    <input id="popMusic" type="radio" name="popType" value="music"/> 
  </div>
  <div>
    <label for="popVideo">Video</label>
    <input id="popVideo" type="radio" name="popType" value="video"/> 
  </div>
  -->
    <label for="pop-notes">Notes</label>
    <textarea id="pop-notes"></textarea>
    <label for="pop-tags">Tags</label>
    <input id="pop-tags" type="text" value="" />
    <div></div>
    <input type="submit" name="submit" value="submit" />
  </form>
  `
  popEl.setAttribute('popover', '')
  document.body.appendChild(popEl)
}

addStylesheet()
addPopover()
addHandlers()



// async function copySelection() {
//   try {
//     const selection = document.getSelection();
//     const selectedText = selection.toString();
//     const notesEl = document.querySelector('#captureNotes');
//     notesEl.innerText = selectedText;
//   } catch (err) {
//     console.error("Could not copy selection to clipboard")
//   }
// }

