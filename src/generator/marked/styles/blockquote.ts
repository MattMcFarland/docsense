export default function(quote: string) {
  return `
  <div class="pv1 pl1">
  <blockquote class="ml0 mt0 pl4 black-80 bl bw2 b--blue">
    <p class="f3 f2-m f1-l lh-copy measure mt0">
    ${quote}
    </p>
  </blockquote>
</div>
  `;
}
