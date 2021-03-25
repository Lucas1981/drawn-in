<template>
  <div class="home">
    <div
      class="d-flex justify-content-center"
    >
      <b-form-select
        v-model="selectedDimension"
        class="mr-1 custom-select"
        :options="dimensions"
        @change="changeDimensions"
      ></b-form-select>
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
      <canvas
        :id="`canvas-${index}`"
      ></canvas>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CanvasFreeDrawing from 'canvas-free-drawing';

const dimensions = [
  { value: 'iphone', text: 'iPhone 11 Pro/x: 375x812', width: 375, height: 812 },
  { value: 'ipad', text: 'iPad Pro: 834x1194', width: 834, height: 1194 },
  { value: 'imac', text: 'iMac Pro: 1440x900', width: 1440, height: 900 }
];

export default {
  name: 'home',
  data: () => ({
    canvases: [],
    selectedDimension: dimensions[0].value,
    width: dimensions[0].width,
    height: dimensions[0].height
  }),
  mounted() {
    this.addCanvas();
  },
  beforeMount() {
    this.dimensions = dimensions;
  },
  methods: {
    async changeDimensions() {
      const dimension = dimensions.find(({ value }) => value === this.selectedDimension);
      this.width = dimension.width;
      this.height = dimension.height;
      this.canvases = [];
      await this.$nextTick();
      this.addCanvas();
    },
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
        width: this.width,
        height: this.height,
      });

      // set properties
      canvas.canvas.setLineWidth(1); // in px
      canvas.canvas.setStrokeColor([0, 0, 0]); // in RGB

      // listen to events
      canvas.canvas.on({ event: 'redraw' }, this.redraw);
    },
    redraw() {
      // Do something
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  touch-action: none;
}

.custom-select {
  max-width: 320px;
}
</style>
