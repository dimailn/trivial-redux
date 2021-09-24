import { createStore, Store } from 'redux'
import {useStore} from 'react-redux'

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}

const store = createStore(todos, ['Use Redux'])




interface RestAC {
    type: string
}


interface Rest extends Record<string, (...args: any) => any> {
    index: (a: string, b: number) => RestAC
    // create: () => Promise<T>
    // show: () => Promise<T>
    // update: () => Promise<T>
    // destroy: () => Promise<T>
    // reset: () => void
}

type RestWrapped<T> = {
    [Action in keyof Rest]: (...args: Parameters<Rest[Action]>) => Promise<T>
}

interface RestAPI<T> {
    index: () => Promise<Array<T>>
}

interface RestDescriptor<T> {
    actions: RestAPI<T>
    requests: RestAPI<T>
}

interface EndpointSettings {

}

interface Product {
    title: string
}

interface RestState<T> {
    list: Array<T>
    current: T
    fetching: boolean
}

interface RestEndpoint<T> {
    actions: Rest
    requests: Rest
    reducer: (state: RestState<T>, action: any) => RestState<T>
}

interface RestEndpointWrapper<T> {
    evaluate: () => RestEndpoint<T>
    stateless: () => Omit<RestEndpoint<T>, "actions" | "reducer">
}


function rest<T>(settings: string | EndpointSettings) : RestEndpoint<T> {
    const actions = {
        index() {
            return {
                type: 'TYPE'
            }
        }
    }
    const requests = {
        index() {
            return {
                type: 'TYPE'
            }
        }
    }
    const reducer = function(state, action){
        return state
    }



    return {
        actions,
        requests,
        reducer
    }

    

}

/*

const api = useApi()

const acApi = useACApi()


*/


// const productApi = rest<Product>('~products').evaluate()

// productApi.evaluate().actions.index




// const api = useApi<Product>()

// api.actions.index().then((products) => products[0].title)

  

const trivialReduxDescriptor  = {
    products: rest<Product>('~products'),
    carts: rest<Product>('~carts')
} as const




type SchemaType = typeof trivialReduxDescriptor
type EntitityName = keyof typeof trivialReduxDescriptor

type TrivialReduxApi = {
    actions: {
        [Property in keyof SchemaType]: SchemaType[Property]['actions']
    },
    requests: {
        [Property in keyof SchemaType]: SchemaType[Property]['requests']
    },
    reducers: {
        [Property in keyof SchemaType]: SchemaType[Property]['reducer']
    }
}

type Api = {
    [Property in keyof Omit<TrivialReduxApi, "reducers">]: TrivialReduxApi[Property]
}

  
const trivialReduxApi = Object.keys(trivialReduxDescriptor).reduce((api, endpointName) => {
    api.reducers[endpointName] = trivialReduxDescriptor[endpointName].reducer
    api.actions[endpointName] = trivialReduxDescriptor[endpointName].actions
    api.requests[endpointName] = trivialReduxDescriptor[endpointName].request

    return api
}, {} as TrivialReduxApi)




type ExtractEntity<P> = P extends RestEndpoint<infer T> ? T : never;

type Endpoints = Rest

type ExtractParameters<T extends Endpoints, Property extends keyof T> = T[Property]

type F = ExtractParameters<Rest, "index">

type Params = Parameters<F>
// const x: ExtractEntity<SchemaType['products']>

// type F = (a: string) => void

// const f : F = (a: string) => {}

// SchemaType[T]['actions'][Property]
// type A = Parameters<SchemaType['products']['actions']['index']>

// type Z = (...args: A) => void

// const z : Z = ()
type EntityApi<T extends EntitityName> = {
    actions: {
        [Property in keyof SchemaType[T]['actions']]: (...args: Parameters<SchemaType[T]['actions'][Property]>) => Promise<ExtractEntity<SchemaType[T]>>
    },
    requests: {
        [Property in keyof SchemaType[T]['actions']]: (...args: Parameters<SchemaType[T]['requests'][Property]>) => Promise<ExtractEntity<SchemaType[T]>>
    }
}

// type WrappedApi = {
//     [Property in keyof SchemaType]: EntityApi<Property>
// }



type WrappedActions = {
    -readonly[EndpointName in keyof Api['actions']]: {
        [ActionName in keyof Api['actions'][EndpointName]]: (...args: Parameters<Api['actions'][EndpointName][ActionName]>) => Promise<ReturnType<Api['actions'][EndpointName][ActionName]>>
    }
}

type WrappedRequests = {
    -readonly[EndpointName in keyof Api['requests']]: {
        [ActionName in keyof Api['requests'][EndpointName]]: (...args: Parameters<Api['requests'][EndpointName][ActionName]>) => Promise<ReturnType<Api['requests'][EndpointName][ActionName]>>
    }
}


type WrappedApi = {
    [ComponentName in keyof Api]: {
        [EndpointName in keyof Api[ComponentName]]: {
            [ActionName in keyof Api[ComponentName][EndpointName]]: (...args: Parameters<Api[ComponentName][EndpointName][ActionName]>) => Promise<ReturnType<Api[ComponentName][EndpointName][ActionName]>>
        }
    }
}

let x : EntityApi<"products">



// x.actions.index("", 2)

// function useTrivialRedux<T>(): RestEndpoint<T> {
//     return {} as unknown as RestEndpoint<T>
// }


type ComponentName = 'actions' | 'requests' | 'reducers'
type ComponentNameWithoutReducers = 'actions' | 'requests' 

declare global {
    interface ObjectConstructor {
        typedKeys<T>(obj: T): Array<keyof T>
    }
}
const typedKeys : <T>(obj: T) => Array<keyof T> = Object.keys as any


function useApi() : WrappedApi {
    const store = useStore()

    const api: Api // from context



    // const wrap = function<T>(restEndpoint: RestEndpoint<T>, name: ComponentNameWithoutReducers) : RestWrapped<T> {
    //     return {
    //         index: (...args) => store.dispatch(restEndpoint[name].index(...args)) as any as Promise<T>
    //     }
    // }


    const wrap = function<T>(componentName: ComponentNameWithoutReducers, entityName: EntitityName) : RestWrapped<T> {
        return {
            index: (...args) => store.dispatch(api[componentName][entityName].index(...args)) as any as Promise<T>
        }
    }


    const actions = typedKeys(api.actions).reduce((actions, entityName) => {
        actions[entityName] = wrap('actions', entityName)
        
        return actions
    }, {} as WrappedActions)


    const requests = typedKeys(api.requests).reduce((requests, entityName) => {
        requests[entityName] = wrap('requests', entityName)

        return requests
    }, {} as WrappedRequests)
    


    return {
        actions,
        requests
        // actions: {products: wrap(trivialReduxDescriptor[name], "actions")},
        // requests: wrap(trivialReduxDescriptor[name], "requests")
    }

    // const actions = wrap(trivialReduxDescriptor.products, "actions")
    // const requests = wrap(trivialReduxDescriptor.products, 'requests')
    


    // const wrapComponent = (componentName: ) => {
        
        

    //     const x = trivialReduxApi[componentName]

        
    //     Object.keys(trivialReduxApi[componentName]).reduce((elements, resourceName) => {
            
    //         Object.keys(elements).forEach((actionName) => {
    //             elements[resourceName][actionName] = wrap<Array<T>>(elements[resourceName], actionName)
    //         })
    //     }, {})
    // }

    // return {
    //     actions: wrapComponent("actions"),
    //     requests: wrapComponent("requests")
    // }
}




// const trivialRedux = function(endpoints: Record<string, RestEndpointWrapper<*>>){

// }





// const a = {
//     a: {
//         b: (a: string) => Promise.resolve()
//     } 
// }
// type A = typeof a

type Methods = Record<string, (...args: any) => any>

const a: Methods = {
    b: (a: string) => Promise.resolve(),
    a: (a: string) => 1
}

type A = {
    a: Methods
}

type B = {
    [FirstLevelProperty in keyof A]: {
        [SecondLevelProperty in keyof A[FirstLevelProperty]]: (...args: Parameters<A[FirstLevelProperty][SecondLevelProperty]>) => Promise<void>
    }
}

// type B = {
//     [FirstLevelProperty in keyof A]: {
//         [SecondLevelProperty in keyof A[FirstLevelProperty]]: A[FirstLevelProperty][SecondLevelProperty]
//     }
// }





// type KeysOfA = keyof A

// type B<T extends KeysOfA> = {
//     [Property in Extract<keyof A[T], string>]: (...args: Parameters<A[T][Property]>) => void
// }



// const b : B<"a"> = {
//     b: (a: string) => {}
// }

// type C<T extends KeysOfA> = {
//     [Property in keyof A[T]]: A[T][Property]
// }

// type D<T extends KeysOfA> = {

// }

// const c: C<"a"> = {
//     b: (a: string) => Promise.resolve()
// }

// // type C<T extends KeysOfA> = {
// //     [Property in keyof A[T]]: A[T][Property]
// // }


// // type D<T extends C<"a">> = {
// //     [Property in keyof T]: Parameters<T[Property]>
// // }

// // const c : C<"a"> = {
// //     b: (a: string) => Promise.resolve()
// // }