/* global d3, sankeyTimeline */

const timeline = new sankeyTimeline.SankeyTimeline();
const renderer = new sankeyTimeline.Renderer(timeline);
renderer.options.height = 1085;
renderer.options.width = 1360;
renderer.options.margin = 100;
renderer.options.maxNodeHeight = 38;
renderer.options.maxLinkWidth = 5;
renderer.options.layout = 1;
renderer.options.fontSize = 18;
renderer.options.fadeOpacity = 0.1;

timeline.createNode('Program', {
  endTime: 1,
  startTime: 0,
});

timeline.createNode('SourceElement', {
  endTime: 2,
  startTime: 1,
});

timeline.createLink('Program', 'SourceElement', 1);

timeline.createNode('Statement', {
  endTime: 3,
  startTime: 2,
});

timeline.createLink('SourceElement', 'Statement', 1);

timeline.createNode('Assignment', {
  endTime: 3,
  startTime: 2,
});

timeline.createLink('SourceElement', 'Assignment', 1);

timeline.createNode('AsExpression', {
  endTime: 3,
  startTime: 2,
});

timeline.createLink('SourceElement', 'AsExpression', 1);

timeline.createNode('IsExpression', {
  endTime: 3,
  startTime: 2,
});

timeline.createLink('SourceElement', 'IsExpression', 1);

timeline.createNode('Expression', {
  endTime: 3,
  startTime: 2,
});

timeline.createLink('SourceElement', 'Expression', 1);

timeline.createNode('CallExpression', {
  endTime: 3,
  startTime: 2,
});

timeline.createLink('SourceElement', 'CallExpression', 1);

timeline.createNode('ExpressionBlock', {
  endTime: 3,
  startTime: 2,
});

timeline.createLink('SourceElement', 'ExpressionBlock', 1);

timeline.createNode('ParameterName', {
  endTime: 3,
  startTime: 2,
});

timeline.createLink('SourceElement', 'ParameterName', 1);

timeline.createNode('Literal', {
  endTime: 3,
  startTime: 2,
});

timeline.createLink('SourceElement', 'Literal', 1);

timeline.createNode('Identifier', {
  endTime: 3,
  startTime: 2,
});

timeline.createLink('SourceElement', 'Identifier', 1);

timeline.createNode('SensitivityStatement', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Statement', 'SensitivityStatement', 1);

timeline.createNode('TitleStatement', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Statement', 'TitleStatement', 1);

timeline.createNode('FileStatement', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Statement', 'FileStatement', 1);

timeline.createNode('BlockStatement', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Statement', 'BlockStatement', 1);

timeline.createNode('ConditionalBlockStatement', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Statement', 'ConditionalBlockStatement', 1);

timeline.createNode('AliasStatement', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Statement', 'AliasStatement', 1);

timeline.createNode('PlotFilStatement', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Statement', 'PlotFilStatement', 1);

timeline.createNode('UserEvtStatement', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Statement', 'UserEvtStatement', 1);

timeline.createNode('FunctionStatement', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Statement', 'FunctionStatement', 1);

timeline.createNode('TimerStatement', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Statement', 'TimerStatement', 1);

timeline.createNode('LookupStatement', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Statement', 'LookupStatement', 1);

timeline.createLink('Assignment', 'CallExpression', 1);

timeline.createLink('Assignment', 'Identifier', 1);

timeline.createLink('Assignment', 'Expression', 1);

timeline.createNode('Variable', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('AsExpression', 'Variable', 1);

timeline.createLink('AsExpression', 'Identifier', 1);

timeline.createLink('IsExpression', 'Variable', 1);

timeline.createLink('IsExpression', 'Expression', 1);

timeline.createLink('Expression', 'IsExpression', 1);

timeline.createNode('PureExpression', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Expression', 'PureExpression', 1);

timeline.createNode('ExpressionType', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Expression', 'ExpressionType', 1);

timeline.createNode('Arguments', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('CallExpression', 'Arguments', 1);

timeline.createLink('CallExpression', 'Identifier', 1);

timeline.createLink('ExpressionBlock', 'PureExpression', 1);

timeline.createNode('BooleanLiteral', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Literal', 'BooleanLiteral', 1);

timeline.createNode('NumericLiteral', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Literal', 'NumericLiteral', 1);

timeline.createNode('TimerLiteral', {
  endTime: 4,
  startTime: 3,
});

timeline.createLink('Literal', 'TimerLiteral', 1);

timeline.createLink('BlockStatement', 'SourceElement', 1);

timeline.createLink('ConditionalBlockStatement', 'Expression', 1);

timeline.createLink('ConditionalBlockStatement', 'SourceElement', 1);

timeline.createLink('AliasStatement', 'AsExpression', 1);

timeline.createLink('PlotFilStatement', 'Variable', 1);

timeline.createNode('UserEvtElement', {
  endTime: 5,
  startTime: 4,
});

timeline.createLink('UserEvtStatement', 'UserEvtElement', 1);

timeline.createLink('FunctionStatement', 'Identifier', 1);

timeline.createLink('FunctionStatement', 'Expression', 1);

timeline.createLink('TimerStatement', 'TimerLiteral', 1);

timeline.createLink('LookupStatement', 'Variable', 1);

timeline.createLink('Variable', 'CallExpression', 1);

timeline.createLink('Variable', 'Literal', 1);

timeline.createLink('Variable', 'ParameterName', 1);

timeline.createLink('Variable', 'Identifier', 1);

timeline.createLink('PureExpression', 'ExpressionType', 1);

timeline.createLink('PureExpression', 'PureExpression', 1);

timeline.createLink('PureExpression', 'ExpressionType', 1);

timeline.createLink('ExpressionType', 'CallExpression', 1);

timeline.createLink('ExpressionType', 'ExpressionBlock', 1);

timeline.createLink('ExpressionType', 'Variable', 1);

timeline.createLink('Arguments', 'ExpressionType', 1);

timeline.createNode('Parameter', {
  endTime: 6,
  startTime: 5,
});

timeline.createLink('UserEvtElement', 'Parameter', 1);

timeline.createNode('ActionStatement', {
  endTime: 6,
  startTime: 5,
});

timeline.createLink('UserEvtElement', 'ActionStatement', 1);

timeline.createLink('UserEvtElement', 'SourceElement', 1);

timeline.createLink('Parameter', 'BooleanLiteral', 1);

timeline.createLink('Parameter', 'Expression', 1);

timeline.createLink('Parameter', 'ParameterName', 1);

timeline.createLink('ActionStatement', 'UserEvtElement', 1);

const svg = d3.select('svg');
renderer.render(svg);
