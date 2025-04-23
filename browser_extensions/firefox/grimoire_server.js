const popoverEl = document.createElement('div')
popoverEl.innerHTML = `this is it`
popoverEl.setAttribute('popover', '')
document.body.appendChild(popoverEl)

window.addEventListener('keyup', (event) => {
  if (event.key === "1") {
    popoverEl.togglePopover()
  }
})

