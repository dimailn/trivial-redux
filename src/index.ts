import rest from './internal-types/rest'
import setter from './internal-types/setter'
import fetch from './internal-types/fetch'
import action from './internal-types/action'

import combineEndpoints from './combine-endpoints'
import useApi from './use-api'
import createType from './create-type'

interface Account {
  id: string
  title: string
}



// createApiForType('', rest<Account>()).actions.update()


const api = combineEndpoints(
  {
    accounts: rest<Account>(),
    currentAccount: setter<Account>()
  }
)

api.actions.accounts.reset().type


// const useMyApi = () => useApi<typeof api>()


// ;
// (async () => {
//   const {data} = await useMyApi().requests.accounts.show(1)

//   // data.id

// })





export {
  combineEndpoints,
  useApi,
  createType,
  rest,
  action,
  fetch,
  setter
}




