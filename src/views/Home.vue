<template>
  <div class="home">
    <div id="cfd"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import CanvasFreeDrawing from 'canvas-free-drawing'
export default {
  name: 'home',
  components: {
    HelloWorld,
  },
  data: () => ({
    cfd: null
  }),
  mounted() {
    // initialize
    this.cfd = new CanvasFreeDrawing({
      elementId: 'cfd',
      width: 500,
      height: 500,
    });

    // set properties
    this.cfd.setLineWidth(10); // in px
    this.cfd.setStrokeColor([0, 0, 255]); // in RGB

    // listen to events
    this.cfd.on({ event: 'redraw' }, this.redraw);
  },
  methods: {
    redraw() {
      // Do something
    }
  }
};
</script>
