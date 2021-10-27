window.upgrade = function (model) {
  var curVersion = 1.2;
  if (!model.version) {
    model.version = 0.0;
  }

  if (model.version < 1.1) {
    //update all the string Booleans to real Booleans
    for (let curE of model.EventList) {
      if (curE.Event.mainItem && typeof curE.Event.mainItem == "string") {
        curE.Event.mainItem =
          curE.Event.mainItem.toUpperCase() == "TRUE" ? true : false;
      }
    }
    for (let curA of model.ActionList) {
      if (curA.Action.mainItem && typeof curA.Action.mainItem == "string") {
        curA.Action.mainItem =
          curA.Action.mainItem.toUpperCase() == "TRUE" ? true : false;
      }
      if (curA.Action.mutExcl && typeof curA.Action.mutExclm == "string") {
        curA.Action.mutExcl =
          curA.Action.mutExcl.toUpperCase() == "TRUE" ? true : false;
      }
    }
  }

  // Add distribution upgrades
  if (model.version < 1.2) {
    model.EventList.forEach((event) => {
      // Convert old distribution events
      if (
        [
          "etNormalDist",
          "etLogNormalDist",
          "etExponentialDist",
          "etWeibullDist",
        ].indexOf(event.Event.evType) > -1
      ) {
        switch (event.Event.evType) {
          case "etNormalDist":
          case "etLogNormalDist":
            if (event.Event.evType === "etLogNormalDist") {
              event.Event.distType = "dtLogNormal";
            } else {
              event.Event.distType = "dtNormal";
            }
            event.Event.parameters = [
              {
                name: "Mean",
                value: event.Event.ndMean,
                timeRate: event.Event.meanTimeRate,
                useVariable: false,
              },
              {
                name: "Standard Deviation",
                value: event.Event.ndStdDev,
                timeRate: event.Event.stdTimeRate,
                useVariable: false,
              },
              {
                name: "Minimum",
                value: event.Event.ndMin,
                timeRate: event.Event.minTimeRate,
                useVariable: false,
              },
              {
                name: "Maximum",
                value: event.Event.ndMax,
                timeRate: event.Event.maxTimeRate,
                useVariable: false,
              },
            ];
            event.Event.dfltTimeRate = 'trHours';
            delete event.Event.ndMean;
            delete event.Event.ndStdDev;
            delete event.Event.ndMin;
            delete event.Event.ndMax;
            delete event.Event.meanTimeRate;
            delete event.Event.stdTimeRate;
            delete event.Event.minTimeRate;
            delete event.Event.maxTimeRate;
            break;
          case "etExponentialDist":
            event.Event.distType = "dtExponential";
            event.Event.parameters = [
              {
                name: "Rate",
                value: event.Event.edRate,
                timeRate: event.Event.edTimeRate,
                useVariable: false,
              },
              {
                name: "Minimum",
                value: event.Event.edMin,
                timeRate: event.Event.minTimeRate,
                useVariable: false,
              },
              {
                name: "Maximum",
                value: event.Event.edMax,
                timeRate: event.Event.maxTimeRate,
                useVariable: false,
              },
            ];
            event.Event.dfltTimeRate = 'trHours';
            delete event.Event.edRate;
            delete event.Event.edTimeRate;
            delete event.Event.edMin;
            delete event.Event.edMax;
            break;
          case "etWeibullDist":
            event.Event.distType = "dtWeibull";
            event.Event.parameters = [
              {
                name: "Shape",
                value: event.Event.wdShape,
                useVariable: false,
              },
              {
                name: "Scale",
                value: event.Event.wdScale,
                useVariable: false,
              },
              {
                name: "Minimum",
                value: event.Event.wdMin,
                timeRate: event.Event.minTimeRate,
                useVariable: false,
              },
              {
                name: "Maximum",
                value: event.Event.wdMax,
                timeRate: event.Event.maxTimeRate,
                useVariable: false,
              },
            ];
            event.Event.dfltTimeRate = event.Event.wdTimeRate;
            delete event.Event.wdShape;
            delete event.Event.wdScale;
            delete event.Event.wdMin;
            delete event.Event.wdMax;
            break;
        }
        event.Event.evType = "etDistribution";
      }
    });
  }

  model.version = curVersion;
};
