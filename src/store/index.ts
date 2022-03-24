import { isFibonacciNumber, previousFibonacci } from '@/fibonacciHelpers';
import { createStore } from 'vuex'

export interface GridValue {
  value: number;
  marked: boolean;
}

export interface State {
	grid: GridValue[][];
	width: number;
	height: number;
}

export interface Point {
	x: number;
	y: number;
}

export interface Direction {
	xDirection: 0 | 1 | -1;
	yDirection: 0 | 1 | -1;
}

type FibonacciCheckSettings = Point & Direction & { length: number };

const wantedSequenceLength = 5;
const markedTimeInMs = 300;

export default createStore<State>({
	state: {
		grid: [],
		width: 0,
		height: 0
	},
	getters: {
		getValue: (state: State) => (x: number, y: number): number => {
			return state.grid[y][x].value;
		},
		getValueString: (state: State) => (x: number, y: number): string => {
			return `${state.grid[y][x].value || ""}`;
		},
		isMarked: (state: State) => (x: number, y: number): boolean => {
			return state.grid[y][x].marked;
		},
		height: (state: State) => state.height,
		width: (state: State) => state.width,
	},
	mutations: {
		initGrid(state: State, { x, y }: Point) {
			state.grid = [...Array(y).keys()].map(() => [...Array(x).keys()].map(() => ({ value: 0, marked: false}) ));
			state.width = x;
			state.height = y;
		},
		increment(state: State, { x, y }: Point) {
			state.grid[y][x].value++;
		},
		mark(state: State, { x, y }: Point) {
			state.grid[y][x].marked = true;
		},
		clear(state: State, { x, y }: Point) {
			state.grid[y][x].marked = false;
			state.grid[y][x].value = 0;
		}
	},
	actions: {
		markAndClearGridPoint({ commit }, point: Point) {
			commit("mark", point);
			setTimeout(() => {
				commit("clear", point);
			}, markedTimeInMs);
		},
		hitGridPoint({ commit, state, dispatch }, { x, y }: Point) {
			// Increment column
			for (let i = 0; i < state.height; i++) {
				commit("increment", { x: x, y: i });
			}

			// Increment row
			for (let i = 0; i < state.width; i++) {
				if (i === x) continue; // already incremented in row-loop
				commit("increment", { x: i, y: y });
			}

			// it's not necessary to check the row/column that have been hit, as it will never result in a fibonacci sequence if all values are +1'd
			// but all other nearby numbers may now contain a sequence.
			for (let i = 0; i < state.height; i++) {
				if (i === y) continue;
				dispatch("checkFibonacciInDirection", { x: x, y: i, xDirection: -1 });
				dispatch("checkFibonacciInDirection", { x: x, y: i, xDirection: 1 });
			}

			for (let i = 0; i < state.width; i++) {
				if (i === x) continue;
				dispatch("checkFibonacciInDirection", { x: i, y: y, yDirection: -1 });
				dispatch("checkFibonacciInDirection", { x: i, y: y, yDirection: 1 });
			}
		},
		checkFibonacciInDirection({ dispatch, state }, { x, y, xDirection = 0, yDirection = 0, length = wantedSequenceLength * 2 }: FibonacciCheckSettings) {
			let currentOffset = -length;

			const previousValues: [number | undefined, number | undefined] = [undefined, undefined];
			let sequence: Point[] = [];

			const clear = () => {
				if (sequence.length >= wantedSequenceLength) {
					for (const point of sequence) {
						dispatch("markAndClearGridPoint", point);
					}
				}
				previousValues[0] = undefined;
				previousValues[1] = undefined;
				sequence = [];
			}

			do {
				const xIndex = x + currentOffset * xDirection;
				const yIndex = y + currentOffset * yDirection;
				if (xIndex < 0 || xIndex >= state.width) continue;
				if (yIndex < 0 || yIndex >= state.height) continue;

				const currentValue = state.grid[yIndex][xIndex].value;
				if (!isFibonacciNumber(currentValue)) {
					clear();
					continue;
				}

				if (previousValues[0] === undefined) {
					previousValues[0] = previousFibonacci(currentValue);
				} else {
					const wantedValue = previousValues[0] + previousValues[1]!;

					if (currentValue !== wantedValue || wantedValue === 0) {
						currentOffset -= sequence.length;
						clear();
						continue;
					}
					previousValues[0] = previousValues[1];
				}

				sequence.push({ x: xIndex, y: yIndex });

				previousValues[1] = currentValue;
			} while (++currentOffset <= length);
			clear();
		}
	},
	modules: {
	}
})
