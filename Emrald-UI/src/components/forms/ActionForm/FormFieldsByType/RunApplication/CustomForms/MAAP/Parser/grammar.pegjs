{
	function extractList(list, index) {
    	return list.map(i => i[index]);
    }
    function safeValue(value) {
    	return (value || [])[0] || [];
    }
}

Start = preamble:__ program:Program __ {
	program.value = preamble
    	.concat(program.value)
        // Filter out empty comment blocks
        .filter((e) => e.type !== 'comment' || e.value.length > 0);
	return program;
}

/* Lexical Grammar */
SourceCharacter = .
FreeCharacter = !LineTerminator SourceCharacter !Comment
WhiteSpace = "\t" / "\v" / "\f" / " " / "\u00A0" / "\uFEFF"
LineTerminator = [\n\r\u2028\u2029]
LineTerminatorSequence = "\n" / "\r\n" / "\r" / "\u2028" / "\u2029"
Comment = EnclosedComment / SingleLineComment
CommentIndicator = "//" / "!" / "C " / "**"
SingleLineComment = CommentIndicator v:FreeCharacter* {
	return {
    	type: "comment",
        value: extractList(v,1).join(''),
    }
}
EnclosedComment = "****" v:[^*]+ "****" {
	return {
    	type: "comment",
        value: v.join(''),
    }
}
IdentifierStart = [a-zA-Z] / "$" / "_" / "\\"
Literal = BooleanLiteral / NumericLiteral / TimerLiteral
Units = !(AND / OR) first:[a-zA-Z0-9]+ rest:(("**" / "/") Units)? {
	let units = first.join('');
    if (rest) {
    	units += rest[0] + rest[1];
    }
    return units;
}
NumericLiteral = negative:"-"? literal:DecimalLiteral !(IdentifierStart / DecimalDigit) units:(_ Units)? {
	return {
    	type: "number",
        units: (units || [])[1],
        value: negative !== null ? -literal : literal,
    }
}
DecimalLiteral = DecimalIntegerLiteral "." DecimalDigit* ExponentPart? {
	return parseFloat(text());
}
	/ "." DecimalDigit+ ExponentPart? {
    return parseFloat(text());
}
	/ DecimalIntegerLiteral ExponentPart? {
    return parseFloat(text());
}
DecimalIntegerLiteral = "0" / NonZeroDigit DecimalDigit*
DecimalDigit = [0-9]
NonZeroDigit = [1-9]
ExponentPart = ExponentIndicator SignedInteger
ExponentIndicator = "e"i
SignedInteger = [+-]? DecimalDigit+
BooleanLiteral = v:(TRUE / FALSE / T / F) ![a-zA-Z] {
	let value = v === 'TRUE' || v === 'T';
	return {
    	type: "boolean",
        value,
    }
}
Reserved = (END / IS / AS / AND / OR) ![a-zA-Z]
Identifier = !Reserved value:[a-zA-Z0-9_]+ {
	return {
    	type: "identifier",
        value: value.join(''),
    }
}
ParameterNameCharacter = [a-zA-Z0-9:()|]
ParameterName = !Reserved head:ParameterNameCharacter+ tail:(_ !Reserved ParameterNameCharacter+)+ {
	let value = head.join('');
    if (tail) {
    	value += ' ' + extractList(tail, 2).map((item) => item.join('')).join(' ');
    }
	return {
        type: "parameter_name",
        value,
    }
}
Parameter = index:[0-9]+ _ flag:(BooleanLiteral _)? value:(Expr / ParameterName) {
	return {
    	flag: (flag || [])[0],
        index: Number(index.join('')),
    	type: "parameter",
        value,
    }
}
TimerLiteral = TIMER _ "#"? n:[0-9]+ {
	return {
    	type: "timer",
        value: Number(n.join('')),
    }
}

ACTION = "ACTION"i
ALIAS = "ALIAS"i
AND = "AND"i
AS = "AS"i
DOSE_PARAMETER_FILE = "DOSE PARAMETER FILE"i
END = "END"i !" TIME"i
F = "F"i
FALSE = "FALSE"i
FUNCTION = "FUNCTION"i
INCLUDE = "INCLUDE"i
INITIATORS = "INITIATOR"i "S"i? {
	return "INITIATORS";
}
IF = "IF"i
IS = "IS"i
LOOKUP_VARIABLE = "LOOKUP VARIABLE"i
OFF = "OFF"i
ON = "ON"i
OR = "OR"i
PARAMETER_CHANGE = "PARAMETER CHANGE"i
PARAMETER_FILE = "PARAMETER FILE"i
PLOTFIL = "PLOTFIL"i
SENSITIVITY = "SENSITIVITY"i
SET = "SET"i
SI = "SI"i
T = "T"i
TIMER = "TIMER"
TITLE = "TITLE"i
TRUE = "TRUE"i
USEREVT = "USEREVT"i
WHEN = "WHEN"i

___ = v:(WhiteSpace / LineTerminatorSequence / Comment)+ {
	return v.filter((x) => x.type === "comment");
}
__ = v:(WhiteSpace / LineTerminatorSequence / Comment)* {
	return v.filter((x) => x.type === "comment");
}
_ = WhiteSpace*

/* Expressions */
Arguments = value:ExpressionType rest:(_ "," _ Arguments)? {
	let args = [value];
    if (rest) {
    	args = args.concat(rest[3]);
    }
	return args;
}
CallExpression = value:Identifier _ "(" args:Arguments? ")" {
	return {
    	arguments: args || [],
    	type: "call_expression",
        value,
    }
}
ExpressionOperator = "**" / "*" / "/" / ">=" / "<=" / ">" / "<" / "+" / "-" / "!=" / "=="
Expression = left:ExpressionType _ op:ExpressionOperator _ right:(Expression / ExpressionType) {
	return {
    	type: "expression",
        value: {
        	left,
            op,
            right,
        },
    }
}
ExpressionBlock = "(" value:Expression ")" _ units:Units? {
	return {
    	type: "expression_block",
        value,
        units,
    }
}
ExpressionType = CallExpression / ExpressionBlock / Variable
SpaceAssignment = target:(CallExpression / Identifier) WhiteSpace WhiteSpace+ value:Expr {
	return {
    	target,
    	type: "assignment",
        value,
    }
}
Assignment = target:(CallExpression / Identifier) _ "=" _ value:Expr {
	return {
    	target,
    	type: "assignment",
        value,
    }
}
IsExpression = target:Variable _ IS _ value:Expr {
	return {
    	target,
    	type: "is_expression",
        value,
    }
}
AsExpression = target:Variable _ AS _ value:Variable {
	return {
    	target,
    	type: "as_expression",
        value,
    }
}
MultiPartExpression = first:(Expression / IsExpression) ___ op:(AND / OR) ___ rest:Expr  {
	return {
    	type: "multi_expression",
        op,
        value: [first, rest]
    }
}
Expr = MultiPartExpression / IsExpression / Expression / ExpressionType
Variable = CallExpression / Literal / ParameterName / Identifier

/* Statements */
Statement = value:(SensitivityStatement
	/ TitleStatement
    / FileStatement
    / BlockStatement
    / ConditionalBlockStatement
    / AliasStatement
    / PlotFilStatement
    / UserEvtStatement
    / FunctionStatement
    / TimerStatement
    / LookupStatement) {
    return value
}
SensitivityStatement = SENSITIVITY ___ value:(ON / OFF) {
	return {
    	type: "sensitivity",
        value,
    }
}
TitleStatement = TITLE ___ value:(TitleBlock ___)? END {
	return {
    	type: "title",
        value: (value || [])[0],
    }
}
TitleBlock = !END first:FreeCharacter+ rest:(___ TitleBlock)? {
	let title = extractList(first, 1).join('');
    if (rest) {
    	title += '\n' + rest[1];
    }
	return title;
}
FileStatement = fileType:(PARAMETER_FILE / DOSE_PARAMETER_FILE / INCLUDE) _ v:FreeCharacter+ {
	return {
    	fileType,
    	type: "file",
        value: extractList(v, 1).join(''),
    }
}
BlockStatement = blockType:(PARAMETER_CHANGE / INITIATORS) ___ value:(SourceElements ___)? END {
	return {
    	blockType,
        type: "block",
        value: safeValue(value),
    }
}
ConditionalBlockStatement = blockType:(WHEN / IF) _ test:Expr ___ value:(SourceElements ___)? END {
	return {
    	blockType,
    	test,
    	type: "conditional_block",
        value: safeValue(value),
    }
}
AliasStatement = ALIAS ___ value:(AliasBody ___)? END {
	return {
    	type: "alias",
        value: safeValue(value),
    }
}
AliasBody = head:AsExpression tail:(___ AsExpression)* {
	return [head].concat(extractList(tail, 1));
}
PlotFilStatement = PLOTFIL _ n:[0-9]+ ___ value:(PlotFilBody ___)? END {
	return {
    	n: Number(n.join('')),
    	type: "plotfil",
        value: safeValue(value),
    }
}
PlotFilList = head:Variable tail:(_ "," _ PlotFilList)* {
	let value = [head];
    if (tail && tail.length > 0) {
    	value = value.concat(extractList(tail, 3)[0]);
    }
	return value;
}
PlotFilBody = head:PlotFilList tail:(___ PlotFilBody)* {
	let value = [head];
    if (tail && tail.length > 0) {
    	value = value.concat(extractList(tail, 1)[0]);
    }
	return value;
}
UserEvtStatement = USEREVT ___ value:(UserEvtBody ___)? END {
	return {
    	type: "user_evt",
        value: safeValue(value),
    }
}
UserEvtBody = head:UserEvtElement tail:(___ UserEvtElement)* {
	return [head].concat(extractList(tail, 1));
}
UserEvtElement = Parameter / ActionStatement / SourceElement
ActionStatement = ACTION _ "#" n:[0-9]+ ___ value:(UserEvtBody ___)? END {
	return {
    	index: Number(n.join('')),
    	type: "action",
        value: safeValue(value),
    }
}
FunctionStatement = FUNCTION _ name:Identifier _ "=" _ value:Expr {
	return {
    	name,
    	type: "function",
        value,
    }
}
TimerStatement = SET _ value:TimerLiteral {
	return {
    	type: "set_timer",
        value,
    }
}
LookupStatement = LOOKUP_VARIABLE _ name:Variable ___ value:(LookupBody ___)? END {
	return {
		name,
    	type: "lookup_variable",
        value: safeValue(value),
    }
}
LookupBody = !Reserved head:FreeCharacter+ tail:(___ LookupBody)* {
	let value = [extractList(head, 1).join('')];
    if (tail && tail.length > 0) {
    	value = value.concat(extractList(tail, 1)[0]);
    }
	return value;
}

/* Program blocks */
Program = value:SourceElements? {
	return {
    	type: "program",
        value: value || [],
    }
}
SourceElements = head:SourceElement tail:(___ SourceElement)* {
	let re = [head];
    for (let i = 0; i < tail.length; i += 1) {
    	for (let j = 0; j < tail[i][0].length; j += 1) {
        	re = re.concat(tail[i][0][j]);
        }
        re = re.concat(tail[i][1]);
    }
    return re;
}
SourceElement = Statement
	/ SpaceAssignment
	/ Assignment
	/ AsExpression
	/ IsExpression
	/ Expression
	/ CallExpression
	/ ExpressionBlock
	/ ParameterName
    / Literal
	/ Identifier