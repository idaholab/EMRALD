/**
 * @file Model upgrade function.
 */

/**
 * Ensures backwards compatibility with old models by applying updates to the JSON structure.
 *
 * @param {DeprecatedModel} oldModel - The model to upgrade.
 * @returns {EMRALD.Model} The upgraded model.
 */
export default function upgrade(oldModel) {
  // Casts the deprecated types to a new object expecting the up-to-date types.
  const model = /** @type {EMRALD.Model} */ (
    /** @type {any} */ (oldModel)
  );
  const curVersion = 2.4;
  if (!model.version) {
    model.version = 0.0;
  }

  if (model.version < 1.1) {
    // update all the string Booleans to real Booleans
    oldModel.EventList.forEach((curE, e) => {
      if (curE.Event.mainItem && typeof curE.Event.mainItem === 'string') {
        model.EventList[e].Event.mainItem =
          curE.Event.mainItem.toUpperCase() === 'TRUE';
      }
    });
    oldModel.ActionList.forEach((curA, a) => {
      if (curA.Action.mainItem && typeof curA.Action.mainItem === 'string') {
        model.ActionList[a].Action.mainItem =
          curA.Action.mainItem.toUpperCase() === 'TRUE';
      }
      if (curA.Action.mutExcl && typeof curA.Action.mutExcl === 'string') {
        model.ActionList[a].Action.mutExcl =
          curA.Action.mutExcl.toUpperCase() === 'TRUE';
      }
    });
  }

  // Add distribution upgrades
  if (model.version < 1.2) {
    oldModel.EventList.forEach((event, e) => {
      // Convert old distribution events
      if (
        [
          'etNormalDist',
          'etLogNormalDist',
          'etExponentialDist',
          'etWeibullDist',
        ].indexOf(event.Event.evType) > -1
      ) {
        switch (event.Event.evType) {
          case 'etNormalDist':
          case 'etLogNormalDist':
            if (event.Event.evType === 'etLogNormalDist') {
              model.EventList[e].Event.distType = 'dtLogNormal';
            } else {
              model.EventList[e].Event.distType = 'dtNormal';
            }
            model.EventList[e].Event.parameters = [
              {
                name: 'Mean',
                timeRate: event.Event.meanTimeRate,
                useVariable: false,
                value: event.Event.mean,
              },
              {
                name: 'Standard Deviation',
                timeRate: event.Event.stdTimeRate,
                useVariable: false,
                value: event.Event.std,
              },
              {
                name: 'Minimum',
                timeRate: event.Event.minTimeRate,
                useVariable: false,
                value: event.Event.min,
              },
              {
                name: 'Maximum',
                timeRate: event.Event.maxTimeRate,
                useVariable: false,
                value: event.Event.max,
              },
            ];
            model.EventList[e].Event.dfltTimeRate = 'trHours';
            delete /** @type {any} */(model.EventList[e].Event).mean;
            delete /** @type {any} */(model.EventList[e].Event).std;
            delete /** @type {any} */(model.EventList[e].Event).min;
            delete /** @type {any} */(model.EventList[e].Event).max;
            delete /** @type {any} */(model.EventList[e].Event).meanTimeRate;
            delete /** @type {any} */(model.EventList[e].Event).stdTimeRate;
            delete /** @type {any} */(model.EventList[e].Event).minTimeRate;
            delete /** @type {any} */(model.EventList[e].Event).maxTimeRate;
            break;
          case 'etExponentialDist':
            model.EventList[e].Event.distType = 'dtExponential';
            model.EventList[e].Event.parameters = [
              {
                name: 'Rate',
                timeRate: event.Event.timeRate,
                useVariable: false,
                value: event.Event.rate,
              },
              {
                name: 'Minimum',
                timeRate: 'trHours',
                useVariable: false,
                value: 0,
              },
              {
                name: 'Maximum',
                timeRate: 'trYears',
                useVariable: false,
                value: 1000,
              },
            ];
            model.EventList[e].Event.dfltTimeRate = 'trHours';
            delete /** @type {any} */(model.EventList[e].Event).rate;
            delete /** @type {any} */(model.EventList[e].Event).timeRate;
            break;
          case 'etWeibullDist':
            model.EventList[e].Event.distType = 'dtWeibull';
            model.EventList[e].Event.parameters = [
              {
                name: 'Shape',
                useVariable: false,
                value: event.Event.shape,
              },
              {
                name: 'Scale',
                timeRate: event.Event.timeRate,
                useVariable: false,
                value: event.Event.scale,
              },
              {
                name: 'Minimum',
                timeRate: 'trHours',
                useVariable: false,
                value: 0,
              },
              {
                name: 'Maximum',
                timeRate: 'trYears',
                useVariable: false,
                value: 1000,
              },
            ];
            model.EventList[e].Event.dfltTimeRate = event.Event.timeRate;
            delete /** @type {any} */(model.EventList[e].Event).shape;
            delete /** @type {any} */(model.EventList[e].Event).scale;
            delete /** @type {any} */(model.EventList[e].Event).timeRate;
            break;
          default:
        }
        model.EventList[e].Event.evType = 'etDistribution';
      }
    });
  }

  // LogicTree updates
  if (model.version < 2.4) {
    oldModel.LogicNodeList.forEach((logicNode, i) => {
      model.LogicNodeList[i].LogicNode.isRoot =
        logicNode.LogicNode.rootName === logicNode.LogicNode.name;
      delete /** @type {any} */(model.LogicNodeList[i].LogicNode).rootName;
    });
  }

  model.version = curVersion;
  return model;
}
