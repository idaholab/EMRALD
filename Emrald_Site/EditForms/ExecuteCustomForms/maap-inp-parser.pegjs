start = name:varname index:index? " "* "=" " "* value:value units:units? " "* .* {
	return {
    	index,
    	name,
        units,
        value,
    }
}

varname = name:[a-zA-Z]+ {
	return name.join('')
}

index = "(" index:[0-9]+ ")" {
	return Number(index.join(''))
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
