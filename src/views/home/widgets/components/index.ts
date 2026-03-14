const resultComps: Record<string, any> = {};

const files = import.meta.glob('./*.vue', { import: 'default', eager: true });

for (const fileName of Object.keys(files)) {
	resultComps[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = files[fileName];
}

export default markRaw(resultComps);
