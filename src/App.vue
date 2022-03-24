<template>
  <FibonacciGrid :width="50" :height="50" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import FibonacciGrid from "./components/FibonacciGrid.vue";

@Options({
  components: {
    FibonacciGrid,
  },
})
export default class App extends Vue {}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 1200px;
  height: 1200px;
}

body {
  margin: 0 0;
}
</style>
