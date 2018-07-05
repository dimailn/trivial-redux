actionTypesFor = (action_name, entity_name) ->
  load: "#{action_name}/#{entity_name}/PENDING"
  success: "#{action_name}/#{entity_name}/SUCCESS"
  failure: "#{action_name}/#{entity_name}/FAILURE"

# whitelist = [
#   'asymmetricMatch'
#   'nodeType'
# ]

# if Proxy? && process.env.NODE_ENV is 'development'
#   actionTypesForWithProxy = (action_name, entity_name) ->
#     new Proxy(
#       actionTypesFor(action_name, entity_name)
#       get: (target, property, receiver) ->
#         if typeof property is 'string' and not (property in Object.keys(target) || property in whitelist)
#           console.error("The action type \"#{property}\" is not exist, may be you mispelled it?")
#         target[property]
#     )

module.exports = actionTypesFor
