const isDev = false
const host = isDev ? "mazines-mbp.devices.brown.edu:3000" : "https://scraper-dining-mazzaleen.vercel.app/"
   
async function createWidget() {
  const widget = new ListWidget()

  let req = new Request(host + "/api/v2")

  const { meal, open, menu } = await req.loadJSON()

  widget.backgroundColor = new Color("#C10BFB")

  let titleFont = Font.boldRoundedSystemFont(15)
  
  const titleText = open ? meal : `${meal} (currently closed)`
  const title = widget.addText(titleText)
  title.font = titleFont
  title.textColor = Color.white()
  menu.forEach(render.bind(widget))

  return widget
}

function render(item) {
  let name = this.addText(nameFor(item))
  name.textColor = Color.white()

  if (item.desc) {
    let desc = this.addText(item.desc)
    desc.textColor = Color.white()
    desc.textOpacity = 0.5
    desc.font = Font.systemFont(8)
  }

  
}

function nameFor(item) {
  if (item.gf || item.vegan) {
    if (item.gf && item.vegan) {
      return item.name + " (GF/V)"
    }
  }
  return item.name
}

if (config.runsInWidget) {
  Script.setWidget(await createWidget())
  Script.complete()
} else {
  ;(await createWidget()).presentLarge()
}
