const gets = {} as any;
const modules = import.meta.glob('../../*.vue', { eager: true });

async function processModules() {
	for (let each in modules) {
		const module = await modules[each];
		const name = module.default.__name;
		gets[name] = module.default;
	}
}

processModules();

export default gets;
