
exampleScheduleDefinition = {
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
  constructor: (scheduleDefinition) ->
    @.DaysOfTheWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    
  getScheduleFromDefinition: (scheduleDefinition) ->
    ## should have something here to make sure the schedule definition 
    # is correct
    schedule = new Schedule()
    for day, i in @.DaysOfTheWeek
      # OK if scheduleDefinition.businessWeek[day] is undefined
      weekDay = new WeekDay(i)
      weekDay.businessDay = new BusinessDay(scheduleDefinition.BusinessWeek[day])
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
      
@utils = {
  getTimelessDateFromShortDate: (shortDate) ->
    shortDateString = shortDate.toString()
    # shortDate is a string with length of 8
    y = parseInt(shortDateString.substr(0,4))
    m = parseInt(shortDateString.substr(4,2)) - 1
    d = parseInt(shortDateString.substr(6,2))
    return new Date(y, m, d)
  getShortDate: (date) ->
    y = date.getFullYear().toString()
    m = (date.getMonth() + 1).toString()
    d = date.getDate().toString()
    if m.length = 1 then m = "0" + m
    if d.length = 1 then m = "0" + d
    return y + m + d
  getDatelessTimeFromDate: (date) ->
    ## don't be surprised if this blows up!
    returnDate = new Date(0)
    returnDate.setHours(date.getHours())
    returnDate.setMinutes(date.getMinutes())
    returnDate.setSeconds(date.getSeconds())
    returnDate.setMilliseconds(date.getMilliseconds())
    return returnDate
  getDatelessTimeFromString: (time) ->
    returnDate = new Date(0)
    returnDate.setHours(time.substr(0,2))
    returnDate.setMinutes(time.substr(2,2))
    return returnDate
}  

class Schedule
  constructor: (schedule) ->
    @.weekDays = []
  
  getBusinessHoursDifference: (date1, date2) ->
    dateRange = new DateRange(date1, date2)
    milliseconds = 0
    for weekDay in @.weekDays
      milliseconds+= weekDay.getHours(dateRange)
    
  addBusinessHours: (date, hours) ->
    return date
    
    
class WeekDay
  constructor: (dayOfTheWeek) ->
    @.dayOfTheWeek = dayOfTheWeek
    @.businessDay
    @.holidays = []
    @.modifiedBusinessDays = []
  
  getMilliseconds: (dateRange) ->
    milliseconds = 0

    
    firstDaySupplements = {holidays:[],modifiers:[]}
    lastDaySupplements = {holidays:[],modifiers:[]}
    fullDaySupplements = {holidays:[],modifiers:[]}
    
    for holiday in @.holidays
      if holiday.shortDate is dateRange.beginShortDate
        firstDaySupplements.holidays.push(holiday)
      else if holiday.shortDate is dateRange.endShortDate
        lastDaySupplements.holidays.push(holiday)
      else if holiday.shortDate > dateRange.beginShortDate and holiday.shortDate < dateRange.endShortDate
        fullDaySupplements.holidays.push(holiday)
        
    for modifier in @.modifiers
      if modifier.shortDate is dateRange.beginShortDate
        firstDaySupplements.modifier.push(modifier)
      else if modifiers.shortDate is dateRange.endShortDate
        lastDaySupplements.modifiers.push(modifier)
      else if modifier.shortDate > dateRange.beginShortDate and modifier.shortDate < dateRange.endShortDate
        fullDaySupplements.modifiers.push(modifier)
    
      ###
      !!!!!!!!!!! remember that a modifier is just a business day used in place of the 
      base business day!

      ###    
    
    # evaluate first day
    if dateRange.beginDate.getDay() is @.dayOfTheWeek
      # if there's a modifier, use it, otherwise base business day
      if firstDaySupplements.modifier.length > 0
        currentBusinessDay = new BusinessDay(firstDaySupplements.modifier[0].hours)
        
      else
        currentBusinessDay = @.businessDay
        
      milliseconds+= currentBusinessDay.getMillisecondsInRange(dateRange.beginDate, dateRange.timelessFirstFullDate)
    
    if dateRange.totalDays > 0
      # go no further
      
      
      fullDays = dateRange.fullDayDistribution[@.dayOfTheWeek]
      # subtract out any holidays
      fullDays-= fullDaySupplements.holidays.length
      if fullDays > 0
        #return

        for modifier in fullDaySupplements.modifiers
          # decrement fullDays
          fullDays--
          currentBusinessDay = new BusinessDay(modifier.hours)
          milliseconds+= (currentBusinessDay.totalBusinessMilliseconds)

          if fullDays > 0
            milliseconds+= @.businessDay.totalBusinessMilliseconds * fullDays



      if dateRange.endDate.getDay() is @.dayOfTheWeek
        # passing the range from midnight to the actual end time.
        # if there's a modifier, use it, otherwise base business day
        if lastDaySupplements.modifier.length > 0
          currentBusinessDay = new BusinessDay(lastDaySupplements.modifier[0].hours)

        else
          currentBusinessDay = @.businessDay

        milliseconds+= currentBusinessDay.getMillisecondsInRange(dateRange.endDateTimeless, dateRange.endDate)

    
    return milliseconds

class BusinessDayModifier
  constructor: (modifierDefinition) ->
    
    @.shortDate = modifierDefinition[0]
    @.date = utils.getTimelessDateFromShortDate(@.dateString)
    @.hours = modifierDefinition[1]
    @.title = modifierDefinition[2]

class Holiday
  constructor: (holidayDefinition) ->
    
    @.shortDate = holidayDefinition[0]
    @.date = utils.getTimelessDateFromShortDate(@.dateString)
    @.title = holidayDefinition[1]
    
class BusinessDay
  constructor: (hoursDefinition) ->
    
    @.hours = hoursDefinition
    #hours are like military time 0001 0800
    ###
    for range in hourDefinitions
      start = @.dateForHours(range[0])
      end = @.dateForHours(range[1])
      @.hours.push(start,end)
    ###
    @.beginDatelessTime = utils.getDatelessTimeFromString(hoursDefinition.substr(0,4))
    @.endDatelessTime = utils.getDatelessTimeFromString(hoursDefinition.substr(5,4))
    @.totalBusinessMilliseconds = @.endDatelessTime - @.beginDatelessTime
    
  ###
    returns the number of business milliseconds that 
    occur in the date range
    so if the range was midnight to noon
    and the business hours were 0800-1730 the 
    return is the overlap, 8-noon
  ###
  getMillisecondsInRange: (beginDate, endDate) -> 
    beginRangeDatelessTime = utils.getDatelessTimeFromDate(beginDate)
    endRangeDatelessTime = utils.getDatelessTimeFromDate(endDate)
    
    if beginRangeDatelessTime >= @.endDatelessTime
      # no overlap
      return 0
    if endRangeDatelessTime < @.beginDatelessTime
      return 0
    
    # They overlap
    # throw out the high and low
    sorter = [
      beginRangeDatelessTime
      endRangeDatelessTime
      beginDatelessTime
      endDatelessTime
    ]
    sorter.sort
    return Math.abs(sorter[2] - sorter[3])

    
class DateRange
  constructor: (beginDate, endDate) ->
    if !beginDate?
      throw "beginDate is required"
    if !endDate?
      throw "endDate is required"
    @.beginDate = new Date(beginDate.getTime())
    @.endDate = new Date(endDate.getTime())
    @.timelessBeginDate = @.getTimelessDate(beginDate)
    @.timelessFirstFullDate
    @.timelessEndDate = @.getTimelessDate(endDate)
    @.beginDateShort = utils.getShortDate(@.beginDate)
    @.endShortDate = utils.getShortDate(@.endDate)
    @.totalDays = ((@.timelessEndDate-@.timelessBeginDate)/86400000) + 1
    @.totalFullDays = 0
    if @.totalDays > 2 then @.totalFullDays = @.totalDays - 2
    if @.totalFullDays > 0
      @.timelessFirstFullDate = new Date(timelessBeginDate.getMilliseconds())
      @.timelessFirstFullDate.setDate(@.timelessFirstFullDate.getDate() + 1)
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