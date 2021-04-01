const renderFile = (width, height, canvases) => {
  const style = `<style>
      body {
        margin: 0;
        padding: 0;
        border-width: 0;
      }

      #app {
        position: relative;
        margin: auto;
      }

      #image,
      #svg {
        position: absolute;
        top: 0;
        left: 0;
        width: ${width}px;
        height: ${height}px;
      }

      #image {
        border-width: 1px;
        border-style: solid;
        border-color: #808080;
      }

      #svg {
        opacity: 0;
      }
    </style>`;

  const head = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Exported prototype</title>
    ${style}
  </head>
  <body>
    <div id="app">
      <img id="image" class="image" alt="" />
      <svg id="svg" class="svg"></svg>
    </div>

    <script src="https://d3js.org/d3.v6.min.js"></script>`;

const foot = `</body>
</html>`;

  const js = `<script type="text/javascript">
(function(document, d3) {
    'use strict';

    var frameIndex = 0;
    var frames = ${JSON.stringify(canvases)};
    var svg = d3.select('#svg');
    var image = document.getElementById('image');

    function stageFrame() {
      var frame = frames[frameIndex];
      image.src = frame.imageData;
      svg.selectAll('*').remove();
      frame.actionables.forEach(function(actionable) {
        svg
          .append('rect')
          .attr('x', actionable.x)
          .attr('y', actionable.y)
          .attr('width', actionable.width)
          .attr('height', actionable.height)
          .on('click', function() {
            if (actionable.goto === null) return;
            frameIndex = actionable.goto;
            stageFrame();
          });
      });
    }

    stageFrame();

})(document, d3);
</script>`;

  const body = `\n${js}`;

  return `${head}\n${body}\n${foot}`;
}

const downloadFile = (filename, width, height, canvases) => {
  const data = renderFile(width, height, canvases);
  const encodedData = encodeURIComponent(data);
  const a = document.createElement('a');
  a.setAttribute('download', filename);
  a.setAttribute('href', `data:text/html;charset=utf-8,${encodedData}`);
  a.style.display = 'none';
  document.getElementsByTagName('body')[0].appendChild(a);
  a.click();
  document.getElementsByTagName('body')[0].removeChild(a);
};

export {
  renderFile,
  downloadFile
};
