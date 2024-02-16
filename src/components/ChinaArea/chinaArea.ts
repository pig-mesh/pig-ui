import allAreas from './pca-code.json'

interface Area {
    code: string;
    name: string;
    children?: Area[];
}

function getNameByCode(data: Area[], code: string): string | null {
    for (const item of data) {
        if (item.code === code) {
            return item.name;
        }
        if (item.children) {
            const result = getNameByCode(item.children, code);
            if (result) {
                return result;
            }
        }
    }
    return null;
}

/**
 * 获取地区名称
 * @param inputCode  110101
 *
 * 110101 东城区
 * 11,1101,110101 北京市/市辖区/东城区
 */
function CodeToText(inputCode: string): string | null {
    const codes = inputCode.split(",");
    let outputName = "";
    for (const code of codes) {
        const name = getNameByCode(allAreas, code);
        if (name) {
            outputName += name + "/";
        }
    }
    outputName = outputName.slice(0, -1); // 移除末尾的斜杠
    return outputName
}


export {CodeToText};
