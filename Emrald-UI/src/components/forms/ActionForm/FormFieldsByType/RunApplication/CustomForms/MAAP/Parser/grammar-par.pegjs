start = index:[0-9]+ " "+ value:("T" / "F") " "+ num:[0-9]* " "* desc:.* {
	return {
    	desc: desc.join('').replace(/\s*$/, ''),
    	index: Number(index.join('')),
        value,
    }
}
