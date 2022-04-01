start = name:variable " "* "=" " "* value:(number / variable) " "* .* {
	return {
    	name,
        value,
    }
}

variable = name:[a-zA-Z]+ index:index? {
	return {
    	index,
    	name: name.join(''),
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
