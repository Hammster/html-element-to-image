# html-element-to-image
📷 Capture a image from any given HTML element, fast.

## Install

```sh
// npm
npm install html-element-to-image

// yarn
yarn add html-element-to-image
```

## 🔬 Differences to Other Libraries

Compared to [html-to-image](https://github.com/bubkoo/html-to-image), [dom-to-image](https://github.com/tsayen/dom-to-image) and [dom-to-image-more](https://github.com/1904labs/dom-to-image-more) a different approach is used which leads to a big performance increase. Instead of making a deep copy of the targeted element with applied styles via `el.getComputedStyle()`. This library uses the available DOM for serialization. Before and after the serialization obfuscated classes get added to hide the parts we don't want to be displayed.

Another difference is that this library has no issue at all with `SVG spritesheets` and `ShadowDOM` since we use the given DOM already.

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
- Rendering will failed on huge DOM due to the dataURI [limit varies](https://stackoverflow.com/questions/695151/data-protocol-url-size-limitations/41755526#41755526).
- Transforms may be affected, Elements that depend on `transform-style: preserve-3d;` could end up being drawn in different order since it is not working the same when put into a SVG using `foreignObject`. And this is sadly a requirement for any of this, it is also the same technique used by [html-to-image](https://github.com/bubkoo/html-to-image), [dom-to-image](https://github.com/tsayen/dom-to-image) and [dom-to-image-more](https://github.com/1904labs/dom-to-image-more)

## 💔 Know Issues

- The canvas is not yet DPI aware