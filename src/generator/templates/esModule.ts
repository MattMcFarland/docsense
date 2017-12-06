const PascalCase = require('pascal-case');

module.exports = (content: any) => {
  const { esModule, file_id } = content;
  return `
  <div>
  <header>
    <h1 class="mb0"><i class="black-50 pr2 fa fa-cubes" aria-hidden="true"></i>${
      file_id
    }</h1>
    <div class="f4">${renderImportHeadingHint(file_id)}</div>
    </header>
    <div>${renderExports(esModule.exports)}</div>
    <hr/>
    <h5>db info:</h5>
    ${debugCode(esModule)}
  </div>
  `;
};

function debugCode(esModule: any) {
  return `
 <pre><code class="javascript">${JSON.stringify(esModule, null, 2)}</code></pre>
 `;
}

function identityName(file_id: any) {
  return file_id
    ? file_id
        .split('/')
        .pop()
        .split('.')
        .shift()
    : '';
}
function renderExports(esmExports: any) {
  if (!esmExports) return '';
  return esmExports
    .map((exp: any) => {
      return `<div class="pl2">${renderFunctionHeader(exp)}${renderImportHint(
        exp
      )}</div>`;
    })
    .join('');
}

function importType(export_id: string, file_id: string) {
  return export_id === 'default'
    ? `my${PascalCase(identityName(file_id))}`
    : `{ ${export_id} }`;
}

function renderImportHeadingHint(file_id: string) {
  return `<pre>
  <code class="javascript">import * as my${PascalCase(
    identityName(file_id)
  )} from "${file_id}"</code>
  </pre>`;
}

function renderImportHint(esm: any) {
  if (!esm) return '';
  if (!esm.export_id) return '';
  if (esm.function) {
    return `<pre><code class="javascript">import ${importType(
      esm.export_id,
      esm.function.file_id
    )} from "${esm.function.file_id}"</code></pre>`;
  }
  if (esm.file_id) {
    return `<pre><code class="javascript">import ${importType(
      esm.export_id,
      esm.file_id
    )} from "${esm.file_id}"</code></pre>`;
  }
}
function renderFunctionHeader(esm: any) {
  if (!esm) return '';
  if (esm && esm.export_id) {
    const { export_id } = esm;
    let loc = null;
    if (esm.function && esm.function.function_id) {
      loc = esm.function.function_id.split('@');
    }

    return `
    <a class="pl1 link dim black-50" href="#${export_id}">
      <div class="${
        export_id === 'default' ? 'f3' : 'f4'
      } pl1 link dim black-60" id= "${export_id}">
        <span><i class="fa fa-link black-30 mr2" aria-hidden="true"></i>${
          export_id
        }</span>
        ${applySignature(esm)}
        ${
          loc
            ? `<a class="f7" href="${esm.file_id}/source.html?loc=${
                loc[1]
              }" title="view source">
              ${'&lt;' + loc[0] + ':' + loc[1] + '&gt;'}</a>`
            : ''
        }
      </div>
    </a>
    <p class="pl3">
    <em>${renderDescription(esm)}</em>
    </p>
    `;
  }
}

function applySignature(esm: any) {
  if (esm.function && esm.function.params) {
    return '(' + esm.function.params.join(',&nbsp;') + ')';
  }
  return '()';
}
function renderDescription(esm: any) {
  return esm.jsdoc && esm.jsdoc[0].description
    ? esm.jsdoc[0].description
    : esm.function && esm.function.jsdoc && esm.function.jsdoc[0].description
      ? esm.function.jsdoc[0].description
      : '';
}
