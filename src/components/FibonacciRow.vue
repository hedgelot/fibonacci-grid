<template>
    <div class="row">
        <FibonacciPoint @valueChanged="$emit('valueChanged', $event)" v-for="(n, i) in length" :key="i" :x="i" :y="y" />
    </div>
</template>

<script lang="ts">
import { Point } from '@/store';
import { Options, Vue } from 'vue-class-component';
import FibonacciPoint from './FibonacciPoint.vue';

@Options({
    components: {
        FibonacciPoint,
    },
    props: {
        y: Number,
        length: Number,
    },
    emits: ["valueChanged"]
})
export default class FibonacciRow extends Vue {
    change(point: Point) {
        this.$emit("valueChanged", point);
    }
}
</script>

<style scoped lang="less">
.row {
    display: flex;
    flex: 1
}
</style>