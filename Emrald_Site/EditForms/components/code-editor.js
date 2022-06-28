/**
 * @file CodeEditor component.
 */
// @ts-check
/* global CodeJar, withLineNumbers, Prism */

/**
 * Logic for creating the code editor.
 *
 * @param {angular.IScope} $scope - Angular scope.
 * @param {angular.IElement} $element - Angular element.
 */
function CodeEditorController($scope, $element) {
  const target = $element.attr('code');
  Array.from(document.querySelectorAll('.code-editor')).forEach((editor) => {
    if (editor.getAttribute('data-initialized') !== 'true') {
      editor.setAttribute('data-initialized', 'true');
      const jar = new CodeJar(editor, withLineNumbers(Prism.highlightElement));
      jar.updateCode(this.code);
      jar.onUpdate((code) => {
        $scope.$parent.$apply(`${target} = "${code.replace(/"/g, '\\"')}"`);
      });
    }
  });
}

window.addCodeEditor = (module, url) => {
  module.component('codeEditor', {
    bindings: {
      code: '=',
    },
    controller: CodeEditorController,
    templateUrl: url,
  });
};
