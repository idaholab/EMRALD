start = name:variable " "* "=" " "* value:(number / variable) " "* .* {
	return {
    	name,
        value,
    }
}

variable = firstChar:[a-zA-Z] rest:[a-zA-Z0-9]+ index:index? {
	return {
    	index,
    	name: firstChar + rest.join(''),
        type: "variable",
    }
}

index = "(" index:[0-9]+ ")" {
	return Number(index.join(''))
}

number = value:value units:units? {
	return {
    	type: "number",
    	units,
        value,
    }
}

value = start:[0-9]+ rest:("." [0-9]+)? {
	var re = start.join('')
    if (rest) {
    	re += "." + rest[1].join('')
    }
	return Number(re)
}

units = " "* start:[a-zA-Z\*0-9\^]+ rest:("/" units)? {
	var re = start.join('')
    if (rest) {
    	re += rest.join('')
    }
	return re
}
