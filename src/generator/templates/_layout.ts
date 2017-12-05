module.exports = ({ content, data }: any) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <title> </title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://unpkg.com/normalize.css@7.0.0/normalize.css" />
  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/tachyons/css/tachyons.min.css">
  <link rel="stylesheet" href="https://opensource.keycdn.com/fontawesome/4.7.0/font-awesome.min.css" integrity="sha384-dNpIIXE8U05kAbPhy3G1cz+yZmTzA6CY8Vg/u2L9xRnHjJiAK76m2BIEaSEV+/aU" crossorigin="anonymous">
  <style>
    html * {
      font-family: 'Open Sans', sans-serif;
      color: #444;
    }
  </style>
  <link rel="stylesheet"
  href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.12.0/build/styles/default.min.css">
  <script src="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.12.0/build/highlight.min.js"></script>
  <script>hljs.initHighlightingOnLoad();</script>
</head>

<body class="bg-black-10">
  <div class="mw9 center ph3-ns bg-white">
    <div class="cf ph2-ns">
      <div class="fl w-100 w-30-ns pa2">
        <div class="bg-dark-gray pv4 pl2">
          <div class="f2 near-white pa3 pl3 mb1">
            <a class="pa2 pl4 link dim white db" href="#" title="Home">DocSense</a>
          </div>
          <div class="f3 near-white pa3 pl3 mb2">Modules</div>
          ${data &&
            data.esModules &&
            data.esModules.map((esm: any) => {
              return `<a class="pa2 pl4 link dim white db" href="/${
                esm.file_id
              }/index.html" title="${esm.file_id}">${esm.file_id}</a>`;
            })}
          <div class="f3 near-white pa3 pl3 mb2">Classes</div>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">One</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Two</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Three</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Four</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Five</a>
          <div class="f3 near-white pa3 pl3 mb2">Manual</div>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">One</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Two</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Three</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Four</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Five</a>
          <div class="f3 near-white pa3 pl3 mb2">More</div>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">One</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Two</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Three</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Four</a>
          <a class="pa2 pl4 link dim white db" href="#" title="Home">Five</a>
        </div>

      </div>
      <div class="fl w-100 w-60-ns pa2">
        <div class="bg-white pv4 pl2">
          ${content}
        </div>
      </div>
    </div>
  </div>
</body>

</html>
`;
