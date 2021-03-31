<template>
  <g ref="group" class="group"></g>
</template>

<script>
import * as d3 from 'd3';

const MAP_HEIGHT = 2500;
const MAP_WIDTH = MAP_HEIGHT * Math.sqrt(2);

const MAX_TRANSLATE_X = MAP_WIDTH / 2;
const MIN_TRANSLATE_X = -MAX_TRANSLATE_X;

const MAX_TRANSLATE_Y = MAP_HEIGHT / 2;
const MIN_TRANSLATE_Y = -MAX_TRANSLATE_Y;

const MIN_RECT_WIDTH = 20;
const MIN_RECT_HEIGHT = 20;

const HANDLE_R = 5;
const HANDLE_R_ACTIVE = 12;

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    container: null
  },
  data: vm => ({
    localValue: {
      ...vm.value,
    }
  }),
  mounted() {
    this.group = d3.select(this.$refs.group);
    this.initiate();
    this.update();
  },
  methods: {
    initiate() {
      const enterGroups = this.group
        .selectAll('.bg')
        .data([this.localValue])
        .enter();

      enterGroups
        .append('rect')
        .classed("bg", true)
        .attr('id', this.id)
        .call(d3.drag()
          .container(this.container)
          .on("drag", this.rectMoving)
        );

      const that = this;
      const circles = this.group
        .append("g")
        .classed("circles", true);

      circles
        .append("circle")
        .classed("topleft", true)
        .attr("r", HANDLE_R)
        .call(d3.drag()
          .container(this.container)
          .subject(function(event) { return { x: event.x, y: event.y} })
          .on("drag", function(event) { that.rectResizing(event, this); })
        );

        circles
          .append("circle")
          .classed("bottomright", true)
          .attr("r", HANDLE_R)
          .call(d3.drag()
            .container(this.container)
            .subject(function(event) { return { x: event.x, y: event.y } })
            .on("drag", function(event) { that.rectResizing(event, this); })
          );
    },
    rectResizing(event, el) {
      const d = this.localValue;
      const dragX = Math.max(
        Math.min(event.x, MAX_TRANSLATE_X),
        MIN_TRANSLATE_X
      );

      const dragY = Math.max(
        Math.min(event.y, MAX_TRANSLATE_Y),
        MIN_TRANSLATE_Y
      );

      if (d3.select(el).classed("topleft")) {
        const newWidth = Math.max(d.width + d.x - dragX, MIN_RECT_WIDTH);

        d.x += d.width - newWidth;
        d.width = newWidth;

        const newHeight = Math.max(d.height + d.y - dragY, MIN_RECT_HEIGHT);

        d.y += d.height - newHeight;
        d.height = newHeight;
      } else {
        d.width = Math.max(dragX - d.x, MIN_RECT_WIDTH);
        d.height = Math.max(dragY - d.y, MIN_RECT_HEIGHT);
      }

      this.update();
    },
    rectMoving(event, d) {
      const dragX = Math.max(
        Math.min(event.x, MAX_TRANSLATE_X - d.width),
        MIN_TRANSLATE_X
      );

      const dragY = Math.max(
        Math.min(event.y, MAX_TRANSLATE_Y - d.height),
        MIN_TRANSLATE_Y
      );

      d.x = dragX;
      d.y = dragY;

      this.update();
    },
    update() {
      const d = this.localValue;

      this.group
        .attr("transform", `translate(${d.x},${d.y})`);

      this.group
        .select("rect.bg")
        .attr("height",  d.height)
        .attr("width", d.width);

      this.group
        .select("circle.bottomright")
        .attr("cx", d.width)
        .attr("cy", d.height);

      this.$emit('input', d)
    }
  }
};
</script>

<style scoped lang="scss">
.group {
  ::v-deep .bg,
  ::v-deep .topleft,
  ::v-deep .bottomright {
    fill: #8888ff;
    stroke: #0000ff;
    opacity: 0.3;
  }
}
</style>
