<template>
  <div class="floors">
    <FloorComponent
      v-for="floorNumber in floorsQuantity"
      :key="floorNumber"
      :floorNumber="floorNumber"
    />
  </div>
</template>

<script>
import FloorComponent from "@/components/FloorComponent.vue";

import data from "@/config.json";

export default {
  name: "FloorsContainer",
  components: {
    FloorComponent
  },
  data() {
    return {
      floorsQuantity: parseInt(data.FLOORS_QUANTITY)
    };
  }
};
</script>

<style lang="scss">
.floors {
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
}
</style>
