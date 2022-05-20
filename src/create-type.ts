import { TrivialReduxType, TrivialReduxEndpointOptions } from "./types"

type Type<S, Actions, AsyncActions, AsyncActionsTypes> = (options: TrivialReduxEndpointOptions<S, Actions, AsyncActions>) => TrivialReduxType<S, Actions, AsyncActions, AsyncActionsTypes>

export default <T extends Function>(type: T, defaultState) : T => {

  const wrappedType : T = ((options = {}) => {
    options.initialState ||= defaultState

    return type(options)
  }) as any

  return wrappedType
}
