/**
 * @file ExternalExeForm class.
 */
 
 /**
  * @class ExternalExeForm
  * @classdesc Utilities for custom run application forms.
  */
class ExternalExeForm {
   /**
    * Constructs ExternalExeForm.
    *
    * @constructs
    */
   constructor() {
     const parentWindow = window.frameElement?.ownerDocument.defaultView;
     if (parentWindow === null || parentWindow === undefined) {
       throw new Error('Custom forms must be embedded in an action editor.');
     }
     this.parentWindow = parentWindow;
     this.parentScope = parentWindow.getScope();
   }
 
   getDataObject() {
     return {};
   }
 
   /**
    * Saves the data object in the parent frame.
    *
    * @name ExternalExeForm#save
    * @function
    */
   save() {
     this.parentWindow.postMessage({
       payload: this.getDataObject(),
       type: 'saveTemplate',
     });
   }

   /**
    * Binds the angular scope to the form.
    *
    * @name ExternalExeForm#bindScope
    * @function
    * @param {angular.IScope} $scope The angular scope.
    */
   bindScope($scope) {
     this.$scope = $scope;
     Object.keys($scope).forEach((key) => {
       if (key !== 'this' && !/^\$/.test(key)) {
         $scope.$watch(key, () => {
           this.save();
         });
       }
     });
   }
 }
 