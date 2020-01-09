export function printDir(title,info) {
    return (target,name,descriptor)=> {
        let oldValue = descriptor.value;
        descriptor.value = function() {
            console.info(`追踪: ${title}\n事件: ${info}${this.props.name}`);
            return oldValue.apply(this, arguments);
        };
    };
}

export function printArgs(title,info,index) {
    return (target,name,descriptor)=> {
        let oldValue = descriptor.value;
        descriptor.value = function() {
            console.info(`追踪: ${title}\n事件: ${info}${arguments[index?index:0]}`);
            return oldValue.apply(this, arguments);
        };
    };
}

export function develop(key) {
    if(process.env.NODE_ENV === 'development'){
        if(!!key.name){
            window[key.name] = key
        }
    }
}