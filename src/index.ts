export interface ICaptureOptions {
    targetNode: HTMLElement | Element
    excludedNodes: HTMLElement[] | Element[]
    customStyle: string
    returnType: string
}

export interface IDirections {
    top: number
    right: number
    bottom: number
    left: number
}

const prefix = '___'
const captureShowClass = `${prefix}capture-show`
const captureHideClass = `${prefix}capture-hide`
const forceOverflowClass = `${prefix}force-overflow`

const defaultOptions: ICaptureOptions = {
    customStyle: '',
    excludedNodes: [],
    returnType: 'dataUrl',
    targetNode: document.body
}

let config: ICaptureOptions = defaultOptions

function addClasses (node: Element): void {
    node.classList.add(captureShowClass)
    let nodeParent = node.parentElement

    for (const excludedEl of config.excludedNodes) {
        excludedEl.classList.add(captureHideClass)
    }

    while (nodeParent) {
        nodeParent.classList.add(forceOverflowClass)
        nodeParent = nodeParent.parentElement
    }
}

function removeClasses (node: Element): void {
    node.classList.remove(captureShowClass)
    let nodeParent = node.parentElement

    for (const excludedEl of config.excludedNodes) {
        excludedEl.classList.remove(captureHideClass)
    }

    while (nodeParent) {
        nodeParent.classList.remove(forceOverflowClass)
        nodeParent = nodeParent.parentElement
    }
}

function serializeHead (elBoundingClientRect: ClientRect | DOMRect): string {
    const headClone = document.head.cloneNode(true) as HTMLHeadElement
    const captureStyle = document.createElement('style')

    // Only the styled from the head are releavant so we grab them
    for (const childElement of Array.from(headClone.childNodes)) {
        if (!(childElement instanceof HTMLStyleElement)) {
            childElement.remove()
        }
    }

    // These are the style we apply on the element to move the body out off the visible area.
    // The remaining element will be moved back to its original position so it can be rendere without any background.
    // Addition Hint: Lineabreaks are parsed as <br> by the XMLParser so i need to have that syle in one line
    captureStyle.innerText += `foreignObject>div {`
    captureStyle.innerText += `position: fixed;`
    captureStyle.innerText += `top: ${window.outerHeight}px;`
    captureStyle.innerText += `overflow: visible;`
    captureStyle.innerText += `}`

    captureStyle.innerText += `.${captureShowClass} {`
    captureStyle.innerText += `position: fixed;`
    captureStyle.innerText += `left: 0;`
    captureStyle.innerText += `top: 0;`
    captureStyle.innerText += `width: ${elBoundingClientRect.width}px;`
    captureStyle.innerText += `height: ${elBoundingClientRect.height}px;`
    captureStyle.innerText += `}`

    captureStyle.innerText += `.${captureHideClass} {display: none !important;}`
    captureStyle.innerText += `.${forceOverflowClass} {overflow: visible !important;}`

    captureStyle.innerText += config.customStyle
    headClone.appendChild(captureStyle)

    let resultHtml = ''

    for (const styleElement of Array.from(headClone.querySelectorAll('style'))) {
        resultHtml += styleElement.outerHTML
    }

    return resultHtml
}

function serializeBody (): string {
    return (
        document.body.innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '')
    )
}

function combineToSvg (node: Element, elBoundingClientRect: ClientRect | DOMRect): string {
    // Add Temporary identification classes
    addClasses(node)

    const documentHead = serializeHead(elBoundingClientRect)
    const documentBody = serializeBody()

    const offesetX = -elBoundingClientRect.left
    const offesetY = -elBoundingClientRect.top

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('height', elBoundingClientRect.height.toString())
    svg.setAttribute('width', elBoundingClientRect.width.toString())

    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    foreignObject.removeAttribute('xmlns')
    foreignObject.setAttribute('x', '0') // offesetX.toString())
    foreignObject.setAttribute('y', '0') // offesetY.toString())
    foreignObject.setAttribute('height', window.outerHeight.toString())
    foreignObject.setAttribute('width', window.outerWidth.toString())

    const innerHtml = document.createElement('div')
    innerHtml.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
    innerHtml.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    innerHtml.setAttribute('class', document.body.className)

    // additional namespace for rendering
    innerHtml.innerHTML = documentBody

    foreignObject.appendChild(innerHtml)

    svg.insertAdjacentHTML('afterbegin', documentHead)
    svg.appendChild(foreignObject)

    // Remove Temporary identification classes
    removeClasses(node)

    const svgString = new XMLSerializer().serializeToString(svg)
    return svgString
}

export default function nodeToDataURL (userConfig: Partial<ICaptureOptions>): Promise<string> {
    config = { ...defaultOptions, ...userConfig }

    const node = config.targetNode
    const elBoundingClientRect = node.getBoundingClientRect()
    const svg = combineToSvg(node, elBoundingClientRect)

    // Build base64 data url
    const svgBase64 = encodeURIComponent(svg)
    const dataURL = `data:image/svg+xml,${svgBase64}`

    const canvas = document.createElement('canvas')

    return new Promise((resolve, reject) => {
        if (!canvas) {
            reject()
            return
        }

        // Load data URL into a Image
        const img = document.createElement('img')

        // In case the generated dataURL in invalid
        img.addEventListener('error', () => {
            canvas.remove()
            reject()
            return
        })

        // Wait for the image to be loaded, otherwise the buffer is empty
        img.addEventListener('load', () => {
            // For debugging feel free to use this fiddle
            // https://jsfiddle.net/j0asnubp/9/
            // just paste in the base64URL
            canvas.width = elBoundingClientRect.width
            canvas.height = elBoundingClientRect.height

            const ctx = canvas.getContext('2d')!
            ctx.drawImage(img, 0, 0)

            resolve(canvas.toDataURL())
            canvas.remove()
        })

        // only attach the data URL after all eventHandler are attached
        img.src = dataURL
    })
}
