var BusinessDay, BusinessDayModifier, DateRange, Holiday, Schedule, ScheduleProcessor, WeekDay, exampleScheduleDefinition;

exampleScheduleDefinition = {
  BusinessWeek: {
    Sunday: "",
    Monday: "0801-1730",
    Tuesday: "0802-1730",
    Wednesday: "0803-1730",
    Thursday: "0804-1730",
    Friday: "0805-1730",
    Saturday: "0806-1730"
  },
  Holidays: [[20131225, "Christmas"], [20140101, "New Years"], [20140120], [20140217, "Washington's Birthday"], [20140131, "Employee Appreciation Day"]],
  Modifiers: [[20131224, "0800-1200", "Half-Day"], [20140105, "0800-1200", "Inventory"]]
};

ScheduleProcessor = (function() {
  function ScheduleProcessor(scheduleDefinition) {
    this.DaysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  }

  ScheduleProcessor.prototype.getScheduleFromDefinition = function(scheduleDefinition) {
    var day, holiday, holidayDefinition, i, modifier, modifierDefinition, schedule, weekDay, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    schedule = new Schedule();
    _ref = this.DaysOfTheWeek;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      day = _ref[i];
      weekDay = new WeekDay(i);
      weekDay.businessDay = new BusinessDay(scheduleDefinition.BusinessWeek[day]);
      schedule.weekDays[i] = weekDay;
    }
    _ref1 = scheduleDefinition.Holidays;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      holidayDefinition = _ref1[_j];
      holiday = new Holiday(holidayDefinition);
      weekDay = schedule.weekDays[holiday.date.getDay()];
      weekDay.holidays.push(holiday);
    }
    _ref2 = scheduleDefinition.Modifiers;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      modifierDefinition = _ref2[_k];
      modifier = new BusinessDayModifier(modifierDefinition);
      weekDay = schedule.weekDays[modifier.date.getDay()];
      weekDay.modifiedBusinessDays.push(modifier);
    }
    return schedule;
  };

  return ScheduleProcessor;

})();

this.utils = {
  getTimelessDateFromShortDate: function(shortDate) {
    var d, m, shortDateString, y;
    shortDateString = shortDate.toString();
    y = parseInt(shortDateString.substr(0, 4));
    m = parseInt(shortDateString.substr(4, 2)) - 1;
    d = parseInt(shortDateString.substr(6, 2));
    return new Date(y, m, d);
  },
  getShortDate: function(date) {
    var d, m, y;
    y = date.getFullYear().toString();
    m = (date.getMonth() + 1).toString();
    d = date.getDate().toString();
    if (m.length = 1) {
      m = "0" + m;
    }
    if (d.length = 1) {
      m = "0" + d;
    }
    return y + m + d;
  },
  getDatelessTimeFromDate: function(date) {
    var returnDate;
    returnDate = new Date(0);
    returnDate.setHours(date.getHours());
    returnDate.setMinutes(date.getMinutes());
    returnDate.setSeconds(date.getSeconds());
    returnDate.setMilliseconds(date.getMilliseconds());
    return returnDate;
  },
  getDatelessTimeFromString: function(time) {
    var returnDate;
    returnDate = new Date(0);
    returnDate.setHours(time.substr(0, 2));
    returnDate.setMinutes(time.substr(2, 2));
    return returnDate;
  }
};

Schedule = (function() {
  function Schedule(schedule) {
    this.weekDays = [];
  }

  Schedule.prototype.getBusinessHoursDifference = function(date1, date2) {
    var dateRange, milliseconds, weekDay, _i, _len, _ref, _results;
    dateRange = new DateRange(date1, date2);
    milliseconds = 0;
    _ref = this.weekDays;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      weekDay = _ref[_i];
      _results.push(milliseconds += weekDay.getHours(dateRange));
    }
    return _results;
  };

  Schedule.prototype.addBusinessHours = function(date, hours) {
    return date;
  };

  return Schedule;

})();

WeekDay = (function() {
  function WeekDay(dayOfTheWeek) {
    this.dayOfTheWeek = dayOfTheWeek;
    this.businessDay;
    this.holidays = [];
    this.modifiedBusinessDays = [];
  }

  WeekDay.prototype.getMilliseconds = function(dateRange) {
    var currentBusinessDay, firstDaySupplements, fullDaySupplements, fullDays, holiday, lastDaySupplements, milliseconds, modifier, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    milliseconds = 0;
    firstDaySupplements = {
      holidays: [],
      modifiers: []
    };
    lastDaySupplements = {
      holidays: [],
      modifiers: []
    };
    fullDaySupplements = {
      holidays: [],
      modifiers: []
    };
    _ref = this.holidays;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      holiday = _ref[_i];
      if (holiday.shortDate === dateRange.beginShortDate) {
        firstDaySupplements.holidays.push(holiday);
      } else if (holiday.shortDate === dateRange.endShortDate) {
        lastDaySupplements.holidays.push(holiday);
      } else if (holiday.shortDate > dateRange.beginShortDate && holiday.shortDate < dateRange.endShortDate) {
        fullDaySupplements.holidays.push(holiday);
      }
    }
    _ref1 = this.modifiers;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      modifier = _ref1[_j];
      if (modifier.shortDate === dateRange.beginShortDate) {
        firstDaySupplements.modifier.push(modifier);
      } else if (modifiers.shortDate === dateRange.endShortDate) {
        lastDaySupplements.modifiers.push(modifier);
      } else if (modifier.shortDate > dateRange.beginShortDate && modifier.shortDate < dateRange.endShortDate) {
        fullDaySupplements.modifiers.push(modifier);
      }
      /*
      !!!!!!!!!!! remember that a modifier is just a business day used in place of the 
      base business day!
      */

    }
    if (dateRange.beginDate.getDay() === this.dayOfTheWeek) {
      if (firstDaySupplements.modifier.length > 0) {
        currentBusinessDay = new BusinessDay(firstDaySupplements.modifier[0].hours);
      } else {
        currentBusinessDay = this.businessDay;
      }
      milliseconds += currentBusinessDay.getMillisecondsInRange(dateRange.beginDate, dateRange.timelessFirstFullDate);
    }
    if (dateRange.totalDays > 0) {
      fullDays = dateRange.fullDayDistribution[this.dayOfTheWeek];
      fullDays -= fullDaySupplements.holidays.length;
      if (fullDays > 0) {
        _ref2 = fullDaySupplements.modifiers;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          modifier = _ref2[_k];
          fullDays--;
          currentBusinessDay = new BusinessDay(modifier.hours);
          milliseconds += currentBusinessDay.totalBusinessMilliseconds;
          if (fullDays > 0) {
            milliseconds += this.businessDay.totalBusinessMilliseconds * fullDays;
          }
        }
      }
      if (dateRange.endDate.getDay() === this.dayOfTheWeek) {
        if (lastDaySupplements.modifier.length > 0) {
          currentBusinessDay = new BusinessDay(lastDaySupplements.modifier[0].hours);
        } else {
          currentBusinessDay = this.businessDay;
        }
        milliseconds += currentBusinessDay.getMillisecondsInRange(dateRange.endDateTimeless, dateRange.endDate);
      }
    }
    return milliseconds;
  };

  return WeekDay;

})();

BusinessDayModifier = (function() {
  function BusinessDayModifier(modifierDefinition) {
    this.shortDate = modifierDefinition[0];
    this.date = utils.getTimelessDateFromShortDate(this.dateString);
    this.hours = modifierDefinition[1];
    this.title = modifierDefinition[2];
  }

  return BusinessDayModifier;

})();

Holiday = (function() {
  function Holiday(holidayDefinition) {
    this.shortDate = holidayDefinition[0];
    this.date = utils.getTimelessDateFromShortDate(this.dateString);
    this.title = holidayDefinition[1];
  }

  return Holiday;

})();

BusinessDay = (function() {
  function BusinessDay(hoursDefinition) {
    this.hours = hoursDefinition;
    /*
    for range in hourDefinitions
      start = @.dateForHours(range[0])
      end = @.dateForHours(range[1])
      @.hours.push(start,end)
    */

    this.beginDatelessTime = utils.getDatelessTimeFromString(hoursDefinition.substr(0, 4));
    this.endDatelessTime = utils.getDatelessTimeFromString(hoursDefinition.substr(5, 4));
    this.totalBusinessMilliseconds = this.endDatelessTime - this.beginDatelessTime;
  }

  /*
    returns the number of business milliseconds that 
    occur in the date range
    so if the range was midnight to noon
    and the business hours were 0800-1730 the 
    return is the overlap, 8-noon
  */


  BusinessDay.prototype.getMillisecondsInRange = function(beginDate, endDate) {
    var beginRangeDatelessTime, endRangeDatelessTime, sorter;
    beginRangeDatelessTime = utils.getDatelessTimeFromDate(beginDate);
    endRangeDatelessTime = utils.getDatelessTimeFromDate(endDate);
    if (beginRangeDatelessTime >= this.endDatelessTime) {
      return 0;
    }
    if (endRangeDatelessTime < this.beginDatelessTime) {
      return 0;
    }
    sorter = [beginRangeDatelessTime, endRangeDatelessTime, beginDatelessTime, endDatelessTime];
    sorter.sort;
    return Math.abs(sorter[2] - sorter[3]);
  };

  return BusinessDay;

})();

DateRange = (function() {
  function DateRange(beginDate, endDate) {
    if (beginDate == null) {
      throw "beginDate is required";
    }
    if (endDate == null) {
      throw "endDate is required";
    }
    this.beginDate = new Date(beginDate.getTime());
    this.endDate = new Date(endDate.getTime());
    this.timelessBeginDate = this.getTimelessDate(beginDate);
    this.timelessFirstFullDate;
    this.timelessEndDate = this.getTimelessDate(endDate);
    this.beginDateShort = utils.getShortDate(this.beginDate);
    this.endShortDate = utils.getShortDate(this.endDate);
    this.totalDays = ((this.timelessEndDate - this.timelessBeginDate) / 86400000) + 1;
    this.totalFullDays = 0;
    if (this.totalDays > 2) {
      this.totalFullDays = this.totalDays - 2;
    }
    if (this.totalFullDays > 0) {
      this.timelessFirstFullDate = new Date(timelessBeginDate.getMilliseconds());
      this.timelessFirstFullDate.setDate(this.timelessFirstFullDate.getDate() + 1);
    }
    this.fullDayDistribution = this.getFullDayDistribution(this.totalFullDays, this.beginDate);
  }

  /*
    remember you just finished the above...does it work? Is it wonderful?
  */


  DateRange.prototype.getTimelessDate = function(fromDate) {
    var timelessDate;
    timelessDate = new Date(fromDate.getTime());
    timelessDate.setHours(0);
    timelessDate.setMinutes(0);
    timelessDate.setSeconds(0);
    timelessDate.setMilliseconds(0);
    return timelessDate;
  };

  /*
  
    a range will always have a beginning date.
    if the range is more than one day, it will have an end date
    beginning and ending dates, which may be fractions of a day
    number of days by day of week
      number of full mondays, tuesdays, etc.
    
    so an evaluator can
  */


  DateRange.prototype.incrementDayOfWeek = function(day) {
    day++;
    if (day > 6) {
      day = 0;
    }
    return day;
  };

  DateRange.prototype.getFullDayDistribution = function(totalFullDays, beginDate) {
    var dayCount, dayOfWeekPointer, fullDayDistribution, i, quotient, remainder, _i, _len;
    fullDayDistribution = [0, 0, 0, 0, 0, 0, 0];
    if (totalFullDays > 0) {
      quotient = Math.floor(totalFullDays / 7);
      remainder = totalFullDays % 7;
      for (i = _i = 0, _len = fullDayDistribution.length; _i < _len; i = ++_i) {
        dayCount = fullDayDistribution[i];
        fullDayDistribution[i] = quotient;
      }
      dayOfWeekPointer = beginDate.getDay();
      while (remainder > 0) {
        dayOfWeekPointer = this.incrementDayOfWeek(dayOfWeekPointer);
        fullDayDistribution[dayOfWeekPointer] = fullDayDistribution[dayOfWeekPointer] + 1;
        remainder--;
      }
    }
    return fullDayDistribution;
  };

  return DateRange;

})();
