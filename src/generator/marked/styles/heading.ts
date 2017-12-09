export default function(heading: string, level: number) {
  return `<h${level} class="f${level} lh-title">${heading}</h${level}>`;
}
