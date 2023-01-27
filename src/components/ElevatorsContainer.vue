<template>
  <div class="elevators">
    <ElevatorShaftComponent 
      v-for="elevator in elevatorsData"
      :key="elevator.id"
      :id="elevator.id"
      :targetFloor="elevator.targetFloor"
      :currentFloor="elevator.currentFloor"
      :status="elevator.status"
      :floorsQue="elevator.floorsQue"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

import ElevatorShaftComponent from "@/components/ElevatorShaftComponent.vue";

export default {
  name: "ElevatorsContainer",
  components: {
    ElevatorShaftComponent
  },
  computed: {
    ...mapState(["elevatorsData"])
  }
};
</script>

<style lang="scss">
.elevators {
  display: flex;
}
</style>
