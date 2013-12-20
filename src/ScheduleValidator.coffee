class ScheduleValidator
  constructor: () ->
    @.DaysOfTheWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  validateSchedule: (scheduleDefinition) ->
    # A schedule has a BusinessWeek
    if !scheduleDefinition.BusinessWeek?
      throw "Schedule validation error: Definition requires a BusinessWeek."
    
    # Business week 'day of the week' definitions are either 
    # empty strings or in the format "0800-1530"
    reHours = new RegExp("^\\d{4}-\\d{4}$")
    reShortDate = new RegExp("^\\d{8}$")
    reDays = new RegExp("^" + @.DaysOfTheWeek.join("$|^") + "$")
    for day of scheduleDefinition.BusinessWeek
      if reDays.test(day) is false
        throw "Schedule validation error: \"" + day + "\" is not a valid day of the week."
      dayOfWeek = scheduleDefinition.BusinessWeek[day] 
      if dayOfWeek? and dayOfWeek.length > 0
        if reHours.test(dayOfWeek) is false
          throw "Schedule validation error: \"" + dayOfWeek + "\" is not a valid definition of hours for \"" + day + "\"."
    if scheduleDefinition.Holidays?
      if scheduleDefinition.Holidays instanceof Array is false
        throw "Schedule validation error: Holidays must be an array."
      else
        # continue validating
        for holidayDefinition in scheduleDefinition.Holidays
          if holidayDefinition instanceof Array is false
            throw "Schedule validation error: Holiday definitions must be arrays."
          
          # this is getting way out of control...I just can't stop myself!!!
          if holidayDefinition.length is 0
            throw "Schedule validation error: Holiday definitions must have a date value."
          holidayDate = holidayDefinition[0].toString()
          if reShortDate.test(holidayDate) is false
            throw "Schedule validation error: Holiday definition dates must be in the form yyyymmdd."
            
          
    if scheduleDefinition.Modifiers?
      if scheduleDefinition.Modifiers instanceof Array is false
        throw "Schedule validation error: Modifiers must be an array."  
      else
        # continue validating
        for modifierDefinition in scheduleDefinition.Modifiers
          if modifierDefinition instanceof Array is false
            throw "Schedule validation error: Modifier definitions must be arrays."  
          if modifierDefinition.length is 0
            throw "Schedule validation error: Modifier definitions must have a date value."            
          modifierDate = modifierDefinition[0].toString()
          if reShortDate.test(modifierDate) is false
            throw "Schedule validation error: Modifier definition dates must be in the form yyyymmdd."            
            
            
