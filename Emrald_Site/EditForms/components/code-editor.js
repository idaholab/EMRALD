/**
 * @file CodeEditor component.
 */
// @ts-check
/* global angular, CodeJar, withLineNumbers, Prism */

angular.module('codeEditor', []).directive('codeEditor', () => ({
  link: ($scope, $element) => {
    setTimeout(() => {
      const target = $element.attr('code');
      const jar = new CodeJar(
        $element.children()[0].children[0],
        withLineNumbers(Prism.highlightElement),
      );
      jar.updateCode($scope.code);
      jar.onUpdate((code) => {
        $scope.$parent.$apply(`${target} = "${code.replace(/"/g, '\\"')}"`);
      });
    }, 100);
  },
  scope: {
    code: '=',
  },
  template: `<div class="code-editor-wrapper">
  <div class="code-editor language-csharp"></div>
  <link href="./lib/prism.css" rel="stylesheet" />
  <style>
    .code-editor {
        background-color: #f5f2f0;
        font-family: 'Source Code Pro', monospace;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: normal;
        line-height: 20px;
        padding: 10px;
        tab-size: 4;
        height: calc(100% - 20px);
    }
    .codejar-wrap, .code-editor-wrapper {
        height: 100%;
    }
  </style>
</div>`,
}));
