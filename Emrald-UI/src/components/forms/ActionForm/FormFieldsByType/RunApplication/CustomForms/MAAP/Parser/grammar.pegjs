Start = __ preamble:(CommentBlock __)? value:SourceElements epilogue:(___ Comment)* __ {
    return {
    	type: "program",
        value,
        comments: [preamble ? preamble[0] : [], epilogue.map(e => e[1])]
	}
}

/* Common character types and literals */
FreeCharacter = !LineTerminator !CommentIndicator c:. { return c }
WhiteSpace = "\t" / "\v" / "\f" / " " / "\u00A0" / "\uFEFF"
LineTerminator = [\n\r\u2028\u2029]
LineTerminatorSequence = "\n" / "\r\n" / "\r" / "\u2028" / "\u2029"
Comment = CommentIndicator _ value:(!LineTerminator .)* {
	return value.map(v => v[1]).join('');
}
CommentIndicator = "//" / "!" / "C " / "**"
IdentifierStart = [a-zA-Z] / "$" / "_" / "\\"
Literal = BooleanLiteral / NumericLiteral / TimerLiteral
Units = !(AND / OR) first:[a-zA-Z0-9]+ rest:(("**" / "/") Units)? {
    return first.join('') + (rest ? rest[0] + rest[1] : '');
}
NumericLiteral = negative:"-"? literal:DecimalLiteral !(IdentifierStart / [0-9]) units:(_ Units)? {
	return {
    	type: "number",
        units: (units || [])[1],
        value: negative !== null ? -literal : literal,
    }
}
DecimalLiteral = DecimalIntegerLiteral "." [0-9]* ExponentPart? {
	return parseFloat(text());
}
	/ "." [0-9]+ ExponentPart? {
    return parseFloat(text());
}
	/ DecimalIntegerLiteral ExponentPart? {
    return parseFloat(text());
}
DecimalIntegerLiteral = "0" / [1-9] [0-9]*
ExponentPart = ExponentIndicator SignedInteger
ExponentIndicator = "e"i
SignedInteger = [+-]? [0-9]+
BooleanLiteral = v:(TRUE / FALSE / T / F) ![a-zA-Z] {
	return { type: "boolean", value: v === 'TRUE' || v === 'T' }
}
Reserved = (END / IS / AS / AND / OR) ![a-zA-Z]
Identifier = !Reserved value:[a-zA-Z0-9_]+ {
	return { type: "identifier", value: value.join('') }
}
ParameterName = !Reserved head:[a-zA-Z0-9:()|]+ tail:(_ !Reserved [a-zA-Z0-9:()|]+)+ {
	let value = head.join('');
    if (tail) {
    	value += ' ' + tail.map((item) => item[2].join('')).join(' ');
    }
	return {
        type: "parameter_name",
        value,
    }
}
Parameter = index:[0-9]+ _ flag:(BooleanLiteral _)? value:ParameterName {
	return {
    	flag: (flag || [])[0],
        index: Number(index.join('')),
    	type: "parameter",
        value,
    }
}
TimerLiteral = TIMER _ "#"? n:[0-9]+ {
	return { type: "timer", value: Number(n.join('')) }
}

// Case-insensitive declarations of words
ACTION = "ACTION"i
ALIAS = "ALIAS"i
AND = "AND"i
AS = "AS"i
DOSE_PARAMETER_FILE = "DOSE PARAMETER FILE"i
END = "END"i
END_TIME = "END TIME"i
F = "F"i
FALSE = "FALSE"i
FUNCTION = "FUNCTION"i
IF = "IF"i
INCLUDE = "INCLUDE"i
INITIATORS = "INITIATOR"i "S"i? {
	return "INITIATORS";
}
IS = "IS"i
LOOKUP_VARIABLE = "LOOKUP VARIABLE"i
OFF = "OFF"i
ON = "ON"i
OR = "OR"i
PARAMETER_CHANGE = "PARAMETER CHANGE"i
PARAMETER_FILE = "PARAMETER FILE"i
PLOTFIL = "PLOTFIL"i
SENSITIVITY = "SENSITIVITY"i
SET = "SET"i;
T = "T"i
TIMER = "TIMER"i
TITLE = "TITLE"i
TRUE = "TRUE"i
USEREVT = "USEREVT"i
WHEN = "WHEN"i

___ = v:(WhiteSpace / LineTerminatorSequence)+ {
	return v.filter((x) => x.type === "comment");
}
__ = v:(WhiteSpace / LineTerminatorSequence)* {
	return v.filter((x) => x.type === "comment");
}
_ = WhiteSpace*

/* Expressions */
Arguments = value:ExpressionType rest:(_ "," _ Arguments)? {
	return [value].concat(rest ? rest[3] : []);
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
        left,
        op,
        right,
    }
}
ExpressionBlock = "(" value:Expr ")" _ units:Units? {
	return {
    	type: "expression_block",
        value,
        units: units ?? undefined,
    }
}
ExpressionType = CallExpression / ExpressionBlock / Variable
Assignment = target:(CallExpression / Identifier) _ "=" _ value:Expr {
	return {
    	target,
    	type: "assignment",
        value,
    }
}
IsExpression = target:(Variable / END_TIME) _ IS _ value:Expr {
	return {
    	target: target === 'END TIME' ? {
        	type: 'parameter_name',
            value: 'END TIME',
        } : target,
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
MultiPartExpression = first:(Expression / IsExpression / ExpressionBlock) comment:(_ CommentBlock)? __ op:(AND / OR) _ rest:Expr  {
	return {
    	type: "multi_expression",
        op,
        value: [first, rest],
        comments: comment ? comment[1] : [],
    }
}
Expr = MultiPartExpression / IsExpression / Expression / ExpressionType
Variable = CallExpression / Literal / ParameterName / Identifier

/* Statements */
SensitivityStatement = SENSITIVITY _ value:(ON / OFF) {
	return { type: "sensitivity", value }
}
TitleStatement = TITLE _ comment:Comment? __ value:(TitleBlock ___)* epilogue:(CommentBlock ___)? END {
	let innerComments = [];
    if (value) {
    	innerComments = value.map(v => v[0].comments)[0] ?? [];
    }
    return {
    	type: "title",
        value: value.map(v => v[0].title).join('\n'),
        comment: [[comment, ...innerComments], epilogue ? [...epilogue[0]] : []],
    }
}
TitleBlock = preamble:(CommentBlock ___)? !END title:FreeCharacter+ epilogue:Comment? {
	let comments = [];
    if (preamble) {
    	comments = comments.concat(preamble[0]);
    }
    if (epilogue) {
    	comments.push(epilogue);
    }
	return { title: title.join(''), comments }
}
FileStatement = fileType:(PARAMETER_FILE / DOSE_PARAMETER_FILE / INCLUDE) _ value:FreeCharacter+ {
	return {
    	fileType,
        type: 'file',
        value: value.join('')
    }
}
BlockStatement = blockType:(PARAMETER_CHANGE / INITIATORS) _ comment:Comment? value:(___ SourceElements)? epilogue:(___ CommentBlock)? ___ END {
	return {
    	blockType,
        type: "block",
        value: value ? value[1] : [],
        comment: [[comment], epilogue ? epilogue[1] : []]
    }
}
ConditionalBlockStatement = blockType:(WHEN / IF) _ test:Expr comment:(_ Comment)? value:(___ SourceElements)? epilogue:(___ CommentBlock)? ___  END {
	return {
    	blockType,
    	test,
    	type: "conditional_block",
        value: value ? value[1] : [],
        comment: [comment ? [comment[1]] : [], epilogue ? epilogue[1] : []],
    }
}
AliasStatement = ALIAS _ comment1:Comment? ___ value:(SourceElements ___)? comment2:(CommentBlock ___)? END {
    return {
    	type: "alias",
        value: value ? value[0] : [],
        comment: [[comment1], comment2 ? comment2[0] : []],
    }
}
PlotFilStatement = PLOTFIL _ n:[0-9]+ comment1:(_ Comment)? value:(___ PlotFilBody)* comment2:(__ CommentBlock)? ___ END {
    return {
    	n: Number(n.join('')),
    	type: "plotfil",
        value: value.length > 0 ? value.map(v => v[1])[0] : [],
        comment: [comment1 ? [comment1[1]] : [], comment2 ? [...comment2[1]] : []],
    }
}
PlotFilList = head:Variable tail:(_ "," _ PlotFilList)* {
	return tail.length > 0 ? [head].concat(tail.map(t => t[3])[0]) : [head];
}
PlotFilBody = preamble:(CommentBlock ___)? head:PlotFilList epilogue:(_ Comment)? tail:(___ PlotFilBody)* {
	let comments = [];
    if (preamble) {
    	comments = comments.concat(preamble[0]);
    }
    if (epilogue) {
    	comments.push(epilogue[1]);
    }
    return [{
    	row: head,
        comments,
    }].concat(tail.length > 0 ? tail.map(t => t[1])[0] : []);
}
UserEvtStatement = USEREVT comment1:(_ Comment)? ___ value:(SourceElements ___)? comment2:(CommentBlock ___)? END {
    return {
    	type: "user_evt",
        value: value ? value[0] : [],
        comment: [comment1 ? [comment1[1]] : [], comment2 ? comment2[0] : []],
    }
}
ActionStatement = ACTION _ "#" n:[0-9]+ comment1:(_ Comment)? ___ value:(SourceElements ___)? comment2:(CommentBlock ___)? END {
    return {
    	index: Number(n.join('')),
    	type: "action",
        value: value ? value[0] : [],
        comment: [comment1 ? [comment1[1]] : [], comment2 ? comment2[0] : []],
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
LookupStatement = LOOKUP_VARIABLE _ name:Variable comment:(_ Comment)? value:(___ LookupBody)? ___ END {
	return {
		name,
    	type: "lookup_variable",
        value: value ? value[1] : [],
        comment: [comment ? [comment[1]] : [], []],
    }
}
LookupBody = !Reserved head:FreeCharacter+ tail:(___ LookupBody)? {
	return [head.join('')].concat(tail ? tail[1] : []);
}

CommentBlock = first:Comment rest:(___ CommentBlock)? {
	return [first].concat(rest ? rest[1] : []);
}

SourceElements = preamble:(CommentBlock ___)? element:SourceElement _ epilogue:Comment? next:(___ SourceElements)? {
	let comments = [[], []];
    if (preamble) {
    	comments[0] = comments[0].concat(preamble[0]);
    }
    if (element.comment) {
    	if (Array.isArray(element.comment)) {
        	comments[0] = comments[0].concat(element.comment[0].filter(c => c != null));
            comments[1] = comments[1].concat(element.comment[1].filter(c => c != null));
        } else {
    		comments.push(element.comment);
        }
    }
    delete element.comment;
    if (epilogue) {
    	comments[1].push(epilogue);
    }
    return [{ ...element, comments }].concat(next ? next[1] : []);
}

SourceElement =
	SensitivityStatement
    / TitleStatement
    / FileStatement
    / BlockStatement
    / Assignment
    / TimerStatement
    / ConditionalBlockStatement
    / AsExpression
    / AliasStatement
    / PlotFilStatement
    / UserEvtStatement
    / ActionStatement
    / FunctionStatement
    / Expression
    / IsExpression
    / LookupStatement
    / Parameter
    / Literal
    / CallExpression
    / ParameterName
    / Identifier