module.exports = (action_name, entity_name) ->
  type: "#{action_name}/#{entity_name}"