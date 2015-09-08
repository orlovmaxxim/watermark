var onlyInteger = function(inp){
	var value = inp.val();
	inp.val(value.replace(/[^\d,]/g, ''));
	inp.value = value;
};