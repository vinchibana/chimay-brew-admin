<template>
  <div class="dashboard-container">
    <Card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
import Card from "@/views/dashboard/Card";
import Observe from "@/views/dashboard/Observe";
import Sale from "@/views/dashboard/Sale";
export default {
  name: "Dashboard",
  components: {
    Card,
    Observe,
    Sale,
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
