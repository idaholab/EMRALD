start = conditions:(conditionGroup / conditional) ws arrow ws then:(boolean / sWPGroup / statementGroup / statement) ";" {
	return {
    	conditions,
        then,
    }
}

term = start:[a-zA-Z] rest:[a-zA-Z0-9_]* {
	return start + rest.join('')
}
number = v:[0-9\.]+ {
	return v.join('')
}
gt = "&gt;" / ">"
lt = "&lt;" / "<"
arrow = "-" gt
and = "&amp;" / "&"
ws = " "*
comparison = c:("=" / lt "=" / gt "=" / gt / lt / "!=") {
	if (typeof c == 'string') {
    	if (c == "&lt;") c = "<"
    	else if (c == "&gt;") c = ">"
        return c
    } else {
    	if (c[0] == "&lt;") c[0] = "<"
    	else if (c[0] == "&gt;") c[0] = ">"
        return c.join('')
    }
}
joiner = j:(and / "|") {
	if (j == '&amp;') j = '&'
    return j
}
operator = "+" / "-" / "*" / "/"
boolean = v:("true" / "false") {
	return v
}
arg = computed / term / number

variable = "\"+" name:term "+\"" {
	return {
    	variable: name,
    }
}

math = left:(number / variable) op:operator right:(math / number / variable) {
	return {
    	left,
        op,
        right,
    }
}

fn = fn:term "(" ws arg0:arg args:("," ws arg)* ws ")" {
	return {
    	fn,
        args: [arg0].concat(args.map((a) => a[2]))
    }
}

computed = name:term ws op:operator ws value:(term / number) {
	return {
    	name,
        op,
        value,
    }
}

conditional = boolean / name:term ws comparison:comparison ws value:(term / number) {
	return [{
    	name,
        value,
        comparison,
    }]
}

conditionalWrapper = "(" ws condition:conditional ws  ")" {
	return condition
}

conditionGroup = first:conditionalWrapper rest:(ws joiner ws conditionalWrapper)* {
	return first.concat(rest.map((s) => {return { ...s[3][0], op: s[1]}}))
}

statement = name:term "'" ws "=" ws value:(fn / computed / term / number) {
	return [{
    	name,
        value,
    }]
}

statementWrapper = "(" ws statement:statement ws  ")" {
	return statement
}

statementGroup = first:statementWrapper rest:(ws and ws statementWrapper)* {
	return [{
    	probability: "1",
        then: first.concat(rest.map((s) => { return s[3][0] })),
    }]
}

rawStatementGroup = first:statementWrapper rest:(ws and ws statementWrapper)* {
	return first.concat(rest.map((s) => { return s[3][0] }))
}

statementsWithProb = probability:(variable / math / number) ws ":" ws then:(rawStatementGroup / statement) {
	return {
    	probability,
        then,
    }
}

sWPGroup = first:statementsWithProb rest:(ws "+" ws statementsWithProb)* {
	return [first].concat(rest.map((s) => s[3]))
}
