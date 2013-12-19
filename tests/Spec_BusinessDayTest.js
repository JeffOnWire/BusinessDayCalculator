/*
  Under source control. Please contact the OIG Applications Development team before modifying.
*/

describe("BusinessDay", function() {
  var businessDay;
  businessDay = new BusinessDay(1, [["0800", "1630"]]);
  beforeEach(function() {});
  it("Business Day Says Hello", function() {
    var result;
    result = businessDay.getHoursInRange();
    return expect(result).toEqual("Hello");
  });
});

describe("DateRange Basic Properties", function() {
  var range, rangeBeginDate, rangeEndDate;
  rangeBeginDate = new Date(2013, 12, 17, 8);
  rangeEndDate = new Date(2013, 12, 17, 17);
  range = new DateRange(rangeBeginDate, rangeEndDate);
  beforeEach(function() {});
  it("Has a begin date", function() {
    return expect(range.beginDate).toBeDefined();
  });
  it("Has an end date", function() {
    return expect(range.endDate).toBeDefined();
  });
  it("Has a timeless begin date", function() {
    return expect(range.timelessBeginDate).toBeDefined();
  });
  it("Has a timeless end date", function() {
    return expect(range.timelessEndDate).toBeDefined();
  });
  it("Has correct begin date time", function() {
    return expect(range.beginDate.toTimeString().indexOf("08:00")).toEqual(0);
  });
  it("Has correct end date time", function() {
    return expect(range.endDate.toTimeString().indexOf("17:00")).toEqual(0);
  });
  it("Has correct timeless begin date time", function() {
    return expect(range.timelessBeginDate.toTimeString().indexOf("00:00:00")).toEqual(0);
  });
  it("Has correct timeless end date time", function() {
    return expect(range.timelessEndDate.toTimeString().indexOf("00:00:00")).toEqual(0);
  });
  it("Begin date is same as constructor value", function() {
    return expect(range.beginDate.getTime()).toEqual(rangeBeginDate.getTime());
  });
  it("End date is same as constructor value", function() {
    return expect(range.endDate.getTime()).toEqual(rangeEndDate.getTime());
  });
  it("Throws an error if beginDate is not a date", function() {
    return expect(function() {
      var testRange;
      return testRange = new DateRange();
    }).toThrow();
  });
  it("Throws an error if endDate is not a date", function() {
    return expect(function() {
      var testRange;
      return testRange = new DateRange(new Date());
    }).toThrow();
  });
});

describe("DateRange Calculations", function() {
  var range, rangeBeginDate, rangeEndDate;
  rangeBeginDate = new Date(2013, 10, 9, 8);
  rangeEndDate = new Date(2013, 11, 18, 17);
  range = new DateRange(rangeBeginDate, rangeEndDate);
  beforeEach(function() {});
  it("Total days is 40", function() {
    return expect(range.totalDays).toEqual(40);
  });
  it("Total full days is 38", function() {
    return expect(range.totalFullDays).toEqual(38);
  });
  it("6 Sundays", function() {
    return expect(range.fullDayDistribution[0]).toEqual(6);
  });
  it("6 Mondays", function() {
    return expect(range.fullDayDistribution[1]).toEqual(6);
  });
  it("6 Tuesdays", function() {
    return expect(range.fullDayDistribution[2]).toEqual(6);
  });
  it("6 Wednesdays", function() {
    return expect(range.fullDayDistribution[3]).toEqual(5);
  });
  it("6 Thursdays", function() {
    return expect(range.fullDayDistribution[4]).toEqual(5);
  });
  it("6 Fridays", function() {
    return expect(range.fullDayDistribution[5]).toEqual(5);
  });
  it("6 Saturdays", function() {
    return expect(range.fullDayDistribution[6]).toEqual(5);
  });
  it("Total days from 11:59:59 to midnight is 2", function() {
    var testRange;
    testRange = new DateRange(new Date(2013, 11, 17, 23, 59, 59, 999), new Date(2013, 11, 18, 0, 0, 0, 0));
    return expect(testRange.totalDays).toEqual(2);
  });
  it("Total days from the 15th to the 21st is 7 days", function() {
    var testRange;
    testRange = new DateRange(new Date(2013, 11, 15, 23, 59, 59, 999), new Date(2013, 11, 21, 0, 0, 0, 0));
    return expect(testRange.totalDays).toEqual(7);
  });
  it("Total full days from 11:59:59 to midnight is 0", function() {
    var testRange;
    testRange = new DateRange(new Date(2013, 11, 17, 23, 59, 59, 999), new Date(2013, 11, 18, 0, 0, 0, 0));
    return expect(testRange.totalFullDays).toEqual(0);
  });
  it("Total full days from the 15th to the 21st is 5 days", function() {
    var testRange;
    testRange = new DateRange(new Date(2013, 11, 15, 23, 59, 59, 999), new Date(2013, 11, 21, 0, 0, 0, 0));
    return expect(testRange.totalFullDays).toEqual(5);
  });
});

describe("Standard Date Behavior", function() {
  beforeEach(function() {});
  it("Creating date with expected Date", function() {
    var today;
    today = new Date(2013, 11, 17, 16, 11);
    return expect(today.toDateString()).toEqual("Tue Dec 17 2013");
  });
  it("Creating date with expected time", function() {
    var time, today;
    today = new Date(2013, 11, 17, 16, 11);
    time = today.toTimeString();
    return expect(time.indexOf("16:11")).toEqual(0);
  });
  it("Creating date and setting time to 0 keeps the same date", function() {
    var time, today;
    today = new Date(2013, 11, 17, 16, 11);
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    time = today.toTimeString();
    return expect(time.indexOf("00:00:00")).toEqual(0);
  });
});
