<template>
  <div class="main-container">
    <ElevatorsContainer />
    <FloorsContainer />
  </div>
</template>

<script>
import ElevatorsContainer from "@/components/ElevatorsContainer.vue";
import FloorsContainer from "@/components/FloorsContainer.vue";

export default {
  name: "App",
  components: {
    ElevatorsContainer,
    FloorsContainer
  }
};
</script>

<style lang="scss">
.main-container {
  display: flex;

  border-bottom: 1px solid rgb(236, 232, 232);
}
</style>
