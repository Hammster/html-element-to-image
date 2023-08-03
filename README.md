# html-element-to-image
📷 Capture an image of any given HTML element.

## Install

```bash
// npm
npm install html-element-to-image

// yarn
yarn add html-element-to-image
```

## 📖 Example

Codepen: https://codepen.io/Hammster/pen/ZEYvxLa

ESM
```js
import nodeToDataURL from 'html-element-to-image'

const visualSource = document.getElementById('source')
const imageTarget = document.getElementById('target')
const excluded = document.querySelectorAll('.unwanted-element')

nodeToDataURL({
  targetNode: visualSource,
  excludedNodes: excluded,
  customStyle: '.highlighted-element { background: red; }'
})
.then((url) => {
  imageTarget.setAttribute('src', url);
})
```

UMD
> Exposes the function `nodeToDataURL` to the window/global

## 🔬 Differences to Other Libraries

Compared to [html-to-image](https://github.com/bubkoo/html-to-image), [dom-to-image](https://github.com/tsayen/dom-to-image) and [dom-to-image-more](https://github.com/1904labs/dom-to-image-more) this library uses a different approach, which leads to a big performance increase. Instead of making a [deep copy](https://en.wikipedia.org/wiki/Object_copying#Deep_copy) of the targeted element with applied styles via `el.getComputedStyle()`. This library uses the available DOM for serialization. Before and after the serialization, obfuscated classes get added to hide the parts we don't want to be displayed.

Another difference is that this library has no issue at all with `SVG Sprite Sheets` and `ShadowDOM` since we use the given DOM already.

<!---
## ⏰ Little Benchmark

| Node count | html-element-to-image | html-to-image | html-element-to-image |
| -------- | :----- | :----- | :-----
| 1 Node   | 0001ms | 0001ms | 0001ms
| 10 Nodes | 0001ms | 0001ms | 0001ms
| 100 Node | 0001ms | 0001ms | 0001ms
-->

## 🛡️ Limitation

- If the DOM node you want to render includes a `<canvas>` element with something drawn on it, it should be handled fine, unless the canvas is [tainted](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image) - in this case rendering will rather not succeed.
- Rendering will failed on huge DOM due to the dataURI [limit variations](https://stackoverflow.com/questions/695151/data-protocol-url-size-limitations/41755526#41755526) in browser implementations.
- Transforms may be affected. Elements that depend on `transform-style: preserve-3d;` do not work in a `foreignObject`, everything get flattened. And this is sadly a requirement for creating a image buffer, and also effects [html-to-image](https://github.com/bubkoo/html-to-image), [dom-to-image](https://github.com/tsayen/dom-to-image) and [dom-to-image-more](https://github.com/1904labs/dom-to-image-more)
  - this can be avoided partially by adding a fallback z-index

## 💔 Know Issues

- The canvas is not yet DPI aware
- styles from `html` and `body` can sometimes be overwritten by the [Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
- Lazy loaded components can break rendering
- Shadow DOM
