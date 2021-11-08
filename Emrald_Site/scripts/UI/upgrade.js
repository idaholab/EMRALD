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
                value: event.Event.mean,
                timeRate: event.Event.meanTimeRate,
                useVariable: false,
              },
              {
                name: "Standard Deviation",
                value: event.Event.std,
                timeRate: event.Event.stdTimeRate,
                useVariable: false,
              },
              {
                name: "Minimum",
                value: event.Event.min,
                timeRate: event.Event.minTimeRate,
                useVariable: false,
              },
              {
                name: "Maximum",
                value: event.Event.max,
                timeRate: event.Event.maxTimeRate,
                useVariable: false,
              },
            ];
            event.Event.dfltTimeRate = 'trHours';
            delete event.Event.mean;
            delete event.Event.std;
            delete event.Event.min;
            delete event.Event.max;
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
                value: event.Event.rate,
                timeRate: event.Event.timeRate,
                useVariable: false,
              },
              {
                name: "Minimum",
                value: 0,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: "Maximum",
                value: 1000,
                timeRate: 'trYears',
                useVariable: false,
              },
            ];
            event.Event.dfltTimeRate = 'trHours';
            delete event.Event.rate;
            delete event.Event.timeRate;
            break;
          case "etWeibullDist":
            event.Event.distType = "dtWeibull";
            event.Event.parameters = [
              {
                name: "Shape",
                value: event.Event.shape,
                useVariable: false,
              },
              {
                name: "Scale",
                value: event.Event.scale,
                timeRate: event.Event.timeRate,
                useVariable: false,
              },
              {
                name: "Minimum",
                value: 0,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: "Maximum",
                value: 1000,
                timeRate: 'trYears',
                useVariable: false,
              },
            ];
            event.Event.dfltTimeRate = event.Event.timeRate;
            delete event.Event.shape;
            delete event.Event.scale;
            delete event.Event.timeRate;
            break;
        }
        event.Event.evType = "etDistribution";
      }
    });
  }

  model.version = curVersion;
};
