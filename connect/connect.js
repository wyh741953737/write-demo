function strictEqual(a,b) {
    return  a === b;
}

function match(arg, factories, name) {
    for(let i = factories.length-1; i>=0; i--) {
        const result = factories[i](arg);
        if(result) return result;
    }
    return (dispatch, options) => {
        throw new  Error('连接组件XXX时，参数的类型字符串值无效')
    }
}

export function createConnect({
    connectHOC = connectAdvanced,
    mapStateToPropsFactories = defaultMapStateToPropsFactories,
    mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
    mergePropsFactories = defaultMergePropsFactories,
    selectorFactory = defaultSelectorFactories
} = {}) {
    return function connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps,
        {
            pure = true,
            areStateEqual = strictEqual,
            areOwnPropsEqual = shallowEqual,
            areStatePropsEqual = shallowEqual,
            areMergePropsEqual = shallowEqual,
            ...extraOptions
        } = {}
    ) {
        const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps')
        const initMapDispatchToProps = match( mapDispatchToProps, mapDispatchToPropsFactories,  'mapDispatchToProps')

        const initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps')
        return connectHOC(selectorFactory, {
            methodName: 'connect',
            getDisplayName: (name) => `Connect(${name})`,
            shouldHandleStateChanges: Boolean(mapStateToProps),
            initMapStateToProps,
            initMapDispatchToProps,
            initMergeProps,
            pure,
            areStateEqual,
            areOwnPropsEqual,
            areStatePropsEqual,
            areMergePropsEqual,
            ...extraOptions
        })
    }
}

export default createConnect();