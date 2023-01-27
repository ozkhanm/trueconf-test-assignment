<template>
  <div class="floor">
    <p class="floor__label">{{ floorNumber }}</p>

    <div
      class="floor__button-container"
      :class="floorButtonContainerClass"
    >
      <button
        class="button"
        type="button"
        :class="buttonClass"
        @click="floorButtonClickHandler(floorNumber)"
      >
        <span
          class="button__decoration"
          :class="buttonDecorationClass"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "FloorComponent",
  props: {
    floorNumber: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(["elevatorsData"]),
    ...mapGetters(["overallFloorsQue"]),

    isActiveFloor() {
      return this.overallFloorsQue.includes(this.floorNumber) || this.elevatorsData.filter(it => it.currentFloor !== it.targetFloor).findIndex(it => it.targetFloor === this.floorNumber) !== -1;
    },
    floorButtonContainerClass() {
      return this.isActiveFloor ? "floor__button-container--active" : "";
    },
    buttonClass() {
      return this.isActiveFloor ? "button--active" : "";
    },
    buttonDecorationClass() {
      return this.isActiveFloor ? "button__decoration--active" : "";
    }
  },
  methods: {
    ...mapActions(["processFloor"]),

    floorButtonClickHandler(floorNumber) {
      this.processFloor(floorNumber);
    }
  }
};
</script>

<style lang="scss">
.floor {
  height: 100px;
  padding-left: 15px;
  padding-top: 10px;
  padding-bottom: 10px;

  box-sizing: border-box;

  &__label {
    margin: 0;
    margin-bottom: 15px;
  }

  &__button-container {
    position: relative;

    width: 20px;
    height: 20px;

    border: 1px solid #84babe;
    border-radius: 2px;

    &:hover {
      background-color: #e0f5f5;
    }

    &:active {
      background-color: #d8eaea;
    }

    &--active {
      border: 1px solid #f27d15;

      &:hover {
        background-color: #fef4eb;
      }

      &:active {
        background-color: #ffe6d7;
      }
    }
  }
}

.button {
  position: absolute;
  left: 50%;
  top: 50%;

  margin: 0;
  padding: 0;
  height: 13px;
  width: 13px;

  border: 1px solid #229095;
  border-radius: 50%;

  translate: -50% -50%;

  &--active {
    border: 1px solid #f27d15;
  }

  &__decoration {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;

    display: block;
    width: 8px;
    height: 8px;

    background-color: #229095;
    border-radius: 50%;
    
    translate: -50% -50%;
    cursor: pointer;

    &--active {
      background-color: #f27d15;
    }
  }

  &::before{
    content: "";
    position: absolute;

    width: 22px;
    height: 22px;

    translate: -50% -50%;
    cursor: pointer;
  }
}
</style>
