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
      <div :id="`canvas-${index}`"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CanvasFreeDrawing from 'canvas-free-drawing';
import { ButtonPlugin } from 'bootstrap-vue';

export default {
  name: 'home',
  data: () => ({
    canvases: []
  }),
  components: {
    ButtonPlugin
  },
  mounted() {
    this.addCanvas();
  },
  methods: {
    removeCanvas(index) {
      this.canvases.splice(index, 1);
    },
    async addCanvas() {
      let canvas = null;
      this.canvases.push(canvas);
      await this.$nextTick();
      canvas = new CanvasFreeDrawing({
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
