const prefix = '___';
const captureShowClass = `${prefix}capture-show`;
const forceOverflowClass = `${prefix}force-overflow`;
const defaultOptions = {
    targetNode: document.body,
    returnType: '',
};
function addClasses(node) {
    node.classList.add(captureShowClass);
    let nodeParent = node.parentElement;
    while (nodeParent) {
        nodeParent.classList.add(forceOverflowClass);
        nodeParent = nodeParent.parentElement;
    }
}
function removeClasses(node) {
    node.classList.remove(captureShowClass);
    let nodeParent = node.parentElement;
    while (nodeParent) {
        nodeParent.classList.remove(forceOverflowClass);
        nodeParent = nodeParent.parentElement;
    }
}
function serializeHead() {
    const headClone = document.head.cloneNode(true);
    const captureStyle = document.createElement('style');
    captureStyle.innerText += `body {transform: translateY(${window.outerHeight}px) !important; overflow: visible;}`;
    captureStyle.innerText += `.${captureShowClass} {transform: translateY(-${window.outerHeight}px) !important;}`;
    captureStyle.innerText += `.${forceOverflowClass} {overflow: visible !important;}`;
    headClone.appendChild(captureStyle);
    return new XMLSerializer()
        .serializeToString(headClone);
}
function serializeBody() {
    return new XMLSerializer()
        .serializeToString(document.body)
        // remove any script tag from the string
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
function combineToSvg(node, elBoundingClientRect) {
    // Add Temporary identification classes
    addClasses(node);
    const documentHead = serializeHead();
    const documentBody = serializeBody();
    const offesetX = -elBoundingClientRect.left;
    const offesetY = -elBoundingClientRect.top;
    let svg = '';
    /* tslint:disable:max-line-length */
    svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${elBoundingClientRect.width}" height="${elBoundingClientRect.height}">`;
    svg += `<foreignObject x="${offesetX}" y="${offesetY}" width="${window.outerWidth}" height="${window.outerHeight}"><html xmlns="http://www.w3.org/1999/xhtml">${documentHead}${documentBody}</html></foreignObject>`;
    svg += '</svg>';
    /* tslint:enable */
    // Remove Temporary identification classes
    removeClasses(node);
    return svg;
}
export default function NodeToDataURL(node, config) {
    const elBoundingClientRect = node.getBoundingClientRect();
    const svg = combineToSvg(node, elBoundingClientRect);
    // Build data url
    const svgBase64 = btoa(svg);
    const dataURL = `data:image/svg+xml;base64,${svgBase64}`;
    // Load data URL into a Image
    const img = new Image();
    img.src = dataURL;
    const canvas = document.getElementById('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = elBoundingClientRect.width;
        canvas.height = elBoundingClientRect.height;
        ctx.drawImage(img, 0, 0);
    }
    return canvas.toDataURL();
}
