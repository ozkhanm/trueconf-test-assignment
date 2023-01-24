<template>
  <div class="elevator-shaft">
    <div 
      v-for="data in floorsQuantity"
      :key="data"
      class="elevator-floor"
      :class="isActiveFloor(data)"
    />
  </div>
</template>

<script>
import data from "@/config.json";

export default {
  name: "ElevatorShaftComponent",
  data() {
    return {
      floorsQuantity: parseInt(data.FLOORS_QUANTITY)
    };
  },
  methods: {
    isActiveFloor(floor) {
      return floor === this.floorsQuantity ? "elevator-floor--active" : null;
    }
  }
};
</script>

<style lang="scss">
.elevator-shaft {
  display: flex;
  flex-direction: column;
  margin-right: 10px;

  border-left: 2px solid rgb(189, 188, 188);
  border-right: 2px solid rgb(189, 188, 188);

  &:last-child {
    margin-right: 0;
  }
}

.elevator-floor {
  width: 100px;
  height: 100px;

  &--active {
    background-color: #00feff;
  }

  &::before {
    position: absolute;
    content: "";
    z-index: -1;

    width: 100%;
    
    border-bottom: 1px solid rgb(236, 232, 232);
  }
}
</style>
