import { WrappedApi } from "./types"

export default <T>() : WrappedApi<T> => {
  return {
    actions: {},
    requests: {}
  }
}