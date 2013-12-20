var ScheduleValidator;

ScheduleValidator = (function() {
  function ScheduleValidator() {
    this.DaysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  }

  ScheduleValidator.prototype.validateSchedule = function(scheduleDefinition) {
    var day, dayOfWeek, holidayDate, holidayDefinition, modifierDate, modifierDefinition, reDays, reHours, reShortDate, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (scheduleDefinition.BusinessWeek == null) {
      throw "Schedule validation error: Definition requires a BusinessWeek.";
    }
    reHours = new RegExp("^\\d{4}-\\d{4}$");
    reShortDate = new RegExp("^\\d{8}$");
    reDays = new RegExp("^" + this.DaysOfTheWeek.join("$|^") + "$");
    for (day in scheduleDefinition.BusinessWeek) {
      if (reDays.test(day) === false) {
        throw "Schedule validation error: \"" + day + "\" is not a valid day of the week.";
      }
      dayOfWeek = scheduleDefinition.BusinessWeek[day];
      if ((dayOfWeek != null) && dayOfWeek.length > 0) {
        if (reHours.test(dayOfWeek) === false) {
          throw "Schedule validation error: \"" + dayOfWeek + "\" is not a valid definition of hours for \"" + day + "\".";
        }
      }
    }
    if (scheduleDefinition.Holidays != null) {
      if (scheduleDefinition.Holidays instanceof Array === false) {
        throw "Schedule validation error: Holidays must be an array.";
      } else {
        _ref = scheduleDefinition.Holidays;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          holidayDefinition = _ref[_i];
          if (holidayDefinition instanceof Array === false) {
            throw "Schedule validation error: Holiday definitions must be arrays.";
          }
          if (holidayDefinition.length === 0) {
            throw "Schedule validation error: Holiday definitions must have a date value.";
          }
          holidayDate = holidayDefinition[0].toString();
          if (reShortDate.test(holidayDate) === false) {
            throw "Schedule validation error: Holiday definition dates must be in the form yyyymmdd.";
          }
        }
      }
    }
    if (scheduleDefinition.Modifiers != null) {
      if (scheduleDefinition.Modifiers instanceof Array === false) {
        throw "Schedule validation error: Modifiers must be an array.";
      } else {
        _ref1 = scheduleDefinition.Modifiers;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          modifierDefinition = _ref1[_j];
          if (modifierDefinition instanceof Array === false) {
            throw "Schedule validation error: Modifier definitions must be arrays.";
          }
          if (modifierDefinition.length === 0) {
            throw "Schedule validation error: Modifier definitions must have a date value.";
          }
          modifierDate = modifierDefinition[0].toString();
          if (reShortDate.test(modifierDate) === false) {
            throw "Schedule validation error: Modifier definition dates must be in the form yyyymmdd.";
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    }
  };

  return ScheduleValidator;

})();
