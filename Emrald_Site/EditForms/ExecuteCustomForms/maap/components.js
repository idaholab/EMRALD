/**
 * @file AngularJS "components" used by the MAAP form.
 * Note: EMRALD uses AngularJS 1.2, before components were actually added to AngularJS, so these
 * use directives in a way that acts like components instead.
 */
// @ts-check

angular.module('maapParameter', []).directive('maapParameter', () => ({
  scope: {
    data: '=',
  },
  template: `<div>
        <input ng-if="data.flag" ng-model="data.flag.value" />
        {{data.index}}
        <div ng-if="data.value.type == 'parameter_name'">
            {{data.value.value}}
        </div>
        <div
            ng-if="data.value.type !== 'parameter_name'"
            maap-expression
            data="data"
        ></div>
    </div>`,
}));

angular
  .module('maapCallExpression', [])
  .directive('maapCallExpression', () => ({
    scope: {
      data: '=',
    },
    template: `<div>
            {{data.value.value}}(
            <div
                ng-repeat="arg in data.arguments"
                maap-expression-type
                data="arg"
            ></div>
            )
        </div>`,
  }));

angular
  .module('maapPureExpression', [])
  .directive('maapPureExpression', () => ({
    scope: {
      data: '=',
    },
    template: `<div>
            <div maap-expression-type data="data.value.left"></div>
            {{data.value.op}}
            <div
                ng-if="data.value.right.type == 'expression'"
                maap-pure-expression
                data="data.value.right"
            ></div>
            <div
                ng-if="data.value.right.type !== 'expression'"
                maap-expression-type
                data="data.value.right"
            ></div>
        </div>`,
  }));

angular
  .module('maapExpressionBlock', [])
  .directive('maapExpressionBlock', () => ({
    scope: {
      data: '=',
    },
    template: `<div>
            (
            <div maap-pure-expression data="data.value"></div>
            )
        </div>`,
  }));

angular
  .module('maapExpressionType', [])
  .directive('maapExpressionType', () => ({
    scope: {
      data: '=',
    },
    template: `<div ng-switch="data.type">
            <div
                ng-switch-when="call_expression"
                maap-call-expression
                data="data"
            ></div>
            <div
                ng-switch-when="expression_block"
                maap-expression-block
                data="data"
            ></div>
            <div ng-switch-default maap-variable data="data"></div>
        </div>`,
  }));

angular.module('maapAssignment', []).directive('maapAssignment', () => ({
  scope: {
    data: '=',
  },
  template: `<div>
        <div
            ng-if="data.target.type == 'call_expression'"
            maap-call-expression
            data="data"
        ></div>
        <div ng-if="data.target.type !== 'call_expression'">
            {{data.target.value}}
        </div>
        <div maap-expression data="data.value"></div>
    </div>`,
}));

angular.module('maapIsExpression', []).directive('maapIsExpression', () => ({
  scope: {
    data: '=',
  },
  template: `<div>
        <div maap-variable data="data.target"></div>
        IS
        <div maap-expression data="data.value"></div>
    </div>`,
}));

angular.module('maapAsExpression', []).directive('maapAsExpression', () => ({
  scope: {
    data: '=',
  },
  template: `<div>
        <div maap-variable data="data.target"></div>
        AS
        <input ng-model="data.value" />
    </div>`,
}));

angular.module('maapExpression', []).directive('maapExpression', () => ({
  scope: {
    data: '=',
  },
  template: `<div ng-switch="data.type">
        <div
            ng-switch-when="is_expression"
            maap-is-expression
            data="data"
        ></div>
        <div ng-switch-when="expression" maap-pure-expression data="data"></div>
        <div ng-switch-default maap-expression-type data="data"></div>
    </div>`,
}));

angular.module('maapVariable', []).directive('maapVariable', () => ({
  scope: {
    data: '=',
  },
  template: `<div>
        <div
            ng-if="data.type == 'call_expression'"
            maap-call-expression
            data="data"
        /></div>
        <input ng-if="data.type !== 'call_expression'" ng-model="data.value" />
    </div>`,
}));

angular.module('maapSourceElement', []).directive('maapSourceElement', () => ({
  scope: {
    data: '=',
  },
  template: `<div ng-switch="data.type">
      <div ng-switch-when="parameter_name" style="display: flex;">
        <div>{{data.value}}</div>
        <button>X</button>
      </div>
    </div>`,
}));

window.maapComponents = [
  'maapParameter',
  'maapCallExpression',
  'maapPureExpression',
  'maapExpressionBlock',
  'maapExpressionType',
  'maapAssignment',
  'maapIsExpression',
  'maapAsExpression',
  'maapExpression',
  'maapVariable',
  'maapSourceElement',
];
