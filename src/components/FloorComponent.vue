<template>
  <div class="floor">
    <p class="floor__label">{{ floorNumber }}</p>

    <div class="floor__button-container">
      <button
        class="button"
        type="button"
        @click="floorButtonClickHandler(floorNumber)"
      >
        <span class="button__decoration" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "FloorComponent",
  props: {
    floorNumber: {
      type: Number,
      required: true
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

      & .floor-button {
        background-color: #e0f5f5;
      }
    }

    &:active {
      background-color: #d8eaea;

      & .floor-button {
        background-color: #d8eaea;
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
