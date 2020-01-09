let Loading = null;
let LoadingAnimate = {
    insertLoading(){
        if(Loading){
            Loading();
        }else{
            console.warn('请设置loading')
        }
    },
    setLoading(func){
        if(typeof func === 'function'){
            Loading = func;
        }
    },
};
export default LoadingAnimate;