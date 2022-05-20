import { ExternalTrivialReduxType, TrivialReduxEndpointOptions, IActions } from "./types"

type Type<S, Actions extends IActions, AsyncActions extends IActions, AsyncActionsTypes> = (options: TrivialReduxEndpointOptions<S, Actions, AsyncActions>) => ExternalTrivialReduxType<S, Actions, AsyncActions, AsyncActionsTypes>

export default <T extends Function>(type: T, defaultState) : T => {

  const wrappedType : T = ((options = {}) => {
    // @ts-ignore
    options.initialState ||= defaultState

    return type(options)
  }) as any

  return wrappedType
}
