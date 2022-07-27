import { ExternalTrivialReduxType, TrivialReduxEndpointOptions, IActions } from "./types"

type Type<S, Actions extends IActions, AsyncActions extends IActions, AsyncActionsTypes> = (options: TrivialReduxEndpointOptions<S, Actions, AsyncActions>) => ExternalTrivialReduxType<S, Actions, AsyncActions, AsyncActionsTypes>

export default <T extends Function>(type: T, defaultState) : T => {

  const wrappedType : T = ((options = {}) => {
    // @ts-ignore
    const {initialState} = options

    const initialStateIsObject = typeof initialState === 'object' && initialState !== null && !(initialState instanceof Array)

    const currentInitialState = initialState === undefined ? defaultState : initialStateIsObject ? {...defaultState, ...initialState} : initialState

    return {
      ...type(options),
      initialState: currentInitialState
    }
  }) as any

  return wrappedType
}
