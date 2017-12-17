import * as highlightjs from 'highlight.js';
export default function(code: string, language: string) {
  const _code = code
    .replace('<', '&lt;')
    .replace('>', '&gt;')
    .replace('\t', '  ');
  if (!language)
    return `<pre><code class="hljs black-60 no-highlight">${_code}</code></pre>`;

  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && highlightjs.getLanguage(language));
  // Highlight only if the language is valid.
  const highlighted = validLang
    ? highlightjs.highlightAuto(_code).value
    : _code;

  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
}
