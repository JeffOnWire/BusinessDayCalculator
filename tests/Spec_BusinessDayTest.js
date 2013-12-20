/*
  Under source control. Please contact the OIG Applications Development team before modifying.
*/

describe("Schedule Processor Class", function() {
  beforeEach(function() {});
  it("Throws an exception if there is no BusinessWeek definition", function() {
    var validateSchedule;
    validateSchedule = function() {
      var scheduleValidator;
      scheduleValidator = new ScheduleValidator();
      return scheduleValidator.validateSchedule({
        _BusinessWeek: {
          Sunday: "",
          Monday: "0801-1730",
          Tuesday: "0802-1730",
          Wednesday: "0803-1730",
          Thursday: "0804-1730",
          Friday: "0805-1730",
          Saturday: "0806-1730"
        }
      });
    };
    return expect(validateSchedule).toThrow("Schedule validation error: Definition requires a BusinessWeek.");
  });
  it("Throws an exception if there is an incorrect day in the BusinessWeek definition", function() {
    var validateSchedule;
    validateSchedule = function() {
      var scheduleValidator;
      scheduleValidator = new ScheduleValidator();
      return scheduleValidator.validateSchedule({
        BusinessWeek: {
          sturdaySunday: "",
          Monday: "0801-1730",
          Tuesday: "0802-1730",
          Wednesday: "0803-1730",
          Thursday: "0804-1730",
          Friday: "0805-1730",
          Saturday: "0806-1730"
        }
      });
    };
    return expect(validateSchedule).toThrow("Schedule validation error: \"sturdaySunday\" is not a valid day of the week.");
  });
  it("Throws an exception if hours are not formatted correctly", function() {
    var validateSchedule;
    validateSchedule = function() {
      var scheduleValidator;
      scheduleValidator = new ScheduleValidator();
      return scheduleValidator.validateSchedule({
        BusinessWeek: {
          Sunday: "8:00 AM to 5:30 PM",
          Monday: "0801-1730",
          Tuesday: "0802-1730",
          Wednesday: "0803-1730",
          Thursday: "0804-1730",
          Friday: "0805-1730",
          Saturday: "0806-1730"
        }
      });
    };
    return expect(validateSchedule).toThrow("Schedule validation error: \"8:00 AM to 5:30 PM\" is not a valid definition of hours for \"Sunday\".");
  });
  it("Throws an exception if \"Holidays\" is not an array", function() {
    var validateSchedule;
    validateSchedule = function() {
      var scheduleValidator;
      scheduleValidator = new ScheduleValidator();
      return scheduleValidator.validateSchedule({
        BusinessWeek: {
          Sunday: "0800-1730",
          Monday: "0801-1730",
          Tuesday: "0802-1730",
          Wednesday: "0803-1730",
          Thursday: "0804-1730",
          Friday: "0805-1730",
          Saturday: "0806-1730"
        },
        Holidays: "hello"
      });
    };
    return expect(validateSchedule).toThrow("Schedule validation error: Holidays must be an array.");
  });
  it("Throws an exception if \"Modifiers\" is not an array", function() {
    var validateSchedule;
    validateSchedule = function() {
      var scheduleValidator;
      scheduleValidator = new ScheduleValidator();
      return scheduleValidator.validateSchedule({
        BusinessWeek: {
          Sunday: "0800-1730",
          Monday: "0801-1730",
          Tuesday: "0802-1730",
          Wednesday: "0803-1730",
          Thursday: "0804-1730",
          Friday: "0805-1730",
          Saturday: "0806-1730"
        },
        Modifiers: "hello"
      });
    };
    return expect(validateSchedule).toThrow("Schedule validation error: Modifiers must be an array.");
  });
  it("Throws an exception if \"Modifiers\" definitions are not arrays", function() {
    var validateSchedule;
    validateSchedule = function() {
      var scheduleValidator;
      scheduleValidator = new ScheduleValidator();
      return scheduleValidator.validateSchedule({
        BusinessWeek: {
          Sunday: "0800-1730",
          Monday: "0801-1730",
          Tuesday: "0802-1730",
          Wednesday: "0803-1730",
          Thursday: "0804-1730",
          Friday: "0805-1730",
          Saturday: "0806-1730"
        },
        Modifiers: [20131219]
      });
    };
    return expect(validateSchedule).toThrow("Schedule validation error: Modifier definitions must be arrays.");
  });
  it("Throws an exception if \"Holiday\" definitions are not arrays", function() {
    var validateSchedule;
    validateSchedule = function() {
      var scheduleValidator;
      scheduleValidator = new ScheduleValidator();
      return scheduleValidator.validateSchedule({
        BusinessWeek: {
          Sunday: "0800-1730",
          Monday: "0801-1730",
          Tuesday: "0802-1730",
          Wednesday: "0803-1730",
          Thursday: "0804-1730",
          Friday: "0805-1730",
          Saturday: "0806-1730"
        },
        Holidays: [20131219]
      });
    };
    return expect(validateSchedule).toThrow("Schedule validation error: Holiday definitions must be arrays.");
  });
  it("Throws an exception if \"Holiday\" definitions don't have a date value", function() {
    var validateSchedule;
    validateSchedule = function() {
      var scheduleValidator;
      scheduleValidator = new ScheduleValidator();
      return scheduleValidator.validateSchedule({
        BusinessWeek: {
          Sunday: "0800-1730",
          Monday: "0801-1730",
          Tuesday: "0802-1730",
          Wednesday: "0803-1730",
          Thursday: "0804-1730",
          Friday: "0805-1730",
          Saturday: "0806-1730"
        },
        Holidays: [[]]
      });
    };
    return expect(validateSchedule).toThrow("Schedule validation error: Holiday definitions must have a date value.");
  });
  it("Throws an exception if \"Modifier\" definitions don't have a date value", function() {
    var validateSchedule;
    validateSchedule = function() {
      var scheduleValidator;
      scheduleValidator = new ScheduleValidator();
      return scheduleValidator.validateSchedule({
        BusinessWeek: {
          Sunday: "0800-1730",
          Monday: "0801-1730",
          Tuesday: "0802-1730",
          Wednesday: "0803-1730",
          Thursday: "0804-1730",
          Friday: "0805-1730",
          Saturday: "0806-1730"
        },
        Modifiers: [[]]
      });
    };
    return expect(validateSchedule).toThrow("Schedule validation error: Modifier definitions must have a date value.");
  });
  it("Throws an exception if \"Modifier\" definitions don't have a properly formatted date value", function() {
    var validateSchedule;
    validateSchedule = function() {
      var scheduleValidator;
      scheduleValidator = new ScheduleValidator();
      return scheduleValidator.validateSchedule({
        BusinessWeek: {
          Sunday: "0800-1730",
          Monday: "0801-1730",
          Tuesday: "0802-1730",
          Wednesday: "0803-1730",
          Thursday: "0804-1730",
          Friday: "0805-1730",
          Saturday: "0806-1730"
        },
        Modifiers: [[2013040404]]
      });
    };
    return expect(validateSchedule).toThrow("Schedule validation error: Modifier definition dates must be in the form yyyymmdd.");
  });
  it("Throws an exception if \"Holiday\" definitions don't have a properly formatted date value", function() {
    var validateSchedule;
    validateSchedule = function() {
      var scheduleValidator;
      scheduleValidator = new ScheduleValidator();
      return scheduleValidator.validateSchedule({
        BusinessWeek: {
          Sunday: "0800-1730",
          Monday: "0801-1730",
          Tuesday: "0802-1730",
          Wednesday: "0803-1730",
          Thursday: "0804-1730",
          Friday: "0805-1730",
          Saturday: "0806-1730"
        },
        Holidays: [["December 25, 2014"]]
      });
    };
    return expect(validateSchedule).toThrow("Schedule validation error: Holiday definition dates must be in the form yyyymmdd.");
  });
});

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
  it("5 Wednesdays", function() {
    return expect(range.fullDayDistribution[3]).toEqual(5);
  });
  it("5 Thursdays", function() {
    return expect(range.fullDayDistribution[4]).toEqual(5);
  });
  it("5 Fridays", function() {
    return expect(range.fullDayDistribution[5]).toEqual(5);
  });
  it("5 Saturdays", function() {
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
