<template>
  <div class="home">
    <div
      class="d-flex justify-content-center align-items-center"
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
        Add frame
      </b-button>
      <b-button
        variant="danger"
        @click="reset"
        class="mr-1"
      >
        Clear frames
      </b-button>
      <div class="h4 mb-2">
        <b-icon-play-circle
          variant="info"
          v-b-modal.modal-center
          class="cursor-pointer"
          tabindex="0"
          @click="handlePlayPressed"
        ></b-icon-play-circle>
      </div>
      <b-modal
        id="modal-center"
        centered
        hide-footer
        title="Playback"
      >
        <stage
          :canvases="canvases"
          :width="width"
          :height="height"
        />
      </b-modal>
    </div>

    <div
      v-for="(canvas, index) of canvases"
      :key="`canvas-${canvas.id}`"
      class="mt-2"
    >
      <h4>Frame {{ index + 1}}</h4>
      <div class="d-flex justify-content-center align-items-center mb-1">
        <b-form-input
          :id="`color-input-${canvas.id}`"
          type="color"
          v-model="canvas.color"
          class="custom-small-input mr-1"
          @change="handleChangeColor(canvas)"
        ></b-form-input>
        <b-form-input
          :id="`line-width-input-${canvas.id}`"
          type="number"
          v-model="canvas.lineWidth"
          class="custom-small-input mr-1"
          @change="handleChangeLineWidth(canvas)"
        ></b-form-input>
        <b-form-checkbox
          :id="`drawing-mode-checkbox-${canvas.id}`"
          v-model="canvas.drawingMode"
          class="mr-1"
          :name="`drawing-mode-checkbox-${canvas.id}`"
          @change="handleDrawingModeCheckboxChanged(canvas.id)"
        >
          Drawing mode
        </b-form-checkbox>
        <b-icon-arrow-counterclockwise
          tabindex="0"
          class="mr-1 cursor-pointer"
          @click="handleUndoClicked(canvas.canvas)"
        ></b-icon-arrow-counterclockwise>
        <b-icon-arrow-clockwise
          tabindex="0"
          class="mr-1 cursor-pointer"
          @click="handleRedoClicked(canvas.canvas)"
        ></b-icon-arrow-clockwise>
        <b-icon-plus-circle
          tabindex="0"
          class="mr-1 cursor-pointer"
          @click="cloneCanvas(index, canvas.canvas)"
        ></b-icon-plus-circle>
        <b-icon-file-x
          tabindex="0"
          class="mr-1 cursor-pointer"
          @click="clearCanvas(canvas.canvas)"
        ></b-icon-file-x>
        <b-icon-trash
          tabindex="0"
          class="cursor-pointer"
          @click="removeCanvas(canvas.id)"
        >
          Remove
        </b-icon-trash>
      </div>
      <div
        class="text-align-center text-center"
      >
        <div
          :style="`width: ${width}px; height: ${height}px`"
          class="position-relative mx-auto"
        >
          <canvas
            :id="`canvas-${canvas.id}`"
            class="layer"
            :class="{ 'touch-action-none': canvas.drawingMode }"
            :style="`
              width: ${width}px;
              height: ${height}px;
              z-index: ${canvas.drawingMode ? 1 : 0}`
            "
          ></canvas>
          <svg
            :id="`svg-${canvas.id}`"
            class="svg layer"
            :style="`
              width: ${width}px;
              height: ${height}px;
              z-index: ${canvas.drawingMode ? 0 : 1}
            `"
          >
            <rect
              @click="handleClickedSvg(canvas, $event)"
              class="clickable-rect"
              x="0"
              y="0"
              :width="width"
              :height="height"
            >
            </rect>
            <rect
              v-for="(rect, actionableIndex) in canvas.actionables"
              :key="`actionable-${index}-${actionableIndex}`"
              :id="`actionable-${index}-${actionableIndex}`"
              class="actionable"
              :x="rect.x"
              :y="rect.y"
              :width="rect.width"
              :height="rect.height"
            ></rect>
          </svg>
          <b-popover
            v-for="(rect, actionableIndex) in canvas.actionables"
            :key="`popover-${index}-${actionableIndex}`"
            :target="`actionable-${index}-${actionableIndex}`"
            :ref="`popover-${index}-${actionableIndex}`"
            triggers="click"
            placement="top"
          >
            <template #title>Actionable</template>
            <div class="d-flex">
              <b-form-select
                v-model="rect.goto"
                class="mr-1 custom-select"
                :options="computedFrames"
              ></b-form-select>
              <b-button
                variant="danger"
                size="sm"
                @click="removeActionable(canvas, actionableIndex)"
              >
                Remove actionable
              </b-button>
            </div>
          </b-popover>
        </div>
      </div>
    </div>
   </div>
</template>

<script>
// @ is an alias to /src
import CustomCanvasFreeDrawing from '@/custom-canvas-free-drawing';
import Stage from '@/components/stage';
import { hexToRgb } from '@/helper-functions';

const defaultColor = '#4A5056'
const dimensions = [
  { value: 'iphonePortrait', text: 'iPhone 11 Pro/x portrait: 375x812', width: 375, height: 812 },
  { value: 'iphoneLandscape', text: 'iPhone 11 Pro/x landscape: 812x375', width: 812, height: 375 },
  { value: 'ipadPortrait', text: 'iPad Pro portrait: 834x1194', width: 834, height: 1194 },
  { value: 'ipadLandscape', text: 'iPad Pro landscape: 1194x834', width: 1194, height: 834  },
  { value: 'ipad12Portrait', text: 'iPad Pro 12.9 portrait: 1024x1366', width: 1024, height: 1366 },
  { value: 'ipad12Landscape', text: 'iPad Pro 12.9 landscape: 1366x1024', width: 1366, height: 1024 },
  { value: 'imacPortrait', text: 'iMac Pro portrait: 900x1400', width: 900, height: 1440 },
  { value: 'imacLandscape', text: 'iMac Pro landscape: 1440x900', width: 1440, height: 900 }
];

export default {
  name: 'home',
  components: {
    Stage
  },
  data: () => ({
    canvases: [],
    selectedDimension: dimensions[0].value,
    width: dimensions[0].width,
    height: dimensions[0].height,
    id: 0,
    popoverTarget: ''
  }),
  mounted() {
    this.addCanvas();
  },
  beforeMount() {
    this.dimensions = dimensions;
  },
  computed: {
    computedFrames() {
      const result = this.canvases.map(({ id }, index) => ({
        text: `Frame ${index + 1}`,
        value: id
      }));

      return [
        { text: 'Select frame to goto', value: null },
        ...result
      ];
    }
  },
  methods: {
    handlePlayPressed() {
      // Make sure all the popups are closed so they don't show up over the modal
      this.$root.$emit('bv::hide::popover');
    },
    changeDimensions() {
      const dimension = dimensions.find(({ value }) => value === this.selectedDimension);
      this.width = dimension.width;
      this.height = dimension.height;
      this.reset();
    },
    async reset() {
      this.canvases = [];
      this.id = 0;
      await this.$nextTick();
      this.addCanvas();
    },
    removeCanvas(id) {
      const index = this.getCanvasById(id);
      this.canvases.splice(index, 1);
    },
    removeActionable(canvas, index) {
      canvas.actionables.splice(index, 1);
    },
    handleDrawingModeCheckboxChanged(id) {
      const index = this.getCanvasById(id);
      this.canvases[index].canvas.toggleDrawingMode();
    },
    handleClickedSvg(canvas, event) {
      canvas.actionables.push({
        x: event.offsetX,
        y: event.offsetY,
        width: 100,
        height: 50,
        goto: null
      })
    },
    getCanvasById(id) {
      return this.canvases.findIndex(record => record.id === id);
    },
    handleChangeColor({canvas, color}) {
      canvas.setStrokeColor(hexToRgb(color)); // in RGB
    },
    handleChangeLineWidth({ canvas, lineWidth }) {
      canvas.setLineWidth(lineWidth);
    },
    handleUndoClicked(canvas) {
      canvas.undo();
    },
    handleRedoClicked(canvas) {
      canvas.redo();
    },
    clearCanvas(canvas) {
      canvas.clear();
    },
    async cloneCanvas(index, sourceCanvas) {
      const targetCanvas = await this.addCanvas(index);
      const data = sourceCanvas.save();
      targetCanvas.canvas.restore(data);
    },
    async addCanvas(index = null) {
      const canvas = {
        drawingMode: true,
        canvas: null,
        color: defaultColor,
        lineWidth: 1,
        id: this.id,
        actionables: []
      };
      // If no index is specified, just push it onto the stack
      if (index === null) {
        this.canvases.push(canvas);
      } else {
        // Otherwise wedge it into the array
        this.canvases.splice(index, 0, canvas);
      }
      await this.$nextTick();
      canvas.canvas = new CustomCanvasFreeDrawing({
        elementId: `canvas-${this.id}`,
        width: this.width,
        height: this.height,
      });

      // set properties
      canvas.canvas.setLineWidth(canvas.lineWidth); // in px

      canvas.canvas.setStrokeColor(hexToRgb(canvas.color)); // in RGB

      // listen to events
      canvas.canvas.on({ event: 'redraw' }, this.redraw);

      this.id++;

      return canvas;
    },
    redraw() {
      // Do something
    }
  }
};
</script>

<style scoped lang="scss">
.touch-action-none {
  touch-action: none;
}

.custom-select {
  max-width: 320px;
}

.custom-small-input {
  max-width: 64px;
}

.cursor-pointer {
  cursor: pointer;
}

.layer {
  position: absolute;
  top: 0;
  left: 0;
}

.svg {
  ::v-deep .actionable {
    stroke: #0000ff;
    fill: #8888ff;
    opacity: 0.3;
  }

  ::v-deep .clickable-rect {
    opacity: 0;
  }
}
</style>
