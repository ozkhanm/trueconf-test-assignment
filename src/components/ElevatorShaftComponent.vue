<template>
  <div class="elevator-shaft">
    <div 
      v-for="floorNumber in floorsQuantity"
      :key="floorNumber"
      class="elevator-floor"
      :class="getActiveFloorClass(floorNumber) + ' ' + getMoveDirectionClass(floorNumber) + ' ' + getElevatorWaitingClass(floorNumber)"
    >
      <ElevatorDisplayBoard
        v-if="isActiveElevator(floorNumber)"
        :targetFloorNumber="targetFloor"
        :moveDirection="moveDirection"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import ElevatorDisplayBoard from "@/components/ElevatorDisplayBoard.vue";

import data from "@/config.json";
import {
  ELEVATOR_STATUS,
  ELEVATOR_MOVING_DIRECTION
} from "@/constants";

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
    status: {
      type: String,
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
      return this.targetFloor - this.currentFloor >= 0 ? ELEVATOR_MOVING_DIRECTION.UP : ELEVATOR_MOVING_DIRECTION.DOWN;
    }
  },
  methods: {
    ...mapActions(["processFloor", "continueOperations"]),

    getActiveFloorClass(floorNumber) {
      return floorNumber === this.currentFloor ? "elevator-floor--active" : "";
    },
    getMoveDirectionClass(floorNumber) {
      if (this.status !== ELEVATOR_STATUS.VACANT && floorNumber === this.currentFloor) {
        return this.targetFloor - this.currentFloor >= 0 ? "elevator-floor--moving-up" : "elevator-floor--moving-down";
      }

      return "";
    },
    isActiveElevator(floorNumber) {
      return this.status !== ELEVATOR_STATUS.VACANT && floorNumber === this.currentFloor ? true : false;
    },
    getElevatorWaitingClass(floorNumber) {
      return this.status === ELEVATOR_STATUS.CHILL && floorNumber === this.targetFloor ? "elevator-floor--chill" : "";
    }
  },
  watch: {
    "$store.state.elevatorsData": function() {
      if (this.floorsQue.length !== 0 && this.status === ELEVATOR_STATUS.VACANT) {
        this.processFloor(this.floorsQue[0]);
      }
    }
  },
  mounted() {
    if (this.status !== ELEVATOR_STATUS.VACANT) {
      this.continueOperations({
        id: this.id,
        targetFloor: this.targetFloor,
        currentFloor: this.currentFloor,
        status: this.status,
        floorsQue: this.floorsQue
      });
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

  &--moving-up {
    @keyframes float-up {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-100px);
      }
    }

    animation: float-up 1s linear;
  }

  &--moving-down {
    @keyframes float-down {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(100px);
      }
    }

    animation: float-down 1s linear;
  }

  &--chill {
    @keyframes blink {
      0% {
        opacity: 1;
      }
      10% {
        opacity: 0;
      }
      20% {
        opacity: 1;
      }
      30% {
        opacity: 0;
      }
      40% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
      60% {
        opacity: 1;
      }
      70% {
        opacity: 0;
      }
      80% {
        opacity: 1;
      }
      90% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    animation: blink 3s linear;
  }
}
</style>
