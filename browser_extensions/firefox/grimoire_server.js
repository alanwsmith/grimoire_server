const sheet = document.createElement("style")
sheet.innerText = `
  .grimoirePopover {
    background-color: green;
  }`
document.head.appendChild(sheet)

const popEl = document.createElement('div')
popEl.classList.add("grimoirePopover")
popEl.innerHTML = `
<div>ping here2</div>
<div>
<input type="text" value="${window.location}" />
</div>
`
popEl.setAttribute('popover', '')
document.body.appendChild(popEl)

window.addEventListener('keyup', (event) => {
  const isOpen = popEl.matches(':popover-open')
  if (event.key === "1" && isOpen === false) {
    popEl.showPopover()
  } else if (event.key === "2" && isOpen === true) {
    popEl.hidePopover()
  }
})

