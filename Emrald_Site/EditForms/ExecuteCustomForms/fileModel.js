fileModel = function ($parse) {
    return {
        restrict: 'A',
        link(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            element.bind('change', () => {
                var content = '';
                scope.fileName = element[0].files[0].name;
                var reader = element[0].files[0].stream().getReader();
                var processBits = ({ done, value }) => {
                    if (done) {
                        scope.$apply(() => {
                            model.assign(scope, content);
                        });
                        return;
                    }
                    content += new TextDecoder().decode(value);
                    return reader.read().then(processBits);
                };
                reader.read().then(processBits);
            });
        },
    };
}