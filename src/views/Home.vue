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
        @click="reset"
        class="mr-1"
      >
        Remove canvases
      </b-button>
      <b-button
        variant="outline-primary"
        v-b-modal.modal-center
      >Play</b-button>
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
          class="custom-color-input mr-1"
          @change="handleChangeColor(canvas)"
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
        <b-button
          variant="warning"
          size="sm"
          class="mr-1"
          @click="clearCanvas(canvas.canvas)"
        >
          Clear canvas
        </b-button>
        <b-button
          variant="danger"
          size="sm"
          @click="removeCanvas(canvas.id)"
        >
          Remove canvas
        </b-button>
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
import CanvasFreeDrawing from 'canvas-free-drawing';
import Stage from '@/components/stage';
import { hexToRgb } from '@/helper-functions';

const dimensions = [
  { value: 'iphone', text: 'iPhone 11 Pro/x: 375x812', width: 375, height: 812 },
  { value: 'ipad', text: 'iPad Pro: 834x1194', width: 834, height: 1194 },
  { value: 'imac', text: 'iMac Pro: 1440x900', width: 1440, height: 900 }
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
    clearCanvas(canvas) {
      canvas.clear();
    },
    async addCanvas() {
      const canvas = {
        drawingMode: true,
        canvas: null,
        color: '#000000',
        lineWidth: 1,
        id: this.id,
        actionables: []
      };
      this.canvases.push(canvas);
      await this.$nextTick();
      canvas.canvas = new CanvasFreeDrawing({
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

.custom-color-input {
  max-width: 64px;
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
