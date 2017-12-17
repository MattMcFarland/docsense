import * as highlightjs from 'highlight.js';
export default function(code: string, language: string) {
  code.replace('<', '&lt;').replace('>', '&gt;');
  if (!language)
    return `<pre><code class="hljs black-60 no-highlight">${code}</code></pre>`;

  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && highlightjs.getLanguage(language));
  // Highlight only if the language is valid.
  const highlighted = validLang ? highlightjs.highlightAuto(code).value : code;

  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
}
