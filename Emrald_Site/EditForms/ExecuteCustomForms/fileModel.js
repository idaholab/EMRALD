/**
 * @file The file-model directive.
 */
// @ts-check

/**
 * @namespace FileModel
 */

/**
 * @typedef FileModel.Scope
 * @property {string} fileName - The name of the uploaded file.
 */

/**
 * Angular directive for automatically reading the contents of uploaded files.
 *
 * @global
 * @param {import('angular').IParseService} $parse - The parser service.
 * @returns {import('angular').IDirective} The Angular directive.
 */
// @ts-ignore
window.fileModel = function fileModel($parse) {
  return {
    /**
     * Creates the link to the element.
     *
     * @param {import('angular').IScope} ascope - The Angular scope.
     * @param {JQLite} element - The target element.
     * @param {import('angular').IAttributes} attrs - The element attributes.
     */
    link(ascope, element, attrs) {
      /**
       * @typedef {FileModel.Scope & import('angular').IScope} Scope
       */
      const model = $parse(attrs.fileModel);
      const scope = /** @type {Scope} */ (ascope);
      element.bind('change', () => {
        let content = '';
        const file = /** @type {HTMLInputElement} */ (element[0]).files[0];
        scope.fileName = file.name;
        const reader = file.stream().getReader();
        /**
         * Processes a batch of bits from the uploaded file.
         *
         * @param {ReadableStreamDefaultReadResult<BufferSource>} param0 - The bit data.
         */
        function processBits({ done, value }) {
          if (done) {
            scope.$apply(() => {
              model.assign(scope, content);
            });
            return;
          }
          content += new TextDecoder().decode(value);
          reader.read().then(processBits);
        }
        reader.read().then(processBits);
      });
    },
    restrict: 'A',
  };
};
