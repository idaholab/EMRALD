start = main:line*

comment = ("**" / "//") content:[^\n]* {
	return {
    	type: "comment",
        value: content.join(''),
    };
}

knownExpression = name:("SENSITIVITY" / "TITLE" / "PARAMETER FILE") " " content:[^\n]+ {
	return {
    	type: "expression",
        value: {
        	name,
            value: content.join(''),
        },
    };
}

varName = first:[a-zA-Z] rest:[a-zA-Z-0-9]+ {
	return first + rest.join('');
}

index = "(" value:[0-9]+ ")" {
	return Number(value.join(''));
}

number = start:[0-9]+ p:"."? rest:[0-9]* {
	let re = start.join('')
    if (p) {
    	re += ".";
    }
    if (rest) {
    	re += rest.join('');
    }
	return Number(re);
}

units = " "* start:[a-zA-Z\*0-9\^]+ rest:("/" units)? {
	var re = start.join('')
    if (rest) {
    	re += rest.join('')
    }
	return re
}

name = name:[A-Z ]+ {
	return name.join('');
}

value = (number units?) / name / varName

mathOperator = "/"

math = lhs:(number / varName) op:mathOperator rhs:(number / varName) {
	return {
    	type: "math",
        lhs,
        op,
        rhs,
    }
}

assignment = name:varName index:index? " "* "=" " "* value:(math / value) {
	return {
    	type: "assignment",
        value: {
        	index,
        	name,
            value,
        },
    };
}

asAssignment = name:varName index:index? " "* "AS" " "* value:value {
	return {
    	type: "as-assignment",
        value: {
        	index,
        	name,
            value,
        },
    };
}

section = name:("PARAMETER CHANGE" / "ALIAS" / "INITIATORS" / "USEREVT") " "* "\n" sectionContents:sectionLine* " "* "END" {
	return {
    	type: "section",
        value: {
        	name,
            value: sectionContents,
        },
    };
}

operator = ">=" / "<=" / ">" / "<"

condition = lhs:varName " "+ op:operator " "+ rhs:value {
	return {
    	type: "condition",
        lhs,
        op,
        rhs,
    };
}

conditionalSection = name:("WHEN") " "+ condition:condition "\n" sectionContents:sectionLine* " "* "END" {
	return {
    	type: "conditional-section",
        value: {
        	condition,
        	name,
            value: sectionContents,
        },
    };
}

sectionLineContent = assignment / asAssignment / comment

sectionLine = content:([ \t]+ sectionLineContent)? " "* comment:comment? "\n"+ {
	return {
    	type: "sectionItem",
        value: {
        	comment,
            value: content[1],
        },
    };
}

lineContent = comment / section / conditionalSection / knownExpression

line = " "* content:lineContent? " "* "\n"+ {
	return content;
}
