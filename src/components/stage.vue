<template>
  <div>
    <div
      :style="`width: ${width}px; height: ${height}px`"
      class="position-relative mx-auto"
    >
      <img
        class="layer"
        ref="stageImage"
        alt="Staged image"
        :style="`
          width: ${width}px;
          height: ${height}px;
        `"
      ></img>
      <svg
        class="svg layer"
        :style="`
          width: ${width}px;
          height: ${height}px;
        `"
      >
        <rect
          v-for="(rect, actionableIndex) in stagedCanvas.actionables"
          :key="`stage-actionable-${actionableIndex}`"
          class="actionable"
          :x="rect.x"
          :y="rect.y"
          :width="rect.width"
          :height="rect.height"
          @click="handleClickedActionable(rect)"
        ></rect>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    canvases: {
      type: Array,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  data: vm => ({
    stagedCanvas: vm.canvases[0]
  }),
  mounted() {
    this.stageCanvas();
  },
  methods: {
    stageCanvas() {
      // Copy the image from the frame to the stage
      const data = this.stagedCanvas.canvas.save();
      this.$refs.stageImage.src = data;
    },
    handleClickedActionable(actionable) {
      if (actionable.goto === null) return;
      console.log(actionable.goto);
      const canvas = this.canvases.find(({ id }) => id === actionable.goto);
      this.stagedCanvas = canvas;
      this.stageCanvas();
    }
  }
}
</script>

<style scoped lang="scss">
.layer {
  position: absolute;
  top: 0;
  left: 0;
}

.svg {
  ::v-deep .actionable {
    opacity: 0;
  }
}
</style>
