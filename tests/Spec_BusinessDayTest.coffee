###
  Under source control. Please contact the OIG Applications Development team before modifying.
###

describe("Schedule Processor Class", -> 
  
  beforeEach(->
      
  )
  it("Throws an exception if there is no BusinessWeek definition", ->
    
    validateSchedule = ->
      scheduleValidator = new ScheduleValidator()
      scheduleValidator.validateSchedule(
        {
          _BusinessWeek: {
            Sunday: ""
            Monday: "0801-1730"
            Tuesday: "0802-1730" 
            Wednesday: "0803-1730" 
            Thursday: "0804-1730" 
            Friday: "0805-1730" 
            Saturday: "0806-1730" 
          }   
        }
      )
      
    expect(validateSchedule).toThrow("Schedule validation error: Definition requires a BusinessWeek.")  
  )
  
  it("Throws an exception if there is an incorrect day in the BusinessWeek definition", ->
    
    validateSchedule = ->
      scheduleValidator = new ScheduleValidator()
      scheduleValidator.validateSchedule(
        {
          BusinessWeek: {
            sturdaySunday: ""
            Monday: "0801-1730"
            Tuesday: "0802-1730" 
            Wednesday: "0803-1730" 
            Thursday: "0804-1730" 
            Friday: "0805-1730" 
            Saturday: "0806-1730" 
          }  
        }
      )
      
    expect(validateSchedule).toThrow("Schedule validation error: \"sturdaySunday\" is not a valid day of the week.")  
  )
  it("Throws an exception if hours are not formatted correctly", ->
    
    validateSchedule = ->
      scheduleValidator = new ScheduleValidator()
      scheduleValidator.validateSchedule(
        {
          BusinessWeek: {
            Sunday: "8:00 AM to 5:30 PM"
            Monday: "0801-1730"
            Tuesday: "0802-1730" 
            Wednesday: "0803-1730" 
            Thursday: "0804-1730" 
            Friday: "0805-1730" 
            Saturday: "0806-1730" 
          }  
        }
      )
      
    expect(validateSchedule).toThrow("Schedule validation error: \"8:00 AM to 5:30 PM\" is not a valid definition of hours for \"Sunday\".")  
  )
  it("Throws an exception if \"Holidays\" is not an array", ->
    
    validateSchedule = ->
      scheduleValidator = new ScheduleValidator()
      scheduleValidator.validateSchedule(
        {
          BusinessWeek: {
            Sunday: "0800-1730"
            Monday: "0801-1730"
            Tuesday: "0802-1730" 
            Wednesday: "0803-1730" 
            Thursday: "0804-1730" 
            Friday: "0805-1730" 
            Saturday: "0806-1730" 
          }
          Holidays: "hello"
  
        }
      )
      
    expect(validateSchedule).toThrow("Schedule validation error: Holidays must be an array.")  
  )  
  it("Throws an exception if \"Modifiers\" is not an array", ->
    
    validateSchedule = ->
      scheduleValidator = new ScheduleValidator()
      scheduleValidator.validateSchedule(
        {
          BusinessWeek: {
            Sunday: "0800-1730"
            Monday: "0801-1730"
            Tuesday: "0802-1730" 
            Wednesday: "0803-1730" 
            Thursday: "0804-1730" 
            Friday: "0805-1730" 
            Saturday: "0806-1730" 
          }
          Modifiers: "hello"
  
        }
      )
      
    expect(validateSchedule).toThrow("Schedule validation error: Modifiers must be an array.")  
  )  
  it("Throws an exception if \"Modifiers\" definitions are not arrays", ->
    
    validateSchedule = ->
      scheduleValidator = new ScheduleValidator()
      scheduleValidator.validateSchedule(
        {
          BusinessWeek: {
            Sunday: "0800-1730"
            Monday: "0801-1730"
            Tuesday: "0802-1730" 
            Wednesday: "0803-1730" 
            Thursday: "0804-1730" 
            Friday: "0805-1730" 
            Saturday: "0806-1730" 
          }
          Modifiers: [20131219]
  
        }
      )
      
    expect(validateSchedule).toThrow("Schedule validation error: Modifier definitions must be arrays.")  
  )  
  it("Throws an exception if \"Holiday\" definitions are not arrays", ->
    
    validateSchedule = ->
      scheduleValidator = new ScheduleValidator()
      scheduleValidator.validateSchedule(
        {
          BusinessWeek: {
            Sunday: "0800-1730"
            Monday: "0801-1730"
            Tuesday: "0802-1730" 
            Wednesday: "0803-1730" 
            Thursday: "0804-1730" 
            Friday: "0805-1730" 
            Saturday: "0806-1730" 
          }
          Holidays: [20131219]
  
        }
      )
      
    expect(validateSchedule).toThrow("Schedule validation error: Holiday definitions must be arrays.")  
  )  
  it("Throws an exception if \"Holiday\" definitions don't have a date value", ->
    
    validateSchedule = ->
      scheduleValidator = new ScheduleValidator()
      scheduleValidator.validateSchedule(
        {
          BusinessWeek: {
            Sunday: "0800-1730"
            Monday: "0801-1730"
            Tuesday: "0802-1730" 
            Wednesday: "0803-1730" 
            Thursday: "0804-1730" 
            Friday: "0805-1730" 
            Saturday: "0806-1730" 
          }
          Holidays: [[]]
  
        }
      )
      
    expect(validateSchedule).toThrow("Schedule validation error: Holiday definitions must have a date value.")  
  )  
  it("Throws an exception if \"Modifier\" definitions don't have a date value", ->
    
    validateSchedule = ->
      scheduleValidator = new ScheduleValidator()
      scheduleValidator.validateSchedule(
        {
          BusinessWeek: {
            Sunday: "0800-1730"
            Monday: "0801-1730"
            Tuesday: "0802-1730" 
            Wednesday: "0803-1730" 
            Thursday: "0804-1730" 
            Friday: "0805-1730" 
            Saturday: "0806-1730" 
          }
          Modifiers: [[]]
  
        }
      )
      
    expect(validateSchedule).toThrow("Schedule validation error: Modifier definitions must have a date value.")  
  )  
  it("Throws an exception if \"Modifier\" definitions don't have a properly formatted date value", ->
    
    validateSchedule = ->
      scheduleValidator = new ScheduleValidator()
      scheduleValidator.validateSchedule(
        {
          BusinessWeek: {
            Sunday: "0800-1730"
            Monday: "0801-1730"
            Tuesday: "0802-1730" 
            Wednesday: "0803-1730" 
            Thursday: "0804-1730" 
            Friday: "0805-1730" 
            Saturday: "0806-1730" 
          }
          Modifiers: [[2013040404]]
  
        }
      )
      
    expect(validateSchedule).toThrow("Schedule validation error: Modifier definition dates must be in the form yyyymmdd.")  
  ) 
  it("Throws an exception if \"Holiday\" definitions don't have a properly formatted date value", ->
    
    validateSchedule = ->
      scheduleValidator = new ScheduleValidator()
      scheduleValidator.validateSchedule(
        {
          BusinessWeek: {
            Sunday: "0800-1730"
            Monday: "0801-1730"
            Tuesday: "0802-1730" 
            Wednesday: "0803-1730" 
            Thursday: "0804-1730" 
            Friday: "0805-1730" 
            Saturday: "0806-1730" 
          }
          Holidays: [["December 25, 2014"]]
  
        }
      )
      
    expect(validateSchedule).toThrow("Schedule validation error: Holiday definition dates must be in the form yyyymmdd.")  
  )
  return
)

describe("BusinessDay", -> 
  businessDay = new BusinessDay(1, [["0800","1630"]])

  
  beforeEach(->
      
  )
  it("Business Day Says Hello", ->
    result = businessDay.getHoursInRange()
    expect(result).toEqual("Hello")
  )
  return
)


describe("DateRange Basic Properties", -> 
  
  rangeBeginDate = new Date(2013,12,17, 8)
  rangeEndDate = new Date(2013,12,17, 17)
  range = new DateRange(rangeBeginDate, rangeEndDate)
  
  beforeEach(->
      
  )

  it("Has a begin date", ->
    expect(range.beginDate).toBeDefined()
  )
  it("Has an end date", ->
    expect(range.endDate).toBeDefined()
  )  
  it("Has a timeless begin date", ->
    expect(range.timelessBeginDate).toBeDefined()
  )
  it("Has a timeless end date", ->
    expect(range.timelessEndDate).toBeDefined()
  )
  
  it("Has correct begin date time", ->
      expect(range.beginDate.toTimeString().indexOf("08:00")).toEqual(0)
  )
  it("Has correct end date time", ->
      expect(range.endDate.toTimeString().indexOf("17:00")).toEqual(0)
  )
  it("Has correct timeless begin date time", ->
      expect(range.timelessBeginDate.toTimeString().indexOf("00:00:00")).toEqual(0)
  )
  it("Has correct timeless end date time", ->
      expect(range.timelessEndDate.toTimeString().indexOf("00:00:00")).toEqual(0)
  )

  it("Begin date is same as constructor value", ->
    expect(range.beginDate.getTime()).toEqual(rangeBeginDate.getTime())
  )
  it("End date is same as constructor value", ->
    expect(range.endDate.getTime()).toEqual(rangeEndDate.getTime())
  )

  it("Throws an error if beginDate is not a date", ->
    expect(->
      testRange = new DateRange()
    ).toThrow()
  )
  it("Throws an error if endDate is not a date", ->
    expect(->
      testRange = new DateRange(new Date())
    ).toThrow()
  )
  
  return
)

describe("DateRange Calculations", -> 
  
  rangeBeginDate = new Date(2013,10,9, 8)
  rangeEndDate = new Date(2013,11,18, 17)
  range = new DateRange(rangeBeginDate, rangeEndDate)
  
  beforeEach(->
      
  )

  it("Total days is 40", ->
    expect(range.totalDays).toEqual(40)
  )
  
  it("Total full days is 38", ->
    expect(range.totalFullDays).toEqual(38)
  )
  it("6 Sundays", ->
    expect(range.fullDayDistribution[0]).toEqual(6)
  )
  it("6 Mondays", ->
    expect(range.fullDayDistribution[1]).toEqual(6)
  )
  it("6 Tuesdays", ->
    expect(range.fullDayDistribution[2]).toEqual(6)
  )
  it("5 Wednesdays", ->
    expect(range.fullDayDistribution[3]).toEqual(5)
  )
  it("5 Thursdays", ->
    expect(range.fullDayDistribution[4]).toEqual(5)
  )
  it("5 Fridays", ->
    expect(range.fullDayDistribution[5]).toEqual(5)
  )
  it("5 Saturdays", ->
    expect(range.fullDayDistribution[6]).toEqual(5)
  )
  
  it("Total days from 11:59:59 to midnight is 2", ->
    testRange = new DateRange(new Date(2013,11,17,23,59,59,999), new Date(2013,11,18,0,0,0,0))
    expect(testRange.totalDays).toEqual(2)
  )  
  it("Total days from the 15th to the 21st is 7 days", ->
    testRange = new DateRange(new Date(2013,11,15,23,59,59,999), new Date(2013,11,21,0,0,0,0))
    expect(testRange.totalDays).toEqual(7)
  )  
  
  
  it("Total full days from 11:59:59 to midnight is 0", ->
    testRange = new DateRange(new Date(2013,11,17,23,59,59,999), new Date(2013,11,18,0,0,0,0))
    expect(testRange.totalFullDays).toEqual(0)
  )  
  it("Total full days from the 15th to the 21st is 5 days", ->
    testRange = new DateRange(new Date(2013,11,15,23,59,59,999), new Date(2013,11,21,0,0,0,0))
    expect(testRange.totalFullDays).toEqual(5)
  )  
  
  return
)

describe("Standard Date Behavior", -> 
  
  
  beforeEach(->
      
  )

  it("Creating date with expected Date", ->
    # Tuesday, December 17th 2013, 4:11 PM pacific
    today = new Date(2013, 11, 17, 16, 11)
    expect(today.toDateString()).toEqual("Tue Dec 17 2013")
  )
  
  it("Creating date with expected time", ->
    # Tuesday, December 17th 2013, 4:11 PM pacific
    today = new Date(2013, 11, 17, 16, 11)
    time = today.toTimeString()
    expect(time.indexOf("16:11")).toEqual(0)
  )

  it("Creating date and setting time to 0 keeps the same date", ->
    # Tuesday, December 17th 2013, 4:11 PM pacific
    today = new Date(2013, 11, 17, 16, 11)
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    time = today.toTimeString()
    expect(time.indexOf("00:00:00")).toEqual(0)
  )
  return
)