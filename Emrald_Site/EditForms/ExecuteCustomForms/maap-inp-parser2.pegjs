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

assignment = name:varName index:index? " "* "=" " "* value:[^\n]+ {
	return {
    	type: "assignment",
        value: {
        	index,
        	name,
            value: value.join(''),
        },
    };
}

section = name:("PARAMETER CHANGE") " "* "\n" sectionContents:sectionLine* "END" {
	return {
    	type: "section",
        value: {
        	name,
            value: sectionContents,
        },
    };
}

sectionLineContent = assignment / comment

sectionLine = indent:[ \t]+ content:sectionLineContent "\n"+ {
	return {
    	type: "sectionItem",
        value: {
        	indent: indent.length,
            value: content,
        },
    };
}

lineContent = section / knownExpression / comment

line = content:lineContent? "\n"+ {
	return content;
}
