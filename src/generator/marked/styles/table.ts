export const table = (header: string, body: string) => {
  return `
  <div class="pa4">
  <div class="overflow-auto">
  <table class="w-100 mw8 left" cellspacing="0">
  <thead class="f5 fwb left th-solid" style="text-align: left">${header}</thead>
  <tbody class="lh-copy">${body}</tbody>
  </table>
  </div>
  </div>
  `;
};

export const tableRow = (content: string) => {
  return `<tr>${content}</tr>`;
};

export const tableCell = (content: string, flags: any) => {
  return `<td class="pv3 pr3 bb b--black-20">${content}</td>`;
};
