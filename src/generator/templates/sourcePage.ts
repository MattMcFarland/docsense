module.exports = (content: any) => `
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.1.0/highlightjs-line-numbers.min.js"></script>
<div id="codeview" style="display:none"><pre><code>${
  content.sourceCode
}</code></pre></div>
<style>
.hljs { padding: 0}
.hljs-ln { width: 100% }
.hljs-ln-line.hljs-ln-n {
  color: #bbb;
  border-right: thin solid #bbb;
  text-align: right;
  background: #fafafa;
  padding-right: 8px;
}
.selected {
  background-color: #ffff8a;
}
.selected .hljs-ln-line.hljs-ln-n {
  font-weight: bold;
  color: #333;
}
.hljs-ln-code .hljs-ln-line{
  padding-left: 8px;
}

</style>
<script>
hljs.initLineNumbersOnLoad();</script>
<script>

setTimeout(tryGetLine, 10)

function getLine() {
  var line = window.location.href.split('#')[1]
  var row = document.querySelectorAll('.hljs-ln tr')[line-1]
  row.style="background: #ffff9c"
  row.id=line
  document.getElementById('codeview').style="display:block"
  setTimeout(() => row.scrollIntoView(true), 10)

}

function tryGetLine() {
  if (document.querySelectorAll('.hljs-ln tr').length === 0) {
    return setTimeout(tryGetLine, 10)
  }
  getLine()
}
</script>
`;
