import { WrappedApi } from "./types"

export default <T>() : WrappedApi<T> => {
  return {
    // @ts-ignore
    actions: {},
    // @ts-ignore
    requests: {}
  }
}