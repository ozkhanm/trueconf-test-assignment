<template>
  <div class="board">
    <div class="board__indicator">
      <img
        v-if="moveDirection === 'UP'"
        src="../assets/arrow-up.png"
        width="12"
        height="12"
      />

      <img
        v-if="moveDirection === 'DOWN'"
        src="../assets/arrow-down.png"
        width="12"
        height="12"
      />
    </div>
    <span class="board__number">{{ targetFloorNumber }}</span>
  </div>
</template>

<script>
export default {
  name: "ElevatorDisplayBoard",
  props: {
    targetFloorNumber: {
      type: Number,
      required: true
    },
    moveDirection: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
.board {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  margin: 0 auto;
  margin-top: 10px;
  padding-top: 3px;
  padding-bottom: 3px;

  background-color: #0e9898;
  border-radius: 2px;

  &__indicator {
    margin-right: 10px;
  }

  &__number {
    color: #fff;
    font-size: 14px;
  }
}
</style>
