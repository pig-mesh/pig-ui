const resultComps = {};

const files = import.meta.glob('./*.vue', { import: 'default', eager: true });

Object.keys(files).forEach((fileName) => {
	if (fileName) {
		// @ts-ignore
		resultComps[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = files[fileName];
	}
});

export default markRaw(resultComps);
