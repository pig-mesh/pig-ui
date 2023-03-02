import { ElMessage } from "element-plus";
import other  from "../utils/other";

export interface BasicTableProps {
    // 是否在创建页面时，调用数据列表接口
    createdIsNeed?: boolean
    // 是否需要分页
    isPage?: boolean
    // 查询条件
    queryForm?: any
    // 数据列表
    dataList?: any[]
    // 分页属性
    pagination?: Pagination,
    // 数据列表，loading状态
    dataListLoading?: boolean
    // 数据列表，多选项
    dataListSelections?: any[]
    // 接口api
    pageList?: (...arg: any) => Promise<any>
    // loading
    loading?: Boolean

    selectObjs?: any[]

    descs?: string[]

    ascs?: string[]

    props?: any
}

export interface Pagination {
    // 当前页码
    current?: number
    // 每页数
    size?: number
    // 总条数
    total?: number

    pageSizes?: any[]

    layout?: String
}


export function useTable(options?: BasicTableProps) {
    const defaultOptions: BasicTableProps = {
        dataListLoading: false,
        createdIsNeed: true,
        isPage: true,
        queryForm: {},
        dataList: [],
        pagination: {
            current: 1,
            size: 10,
            total: 0,
            pageSizes: [1, 10, 20, 50, 100, 200],
            layout: "total, sizes, prev, pager, next, jumper"
        } as Pagination,
        dataListSelections: [],
        loading: false,
        selectObjs: [],
        descs: [],
        ascs: [],
        props: {
            item: 'records',
            totalCount: 'total'
        }
    }

    const mergeDefaultOptions = (options: any, props: any): BasicTableProps => {
        for (const key in options) {
            if (!Object.getOwnPropertyDescriptor(props, key)) {
                props[key] = options[key]
            }
        }
        return props
    }

    // 覆盖默认值
    const state = mergeDefaultOptions(defaultOptions,options)


    const query = () => {
        if (state.pageList) {
            state.loading = true
            state.pageList({
                ...state.queryForm,
                current: state.pagination?.current,
                size: state.pagination?.size,
                descs: state.descs,
                ascs: state.ascs
            }).then((res: any) => {
                state.dataList = state.isPage ? res.data[state.props.item] : res.data
                state.pagination!.total = state.isPage ? res.data[state.props.totalCount] : 0
            }).catch((err: any) => {
                ElMessage.error(err.data.msg)
            }).finally(() => {
                state.loading = false;
            })
        }
    }


    onMounted(() => {
        if (state.createdIsNeed) {
            query()
        }
    })

    // 分页改变
    const sizeChangeHandle = (val: number) => {
        state.pagination!.size = val;
        query();
    };
    // 分页改变
    const currentChangeHandle = (val: number) => {
        state.pagination!.current = val;
        query();
    };

    // 排序触发事件
    const sortChangeHandle = (column: any) => {
        const prop = other.toUnderline(column.prop);
        if (column.order === 'descending') {
            state.descs?.push(prop)
            if(state.ascs!.indexOf(prop) >=0){
                state.ascs?.splice(state.ascs.indexOf(prop), 1)
            }
        }else if (column.order === 'ascending') {
            state.ascs?.push(prop)
            if(state.descs!.indexOf(prop) >=0){
                state.descs?.splice(state.descs.indexOf(prop), 1)
            }
        }else{
            if(state.ascs!.indexOf(prop) >=0){
                state.ascs?.splice(state.ascs.indexOf(prop), 1)
            }
            if(state.descs!.indexOf(prop) >=0){
                state.descs?.splice(state.descs.indexOf(prop), 1)
            }
        }
        query();
    }

    const getDataList = (refresh: boolean = true) => {
        if(refresh){
            state.pagination!.current = 1
        }
        query()
    }

    //  下载文件
    const downBlobFile = (url: string, query: any, fileName: string) => {
        return other.downBlobFile(url, query, fileName)
    }


    return {
        getDataList,
        sizeChangeHandle,
        currentChangeHandle,
        sortChangeHandle,
        downBlobFile
    }

}
