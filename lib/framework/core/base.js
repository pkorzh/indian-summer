export let base = {
	idCounter: 0,
	uniqueId: (prefix) => {
		var id = ++base.idCounter + ''
		return prefix ? prefix + id : id
	}
}