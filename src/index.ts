import { ICaptureOptions } from 'html-element-to-image'

const prefix = '___'
const captureShowClass = `${prefix}capture-show`
const forceOverflowClass = `${prefix}force-overflow`

// @TODO, implement usage of padding, margin and returnType
const defaultOptions: ICaptureOptions = {
    targetNode: document.body,
    padding: {top: 0, right: 0, bottom: 0, left: 0},
    margin: {top: 0, right: 0, bottom: 0, left: 0},
    returnType: 'dataUrl'
}

function addClasses(node: Element): void {
    node.classList.add(captureShowClass)
    let nodeParent = node.parentElement

    while (nodeParent) {
        nodeParent.classList.add(forceOverflowClass)
        nodeParent = nodeParent.parentElement
    }
}

function removeClasses(node: Element): void {
    node.classList.remove(captureShowClass)
    let nodeParent = node.parentElement

    while (nodeParent) {
        nodeParent.classList.remove(forceOverflowClass)
        nodeParent = nodeParent.parentElement
    }
}

function serializeHead(): string {
    const headClone = document.head.cloneNode(true)
    const captureStyle = document.createElement('style')

    // These are the style we apply on the element to move the body out off the visible area
    // The remaining element will be moved back to its original position so it can be rendere without any background.
    captureStyle.innerText += `body {transform: translateY(${window.outerHeight}px) !important; overflow: visible;}`
    captureStyle.innerText += `.${captureShowClass} {transform: translateY(-${window.outerHeight}px) !important;}`
    captureStyle.innerText += `.${forceOverflowClass} {overflow: visible !important;}`

    headClone.appendChild(captureStyle)

    return new XMLSerializer()
        .serializeToString(headClone)
}

function serializeBody(): string {
    return new XMLSerializer()
        .serializeToString(document.body)
        // remove any script tag from the string
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

function combineToSvg(node: Element, elBoundingClientRect: ClientRect | DOMRect): string {
    // Add Temporary identification classes
    addClasses(node)

    const documentHead = serializeHead()
    const documentBody = serializeBody()

    const offesetX = -elBoundingClientRect.left
    const offesetY = -elBoundingClientRect.top

    let svg = ''
    /* tslint:disable:max-line-length */
    svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${elBoundingClientRect.width}" height="${elBoundingClientRect.height}">`
    svg += `<foreignObject x="${offesetX}" y="${offesetY}" width="${window.outerWidth}" height="${window.outerHeight}"><html xmlns="http://www.w3.org/1999/xhtml">${documentHead}${documentBody}</html></foreignObject>`
    svg += '</svg>'
    /* tslint:enable */

    // Remove Temporary identification classes
    removeClasses(node)

    return svg
}

export default function NodeToDataURL(userConfig: Partial<ICaptureOptions>): Promise<string> {
    const config = { ...defaultOptions, ...userConfig }
    const node = config.targetNode

    const elBoundingClientRect = node.getBoundingClientRect()
    const svg = combineToSvg(node, elBoundingClientRect)

    // Build data url
    const svgBase64 = btoa(svg)
    const dataURL = `data:image/svg+xml;base64,${svgBase64}`

    // Load data URL into a Image
    const img = new Image()
    img.src = dataURL

    const canvas = document.createElement('canvas')

    return new Promise(
        function(resolve, reject) {
            if (canvas) {
                // Load data URL into a Image
                const img = document.createElement('img')
                console.log(dataURL)
                img.src = dataURL

                // wait for the image to be loaded, otherwise the buffer is empty
                img.addEventListener('load', () => {
                    canvas.width = elBoundingClientRect.width
                    canvas.height = elBoundingClientRect.height

                    const ctx = canvas.getContext('2d')!
                    ctx.drawImage(img, 0, 0)

                    resolve(canvas.toDataURL())
                })

                // in case the generated dataURL in invalid
                img.addEventListener('error', () => {
                    reject()
                })
            } else {
                reject()
            }
        }
    )
}