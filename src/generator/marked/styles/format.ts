export const strong = (text: string) => `<strong class="fw-9">${text}</strong>`;

export const hr = () => `<hr/>`;

export const br = () => `<br/>`;

export const em = (text: string) => `<em>${text}</em>`;

export const codespan = (str: string) =>
  `<code class="nowrap bg-black-05 black-50 pa0 ma1">${str}</code>`;

export const del = (text: string) => `<del>${text}</del>`;

export const link = (href: string, title: string, text: string) =>
  `<a class="dim blue" href="${href}" target="_blank" title="${title ||
    ''}">${text}</a>`;

export const image = (href: string, title: string, text: string) =>
  `<img src="${href}" alt="${text}" title=${title}/>`;
