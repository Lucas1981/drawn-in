<template>
  <div class="home">
    <div class="control-panel mb-1">
      <b-button
        @click="addCanvas"
        class="mr-1"
      >
        Add canvas
      </b-button>
      <b-button
        variant="danger"
        @click="removeCanvas(index)"
      >
        Remove canvas
      </b-button>
      </div>
    <div
      v-for="(canvas, index) of canvases"
      :key="`canvas-${index}`"
    >
      <b-form-checkbox
        :id="`drawing-mode-checkbox-${index}`"
        v-model="canvas.drawingMode"
        :name="`drawing-mode-checkbox-${index}`"
        @change="handleDrawingModeCheckboxChanged(index)"
      >
        Drawing mode
      </b-form-checkbox>
      <div :id="`canvas-${index}`"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CanvasFreeDrawing from 'canvas-free-drawing';

export default {
  name: 'home',
  data: () => ({
    canvases: []
  }),
  mounted() {
    this.addCanvas();
  },
  methods: {
    removeCanvas(index) {
      this.canvases.splice(index, 1);
    },
    handleDrawingModeCheckboxChanged(index) {
      this.canvases[index].canvas.toggleDrawingMode();
    },
    async addCanvas() {
      let canvas = { drawingMode: true, canvas: null };
      this.canvases.push(canvas);
      await this.$nextTick();
      canvas.canvas = new CanvasFreeDrawing({
        elementId: `canvas-${this.canvases.length - 1}`,
        width: 500,
        height: 500,
      });

      // set properties
      canvas.setLineWidth(10); // in px
      canvas.setStrokeColor([0, 0, 0]); // in RGB

      // listen to events
      canvas.on({ event: 'redraw' }, this.redraw);
    },
    redraw() {
      // Do something
    }
  }
};
</script>
