module.exports = (content: any) => {
  const { esModule, file_id } = content;
  return `<h1>${file_id}</h1><div>${renderExports(esModule.exports)}</div>
  <pre><code class="javascript">${JSON.stringify(
    esModule,
    null,
    2
  )}</code></pre>
  `;
};

function renderExports(esmExports: any) {
  if (!esmExports) return '';
  return esmExports.map((exp: any) => {
    return renderFunctionHeader(exp) + renderImportHint(exp);
  });
}

function renderImportHint(esm: any) {
  if (!esm) return '';
  if (!esm.export_id) return '';
  return `
    <pre><code class="javascript">import { ${esm.export_id} } from "${
    esm.function.file_id
  }"</code></pre>
  `;
}
function renderFunctionHeader(esm: any) {
  if (!esm) return '';
  if (esm && esm.export_id) {
    const { export_id } = esm;
    return `
    <a href="#${export_id}">
      <h3 id= "${export_id}">${export_id}</h3>
    </a>
    ${(esm.function &&
      esm.function.jsdoc &&
      esm.function.jsdoc[0].description) ||
      'no description'}
    `;
  }
}
