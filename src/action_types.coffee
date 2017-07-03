module.exports = (action_name, entity_name) ->
  load: "#{action_name}/#{entity_name}/PENDING"
  success: "#{action_name}/#{entity_name}/SUCCESS"
  failure: "#{action_name}/#{entity_name}/FAILURE"