const a = "___", l = `${a}capture-show`, m = `${a}capture-hide`, u = `${a}force-overflow`, h = {
  customStyle: "",
  excludedNodes: [],
  returnType: "dataUrl",
  targetNode: document.body
};
let c = h;
function p(n) {
  n.classList.add(l);
  let t = n.parentElement;
  for (const e of c.excludedNodes)
    e.classList.add(m);
  for (; t; )
    t.classList.add(u), t = t.parentElement;
}
function x(n) {
  n.classList.remove(l);
  let t = n.parentElement;
  for (const e of c.excludedNodes)
    e.classList.remove(m);
  for (; t; )
    t.classList.remove(u), t = t.parentElement;
}
function f(n) {
  const t = document.head.cloneNode(!0), e = document.createElement("style");
  for (const r of Array.from(t.childNodes))
    r instanceof HTMLStyleElement || r.remove();
  e.innerText += "foreignObject>div {", e.innerText += "position: fixed;", e.innerText += `top: ${window.outerHeight}px;`, e.innerText += "overflow: visible;", e.innerText += "}", e.innerText += `.${l} {`, e.innerText += "position: fixed;", e.innerText += "left: 0;", e.innerText += "top: 0;", e.innerText += `width: ${n.width}px;`, e.innerText += `height: ${n.height}px;`, e.innerText += "}", e.innerText += `.${m} {display: none !important;}`, e.innerText += `.${u} {overflow: visible !important;}`, e.innerText += c.customStyle, t.appendChild(e);
  let i = "";
  for (const r of Array.from(t.querySelectorAll("style")))
    i += r.outerHTML;
  return i;
}
function v() {
  return document.body.innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, "");
}
function T(n, t) {
  p(n);
  const e = f(t), i = v();
  -t.left, -t.top;
  const r = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  r.setAttribute("xmlns", "http://www.w3.org/2000/svg"), r.setAttribute("height", t.height.toString()), r.setAttribute("width", t.width.toString());
  const s = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  s.removeAttribute("xmlns"), s.setAttribute("x", "0"), s.setAttribute("y", "0"), s.setAttribute("height", window.outerHeight.toString()), s.setAttribute("width", window.outerWidth.toString());
  const o = document.createElement("div");
  return o.setAttribute("xmlns", "http://www.w3.org/1999/xhtml"), o.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), o.setAttribute("class", document.body.className), o.innerHTML = i, s.appendChild(o), r.insertAdjacentHTML("afterbegin", e), r.appendChild(s), x(n), new XMLSerializer().serializeToString(r);
}
function y(n) {
  c = { ...h, ...n };
  const t = c.targetNode, e = t.getBoundingClientRect(), i = T(t, e), s = `data:image/svg+xml,${encodeURIComponent(i)}`, o = document.createElement("canvas");
  return new Promise((g, w) => {
    if (!o) {
      w();
      return;
    }
    const d = document.createElement("img");
    d.addEventListener("error", () => {
      o.remove(), w();
    }), d.addEventListener("load", () => {
      o.width = e.width, o.height = e.height, o.getContext("2d").drawImage(d, 0, 0), g(o.toDataURL()), o.remove();
    }), d.src = s;
  });
}
export {
  y as default
};
