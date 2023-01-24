<template>
  <div class="elevators">
    <ElevatorShaftComponent 
      v-for="data in elevatorsQuantity"
      :key="data"
    />
  </div>
</template>

<script>
import ElevatorShaftComponent from "@/components/ElevatorShaftComponent.vue";

import data from "@/config.json";

export default {
  name: "ElevatorsContainer",
  components: {
    ElevatorShaftComponent
  },
  data() {
    return {
      elevatorsQuantity: parseInt(data.ELEVATORS_QUANTITY)
    };
  }
};
</script>

<style lang="scss">
.elevators {
  display: flex;
}
</style>
