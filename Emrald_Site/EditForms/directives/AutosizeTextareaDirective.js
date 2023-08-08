angular.module('autosizeTextareaDirective', []).directive('autoResize', () => ({
  restrict: 'A', // This directive is used as an attribute

  link: (scope, element) => {
    // Function to adjust the textarea's height based on content
    const adjustTextareaHeight = () => {
      // Reset the height to auto to get the correct scrollHeight
      element[0].style.height = 'auto';
      // Set the height to the calculated scrollHeight
      element[0].style.height = `${element[0].scrollHeight}px`;
    };

    // Watch for changes in the textarea content and adjust its height
    element.on('input', () => {
      adjustTextareaHeight();
    });

    // Call the function initially to set the correct height when the page loads
    adjustTextareaHeight();
  },
}));
