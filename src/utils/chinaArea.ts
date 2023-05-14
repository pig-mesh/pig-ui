import REGION_DATA from 'china-area-data';

interface ProvinceData {
	value: string;
	label: string;
	children?: Array<ProvinceData>;
}

// code转汉字大对象,例：CodeToText['110000']输出北京市
const CodeToText = {};
// 汉字转code大对象,例：TextToCode['北京市']['市辖区']['朝阳区'].code输出110105
const TextToCode = {};
// 省份对象
const provinceObject = REGION_DATA['86'];
// 省市区三级联动数据（不带“全部”选项）
const regionData: {
	value: string; // 省份code值
	label: any;
}[] = [];
// 省市二级联动数据（不带“全部”选项）
let provinceAndCityData = [] as any;

const ALL_TEXT = '*';

CodeToText[''] = ALL_TEXT;

// 计算省
Object.keys(provinceObject).forEach((prop) => {
	const provinceText = provinceObject[prop];
	regionData.push({
		value: prop, // 省份code值
		label: provinceText, // 省份汉字
	});
	CodeToText[prop] = provinceText;
	TextToCode[provinceText] = {
		code: prop,
	};
	TextToCode[provinceText][ALL_TEXT] = {
		code: '',
	};
});

// 计算市
regionData.forEach((item: ProvinceData) => {
	const provinceCode = item.value;
	const provinceText = item.label;
	const provinceChildren: { value: string; label: any }[] | undefined = [];
	const provinceData = REGION_DATA[provinceCode] ?? {};

	Object.keys(provinceData).forEach((prop) => {
		provinceChildren.push({
			value: prop,
			label: provinceData[prop],
		});
		CodeToText[prop] = provinceData[prop];
		TextToCode[provinceText][provinceData[prop]] = {
			code: prop,
		};
		TextToCode[provinceText][provinceData[prop]][ALL_TEXT] = {
			code: '',
		};
	});

	if (provinceChildren.length) {
		item.children = provinceChildren;
	}
});
provinceAndCityData = cloneDeep(regionData);

// 计算区
regionData.forEach((item: ProvinceData) => {
	const province = item.children;
	const provinceText = item.label;

	if (province) {
		province.forEach((pItem) => {
			const cityCode = pItem.value;
			const cityText = pItem.label;
			const cityChildren: { value: string; label: any }[] | undefined = [];
			const cityData = REGION_DATA[cityCode] ?? {};

			Object.keys(cityData).forEach((prop) => {
				cityChildren.push({
					value: prop,
					label: cityData[prop],
				});
				CodeToText[prop] = cityData[prop];
				TextToCode[provinceText][cityText][cityData[prop]] = {
					code: prop,
				};
			});

			if (cityChildren.length) {
				pItem.children = cityChildren;
			}
		});
	}
});

// 添加“全部”选项
const provinceAndCityDataPlus = cloneDeep(provinceAndCityData);
provinceAndCityDataPlus.unshift({
	value: '',
	label: ALL_TEXT,
});
provinceAndCityDataPlus.forEach((item: ProvinceData) => {
	const province = item.children;

	if (province?.length) {
		province.unshift({
			value: '',
			label: ALL_TEXT,
		});

		province.forEach((pItem) => {
			const city = pItem.children;

			if (city?.length) {
				city.unshift({
					value: '',
					label: ALL_TEXT,
				});
			}
		});
	}
});

const regionDataPlus = cloneDeep(regionData);
regionDataPlus.unshift({
	value: '',
	label: ALL_TEXT,
});
regionDataPlus.forEach((item: ProvinceData) => {
	const province = item.children;

	if (province?.length) {
		province.unshift({
			value: '',
			label: ALL_TEXT,
		});
		province.forEach((pItem) => {
			const city = pItem.children;

			if (city?.length) {
				city.unshift({
					value: '',
					label: ALL_TEXT,
				});
			}
		});
	}
});

/**
 * 汉字转区域码
 * @param provinceText 省
 * @param cityText 市
 * @param regionText 区
 * @returns
 */
function convertTextToCode(provinceText: string, cityText: string, regionText?: string): string {
	let code = '';
	if (provinceText && TextToCode[provinceText]) {
		const province = TextToCode[provinceText];
		code = province.code;

		if (cityText && province[cityText]) {
			const city = province[cityText];
			code = `${code}${cityText === ALL_TEXT ? '' : ', '}${city.code}`;

			if (regionText && city[regionText]) {
				code = `${code}${regionText === ALL_TEXT ? '' : ', '}${city[regionText].code}`;
			}
		}
	}
	return code;
}

/**
 * 对象深拷贝
 * @param {T} source - 要拷贝的对象
 * @return {T} 拷贝后的对象
 */
function cloneDeep<T>(source: T): T {
	if (typeof source !== 'object') {
		return source;
	}

	if (source instanceof Date) {
		return new Date(source.getTime()) as any;
	}

	if (source instanceof Array) {
		const cloneArr: any[] = [];
		for (let i = 0; i < source.length; ++i) {
			cloneArr[i] = cloneDeep(source[i]);
		}
		return cloneArr as any;
	}

	if (source instanceof Object) {
		const cloneObj = {};
		for (const key in source) {
			if (source.hasOwnProperty(key)) {
				cloneObj[key] = cloneDeep(source[key]);
			}
		}
		return cloneObj as any;
	}
}
export { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode, convertTextToCode };
