var BusinessDay, BusinessDayModifier, DateRange, Holiday, Schedule, ScheduleProcessor, Utilities, WeekDay, scheduleDefinition;

scheduleDefinition = {
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
  function ScheduleProcessor() {
    this.DaysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  }

  ScheduleProcessor.prototype.getScheduleFromDefinition = function(scheduleDefinition) {
    var day, holiday, holidayDefinition, i, modifier, modifierDefinition, schedule, weekDay, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    schedule = new Schedule();
    _ref = this.DaysOfTheWeek;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      day = _ref[i];
      weekDay = new WeekDay(i);
      weekDay.businessDay = new BusinessDay(i, scheduleDefinition.BusinessWeek[day]);
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

Utilities = (function() {
  function Utilities() {}

  Utilities.prototype.getTimelessDateFromShortDate = function(shortDate) {
    var d, m, shortDateString, y;
    shortDateString = shortDate.toString();
    y = parseInt(shortDateString.substr(0, 4));
    m = parseInt(shortDateString.substr(4, 2)) - 1;
    d = parseInt(shortDateString.substr(6, 2));
    return new Date(y, m, d);
  };

  return Utilities;

})();

Schedule = (function() {
  function Schedule(schedule) {
    this.weekDays = [];
  }

  return Schedule;

})();

WeekDay = (function() {
  function WeekDay(dayOfTheWeek) {
    this.dayOfTheWeek = dayOfTheWeek;
    this.businessDay;
    this.holidays = [];
    this.modifiedBusinessDays = [];
  }

  return WeekDay;

})();

BusinessDayModifier = (function() {
  function BusinessDayModifier(modifierDefinition) {
    var utils;
    utils = new Utilities();
    this.dateString = modifierDefinition[0];
    this.date = utils.getTimelessDateFromShortDate(this.dateString);
    this.hours = modifierDefinition[1];
    this.title = modifierDefinition[2];
  }

  return BusinessDayModifier;

})();

Holiday = (function() {
  function Holiday(holidayDefinition) {
    var utils;
    utils = new Utilities();
    this.dateString = holidayDefinition[0];
    this.date = utils.getTimelessDateFromShortDate(this.dateString);
    this.title = holidayDefinition[1];
  }

  return Holiday;

})();

BusinessDay = (function() {
  function BusinessDay(dayOfTheWeek, hourDefinitions) {
    var utils;
    utils = new Utilities();
    this.hours = hourDefinitions;
    /*
    for range in hourDefinitions
      start = @.dateForHours(range[0])
      end = @.dateForHours(range[1])
      @.hours.push(start,end)
    */

    this.totalBusinessHours;
  }

  BusinessDay.prototype.getHoursInRange = function(rangeObject) {
    /*
      hours = totalBusinessHours * range.numberOfDaysByDay(@.dayOfTheWeek)
      hours += numberOfHoursInDate(rangeObject.beginDate)
      if rangeObject.endDate?
        hours += numberOfHoursInDate(rangeObject.endDate)
    */

    return "Hello";
  };

  BusinessDay.prototype.dateForHours = function(hours) {
    var date, h, m;
    h = parseInt(hours.substr(0, 2));
    m = parseInt(hours.substr(2, 2));
    date = new Date(0);
    date.setHours(h);
    date.setMinutes(m);
    return date;
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
    this.timelessEndDate = this.getTimelessDate(endDate);
    this.totalDays = ((this.timelessEndDate - this.timelessBeginDate) / 86400000) + 1;
    this.totalFullDays = 0;
    if (this.totalDays > 2) {
      this.totalFullDays = this.totalDays - 2;
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
