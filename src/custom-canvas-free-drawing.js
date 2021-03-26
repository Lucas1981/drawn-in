/**
* Big shoutout to igorski for helping me fix the trouble with touch events offset problem! Check out his repos: https://github.com/igorski
*/

import CanvasFreeDrawing from 'canvas-free-drawing';

class CustomCanvasFreeDrawing extends CanvasFreeDrawing {
  constructor(...args) {
    super(...args);
  }

  touchStart(event) {
      if (event.changedTouches.length > 0) {
          const _a = event.changedTouches[0];
          const pageX = _a.pageX;
          const pageY = _a.pageY;
          const identifier = _a.identifier;
          const offset = this.getCoordinate();
          const x = pageX - offset.x;
          const y = pageY - offset.y;
          this.touchIdentifier = identifier;
          this.drawPoint(x, y);
      }
  }

  touchMove(event) {
      if (event.changedTouches.length > 0) {
          const _a = event.changedTouches[0];
          const pageX = _a.pageX;
          const pageY = _a.pageY;
          const identifier = _a.identifier;
          const offset = this.getCoordinate();
          const x = pageX - offset.x;
          const y = pageY - offset.y;
          // check if is multi touch, if it is do nothing
          if (identifier != this.touchIdentifier)
              return;
          this.previousX = x;
          this.previousY = y;
          this.drawLine(x, y, event);
      }
    }

    // Lifted from: https://github.com/igorski/zCanvas/blob/master/src/Canvas.js
    getCoordinate() {
      let x = 0;
      let y = 0;
      let theElement = this.canvas;

      while ( theElement.offsetParent ) {
          x         += theElement.offsetLeft;
          y         += theElement.offsetTop;
          theElement = theElement.offsetParent;
      }
      x += theElement.offsetLeft;
      y += theElement.offsetTop;

      return { x, y };
    }
}

export default CustomCanvasFreeDrawing;
