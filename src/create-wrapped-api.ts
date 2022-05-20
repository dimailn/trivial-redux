import { WrappedApi } from "./types"

const dispatchify = (actions, dispatch) => {
  return Object.fromEntries(
    Object.entries(actions).map(([entityName, actions]) =>
      [
        entityName,
        Object.fromEntries(
          Object.entries(actions).map(([actionName, action]) =>
            [actionName, (...args) => dispatch(action)]
          )
        )
      ]
    )
  )
}

export default <T>(api: T, dispatch: (...args) => any) : WrappedApi<T> => {
  return {
    // @ts-ignore
    actions: dispatchify(api.actions, dispatch),

    // @ts-ignore
    requests: dispatchify(api.requests, dispatch)
  } as WrappedApi<T>
}