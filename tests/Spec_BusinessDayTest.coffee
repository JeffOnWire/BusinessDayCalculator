###
  Under source control. Please contact the OIG Applications Development team before modifying.
###

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