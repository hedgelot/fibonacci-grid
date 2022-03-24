<template>
  <div id="grid">
    <FibonacciRow
      @valueChanged="test"
      v-for="(n, i) in this.$store.getters.height"
      :key="i"
      :y="i"
      :length="this.$store.getters.width"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import FibonacciRow from "./FibonacciRow.vue";
import store from "@/store";

@Options({
  components: {
    FibonacciRow,
  },
  props: {
    width: Number,
    height: Number,
  },
})
export default class FibonacciGrid extends Vue {
  width!: number;
  height!: number;
  autoHit = false;
  mounted() {
    store.commit("initGrid", { x: this.width, y: this.height });

    if (this.autoHit) {
      setInterval(() => {
        const x = Math.floor(Math.random() * this.width);
        const y = Math.floor(Math.random() * this.width);
        store.dispatch("hitGridPoint", { x, y });
      }, 500);
    }
  }
}
</script>

<style scoped lang="less">
#grid {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  transform: rotateX(0deg);
}
</style>