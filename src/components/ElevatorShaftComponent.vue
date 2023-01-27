<template>
  <div class="elevator-shaft">
    <div 
      v-for="floorNumber in floorsQuantity"
      :key="floorNumber"
      class="elevator-floor"
      :class="getActiveFloorClass(floorNumber)"
    >
      <ElevatorDisplayBoard
        v-if="isActiveElevator(floorNumber)"
        :floorNumber="floorNumber"
        :moveDirection="moveDirection"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import ElevatorDisplayBoard from "@/components/ElevatorDisplayBoard.vue";

import data from "@/config.json";

export default {
  name: "ElevatorShaftComponent",
  components: {
    ElevatorDisplayBoard
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    targetFloor: {
      type: [Number, null]
    },
    currentFloor: {
      type: Number,
      required: true
    },
    isBusy: {
      type: Boolean,
      required: true
    },
    floorsQue: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      floorsQuantity: parseInt(data.FLOORS_QUANTITY)
    };
  },
  computed: {
    ...mapState(["elevatorsData"]),

    moveDirection() {
      return this.targetFloor - this.currentFloor >= 0 ? "UP" : "DOWN";
    }
  },
  methods: {
    ...mapActions(["processFloor"]),

    getActiveFloorClass(floorNumber) {
      return floorNumber === this.currentFloor ? "elevator-floor--active" : null;
    },
    isActiveElevator(floorNumber) {
      return this.isBusy && floorNumber === this.currentFloor ? true : false;
    }
  },
  watch: {
    "$store.state.elevatorsData": function() {
      if (this.floorsQue.length !== 0 && this.isBusy === false) {
        this.processFloor(this.floorsQue[0]);
      }
    }
  }
};
</script>

<style lang="scss">
.elevator-shaft {
  display: flex;
  flex-direction: column-reverse;
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
