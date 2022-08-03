/**
 * @file AngularJS "components" used by the MAAP form.
 * Note: EMRALD uses AngularJS 1.2, before components were actually added to AngularJS, so these
 * use directives in a way that acts like components instead.
 */
// @ts-check

angular.module('variableInput', []).directive('variableInput', () => ({
  link: ($scope, $element) => {
    const controllerScope = angular
      .element($element[0].ownerDocument.getElementById('maapFormController'))
      .scope();
    $scope.variables = controllerScope.variables;
    $scope.save = controllerScope.save;
    if ($scope.data.useVariable) {
      $scope.data.variable = controllerScope.form.findVariable($scope.data.variable);
    }
  },
  scope: {
    data: '=',
  },
  template: `<div>
    <input ng-if="!data.useVariable" ng-model="data.value" ng-change="save()" />
    <select ng-if="data.useVariable" ng-options="opt.name for opt in variables" ng-model="data.variable" ng-change="save()"></select>
    <input type="checkbox" ng-model="data.useVariable" ng-change="save()" /> Use Variable
  </div>`,
}));

angular.module('maapCallExpression', []).directive('maapCallExpression', [
  '$compile',
  ($compile) => ({
    compile: function (el) {
      const contents = el.contents().remove();
      return (scope, el2) => {
        $compile(contents)(scope, (clone) => {
          el2.append(clone);
        });
      };
    },
    scope: {
      data: '=',
    },
    template: `<div>
    <div variable-input data="data.value"></div>
    (
    <div ng-repeat="arg in data.arguments" maap-expression-type data="arg"></div>
    )
  </div>`,
  }),
]);

angular.module('maapPureExpression', []).directive('maapPureExpression', [
  '$compile',
  ($compile) => ({
    compile: function (el) {
      const contents = el.contents().remove();
      return (scope, el2) => {
        $compile(contents)(scope, (clone) => {
          el2.append(clone);
        });
      };
    },
    scope: {
      data: '=',
    },
    template: `<div>
    <div maap-expression-type data="data.value.left"></div>
    {{data.value.op}}
    <div ng-if="data.value.right.type == 'expression'" maap-pure-expression data="data.value.right"></div>
    <div ng-if="data.value.right.type !== 'expression'" maap-expression-type data="data.value.right"></div>
  </div>`,
  }),
]);

angular.module('maapExpressionBlock', []).directive('maapExpressionBlock', [
  '$compile',
  ($compile) => ({
    compile: function (el) {
      const contents = el.contents().remove();
      return (scope, el2) => {
        $compile(contents)(scope, (clone) => {
          el2.append(clone);
        });
      };
    },
    scope: {
      data: '=',
    },
    template: `<div>
    (
    <div maap-pure-expression data="data.value"></div>
    )
  </div>`,
  }),
]);

angular.module('maapExpressionType', []).directive('maapExpressionType', [
  '$compile',
  ($compile) => ({
    compile: function (el) {
      const contents = el.contents().remove();
      return (scope, el2) => {
        $compile(contents)(scope, (clone) => {
          el2.append(clone);
        });
      };
    },
    scope: {
      data: '=',
    },
    template: `<div ng-switch="data.type">
    <div ng-switch-when="call_expression" maap-call-expression data="data"></div>
    <div ng-switch-when="expression_block" maap-expression-block data="data"></div>
    <div ng-switch-default maap-variable data="data"></div>
  </div>`,
  }),
]);

angular.module('maapIsExpression', []).directive('maapIsExpression', [
  '$compile',
  ($compile) => ({
    compile: function (el) {
      const contents = el.contents().remove();
      return (scope, el2) => {
        $compile(contents)(scope, (clone) => {
          el2.append(clone);
        });
      };
    },
    scope: {
      data: '=',
    },
    template: `<div>
    <div maap-variable data="data.target"></div>
    IS
    <div maap-expression data="data.value"></div>
  </div>`,
  }),
]);

angular.module('maapExpression', []).directive('maapExpression', [
  '$compile',
  ($compile) => ({
    compile: function (el) {
      const contents = el.contents().remove();
      return (scope, el2) => {
        $compile(contents)(scope, (clone) => {
          el2.append(clone);
        });
      };
    },
    scope: {
      data: '=',
    },
    template: `<div ng-switch="data.type">
    <div ng-switch-when="is_expression" maap-is-expression data="data"></div>
    <div ng-switch-when="expression" maap-pure-expression data="data"></div>
    <div ng-switch-default maap-expression-type data="data"></div>
  </div>`,
  }),
]);

angular.module('maapVariable', []).directive('maapVariable', [
  '$compile',
  ($compile) => ({
    compile: function (el) {
      const contents = el.contents().remove();
      return (scope, el2) => {
        $compile(contents)(scope, (clone) => {
          el2.append(clone);
        });
      };
    },
    scope: {
      data: '=',
    },
    template: `<div ng-switch="data.type">
    <div ng-if="data.type == 'call_expression'" maap-call-expression data="data" /></div>
    <div variable-input ng-if="data.type !== 'call_expression'" data="data"></div>
  </div>`,
  }),
]);

angular.module('maapSourceElement', []).directive('maapSourceElement', [
  '$compile',
  ($compile) => ({
    compile: function (el) {
      const contents = el.contents().remove();
      return (scope, el2) => {
        $compile(contents)(scope, (clone) => {
          el2.append(clone);
        });
      };
    },
    scope: {
      data: '=',
    },
    template: `<div>{{data}}</div>`,
  }),
]);

angular.module('maapConditionalBlock', []).directive('maapConditionalBlock', [
  '$compile',
  ($compile) => ({
    compile: function (el) {
      const contents = el.contents().remove();
      return (scope, el2) => {
        $compile(contents)(scope, (clone) => {
          el2.append(clone);
        });
      };
    },
    scope: {
      data: '=',
    },
    template: `<div>
    {{data.blockType}}
    <div maap-expression data="data.test"></div>
    <hr />
    <div>
      {{data.value}}
      <div ng-repeat="sourceElement in data.value" maap-source-element data="sourceElement"></div>
    </div>
  </div>`,
  }),
]);

window.maapComponents = [
  'variableInput',
  'maapCallExpression',
  'maapPureExpression',
  'maapExpressionBlock',
  'maapExpressionType',
  'maapIsExpression',
  'maapExpression',
  'maapVariable',
  'maapSourceElement',
  'maapConditionalBlock',
];
