
scheduleDefinition = {
  BusinessWeek: {
    Sunday: ""
    Monday: "0801-1730"
    Tuesday: "0802-1730" 
    Wednesday: "0803-1730" 
    Thursday: "0804-1730" 
    Friday: "0805-1730" 
    Saturday: "0806-1730" 
  }
  Holidays: [
    [20131225, "Christmas"]
    [20140101, "New Years"]
    [20140120] # don't need to have a title
    [20140217, "Washington's Birthday"] 
    [20140131, "Employee Appreciation Day"]
  ]
  Modifiers: [
    [20131224, "0800-1200", "Half-Day"]
    [20140105, "0800-1200", "Inventory"]
  ]   
}

# I think holidays and modifiers eventually become more sophisticated, e.g. 
# recurring events by adding a definition and stop date

# purpose is to take the schedule and break
# it down into something more javascript like
# e.g. "Monday" becomes 1
class ScheduleProcessor
  constructor: ->
    @.DaysOfTheWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  
  getScheduleFromDefinition: (scheduleDefinition) ->
    ## should have something here to make sure the schedule definition 
    # is correct
    schedule = new Schedule()
    for day, i in @.DaysOfTheWeek
      # OK if scheduleDefinition.businessWeek[day] is undefined
      weekDay = new WeekDay(i)
      weekDay.businessDay = new BusinessDay(i, scheduleDefinition.BusinessWeek[day])
      schedule.weekDays[i] = weekDay
    
    for holidayDefinition in scheduleDefinition.Holidays
      holiday = new Holiday(holidayDefinition)
      # Add it to the appropriate business day 
      weekDay = schedule.weekDays[holiday.date.getDay()]
      weekDay.holidays.push(holiday)
    
    for modifierDefinition in scheduleDefinition.Modifiers
      modifier = new BusinessDayModifier(modifierDefinition)
      # Add it to the appropriate business day 
      weekDay = schedule.weekDays[modifier.date.getDay()]
      weekDay.modifiedBusinessDays.push(modifier)
      
    return schedule
      
class Utilities
  constructor: () ->
  
  getTimelessDateFromShortDate: (shortDate) ->
    shortDateString = shortDate.toString()
    # shortDate is a string with length of 8
    y = parseInt(shortDateString.substr(0,4))
    m = parseInt(shortDateString.substr(4,2)) - 1
    d = parseInt(shortDateString.substr(6,2))
    return new Date(y, m, d)

class Schedule
  constructor: (schedule) ->
    @.weekDays = []
   
class WeekDay
  constructor: (dayOfTheWeek) ->
    @.dayOfTheWeek = dayOfTheWeek
    @.businessDay
    @.holidays = []
    @.modifiedBusinessDays = []

class BusinessDayModifier
  constructor: (modifierDefinition) ->
    utils = new Utilities()
    @.dateString = modifierDefinition[0]
    @.date = utils.getTimelessDateFromShortDate(@.dateString)
    @.hours = modifierDefinition[1]
    @.title = modifierDefinition[2]

class Holiday
  constructor: (holidayDefinition) ->
    utils = new Utilities()
    @.dateString = holidayDefinition[0]
    @.date = utils.getTimelessDateFromShortDate(@.dateString)
    @.title = holidayDefinition[1]
    
class BusinessDay
  constructor: (dayOfTheWeek, hourDefinitions) ->
    utils = new Utilities()
    @.hours = hourDefinitions
    #hours are like military time 0001 0800
    ###
    for range in hourDefinitions
      start = @.dateForHours(range[0])
      end = @.dateForHours(range[1])
      @.hours.push(start,end)
    ###
    @.totalBusinessHours
    
  getHoursInRange: (rangeObject) -> 
    # how many times does monday occur in the range?
    # if we convert start and stop times to milliseconds.
    ###
      hours = totalBusinessHours * range.numberOfDaysByDay(@.dayOfTheWeek)
      hours += numberOfHoursInDate(rangeObject.beginDate)
      if rangeObject.endDate?
        hours += numberOfHoursInDate(rangeObject.endDate)
    ###
    
    return "Hello"
    
  dateForHours: (hours) ->
    h = parseInt(hours.substr(0,2))
    m = parseInt(hours.substr(2,2))
    date = new Date(0)
    date.setHours(h)
    date.setMinutes(m)
    return date
    
class DateRange
  constructor: (beginDate, endDate) ->
    if !beginDate?
      throw "beginDate is required"
    if !endDate?
      throw "endDate is required"
    @.beginDate = new Date(beginDate.getTime())
    @.endDate = new Date(endDate.getTime())
    @.timelessBeginDate = @.getTimelessDate(beginDate)
    @.timelessEndDate = @.getTimelessDate(endDate)
    @.totalDays = ((@.timelessEndDate-@.timelessBeginDate)/86400000) + 1
    @.totalFullDays = 0
    if @.totalDays > 2 then @.totalFullDays = @.totalDays - 2
  
    @.fullDayDistribution = @.getFullDayDistribution(@.totalFullDays, @.beginDate)


  ###
    remember you just finished the above...does it work? Is it wonderful?
  
  ###
  
  
  getTimelessDate: (fromDate) ->
    timelessDate = new Date(fromDate.getTime())
    timelessDate.setHours(0)
    timelessDate.setMinutes(0)
    timelessDate.setSeconds(0)
    timelessDate.setMilliseconds(0)
    return timelessDate
  
  ###
  
    a range will always have a beginning date.
    if the range is more than one day, it will have an end date
    beginning and ending dates, which may be fractions of a day
    number of days by day of week
      number of full mondays, tuesdays, etc.
    
    so an evaluator can 
    
  
  ###  
  
  incrementDayOfWeek: (day) ->
    day++
    if day > 6 then day = 0
    return day
  
  getFullDayDistribution: (totalFullDays, beginDate) ->
    fullDayDistribution = [0,0,0,0,0,0,0]
    
    if totalFullDays > 0
      quotient = Math.floor(totalFullDays / 7)
      remainder = totalFullDays % 7
      
      # initialize the fullDayDistribution
      for dayCount,i in fullDayDistribution
        fullDayDistribution[i] = quotient
        
      dayOfWeekPointer = beginDate.getDay()
    
      while (remainder > 0)
        dayOfWeekPointer = @.incrementDayOfWeek(dayOfWeekPointer)
        fullDayDistribution[dayOfWeekPointer] = fullDayDistribution[dayOfWeekPointer] + 1
        remainder--
        
    return fullDayDistribution