import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface State {
    grid: GridValue[][];
    width: number;
    height: number;
  }

  interface GridValue {
    value: number;
    marked: boolean;
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}