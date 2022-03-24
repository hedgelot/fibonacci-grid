<template>
    <div :class="{ point: true, yellow: color === 'yellow', green: color === 'green'}" @click="click()">
        {{ this.$store.getters.getValueString(this.x, this.y) }}
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import store from "@/store";

@Options({
    props: {
        x: Number,
        y: Number,
    },
    emits: ["valueChanged"]
})
export default class FibonacciPoint extends Vue {
    x!: number;
    y!: number;
    unwatchValueChange!: () => void;
    unwatchMarkedChange!: () => void;
    color: "yellow" | "green" | "default" = "default";
    colorTimeoutHandler?: number;

    created(): void {
        this.unwatchValueChange = store.watch(
            (state) => state.grid[this.y][this.x].value, 
            (newValue: number, oldValue: number) => this.onValueChange(newValue, oldValue));

        this.unwatchMarkedChange = store.watch(
            (state) => state.grid[this.y][this.x].marked, 
            (newValue: boolean) => this.onMarkedCange(newValue));
    }

    beforeDestroy(): void {
        this.unwatchValueChange();
    }

    protected click(): void {
        store.dispatch("hitGridPoint", { x: this.x, y: this.y });
    }

    protected onValueChange(newValue: number, oldValue: number) {
        if (newValue > oldValue) {
            this.changeColor("yellow");
        }
    }

    protected onMarkedCange(newValue: boolean) {
        if (newValue) {
            this.changeColor("green", 500);
        }
    }

    private changeColor(color: "yellow" | "green", timeout = 100) {
        if (this.colorTimeoutHandler) {
            clearTimeout(this.colorTimeoutHandler);
        }

        this.color = color;

        this.colorTimeoutHandler = setTimeout(() => {
            this.color = "default";
        }, timeout);
    }
}
</script>

<style scoped lang="less">
.point {
    flex: 1;
    border: 1px solid rgb(0, 0, 0);
    text-align: center;
    background-color: rgb(255, 255, 255);
    transition: all 0.1s ease-out;

    &.yellow {
        background-color: rgb(255, 251, 0);
    }

    &.green {
        background-color: rgb(0, 255, 0);
    }
}
</style>