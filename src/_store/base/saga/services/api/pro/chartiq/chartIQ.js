
let jsonList = null;
export function JsonListMerge(address) {
    jsonList = address;
}
const ChartIQ = {
    stxx:null,
    contract:null,
    initial:false,
    timeUnit:null,
    interval:null,
    period:null,
    type:'slice',
    domName:null,
    /**
     * @param {*}  options
     * 初始化行情图
     * 
     * 添加tradeVolume属性{upVolume,downVolume,upBorder,downBorder}
     * 参数则是对应属性的颜色
     * 
     * 添加info属性(open,close,high,low)
     * 参数测试dom的id 例#open
     */
    init(options){
        if (!options.domName)
            return console.error('缺少chart容器ID');

        if (!options.contract)
            return console.error('缺少初始商品ID');

        if (!options.contracts)
            return console.error('缺少合约对象');

        
        
        this.contract = options.contract;
        
        
        let dom = document.querySelector(options.domName);
        this.domName = options.domName;
        if (this.stxx === null) {
            this.stxx=new window.CIQ.ChartEngine({
                container:dom,
                preferences: {
                    "currentPriceLine": true,
                    "whitespace": 0,
                    candleWidth: 30,
                },
                layout:{
                    "crosshair": true,
                    chartType:options.chartType || 'mountain'
                },

            });
        }
            //使用feed文件获取数据
        window.quoteFeedSimulator.initial(jsonList);
        this.stxx.attachQuoteFeed(window.quoteFeedSimulator, { refreshInterval: 1 });
        // debugger;
        this.timeUnit = options.timeUnit || 'minute';
        this.interval = options.interval || 1;
        this.period = options.interval || 1

        this.stxx.crosshairYOffset = 0;
        this.stxx.crosshairXOffset = 0;

        //需要设置这个为false时，最小点差才会有效果
        this.stxx.chart.yAxis.pretty = false;

        //添加这个后 天然气商品的价格就没有重复了...
        // let priceChange = options.contracts._totalMap[this.contract].priceChange;
        // this.stxx.chart.yAxis.minimumPriceTick=priceChange;

        this.stxx.newChart(

            this.contract, 
            null,
            null,
            ()=>{
                if (!!this.stxx&&!!options.tradeVolume) {
                    window.CIQ.Studies.addStudy(
                        this.stxx, 
                        "vol undr", 
                        {}, 
                        {
                            "Up Volume": options.tradeVolume.upVolume || "red",
                            "Down Volume": options.tradeVolume.downVolume || "green",
                            "Up Border": options.tradeVolume.upBorder || "gray",
                            "Down Border": options.tradeVolume.downBorder || "gray",
                        },
                        {panelName:'Own panel'}
                    );
                }

                if (!!this.stxx&&!!options.MA) {
                    let tempPeriod = options.MA.period;
                    let colors = options.MA.colors

                    let defaultColor = 'red';

                    for (let i = 0; i < tempPeriod.length; i++) {
                        const element = tempPeriod[i];
                        const color = colors[i];

                        var inputs = {
                            "Period": element,
                                "Field": "Close",
                                "Type": "ma"
                        };
                        var outputs = {
                            "MA": color?color:defaultColor
                        };
                        window.CIQ.Studies.addStudy(this.stxx, "ma", inputs, outputs);
                    }
                }  
                
            },
            {periodicity:{period:this.period,timeUnit:this.timeUnit,interval:this.interval}}
        ); 
        
        this.stxx.chart.panel.yAxis.priceFormatter=(stx, pannel, price) => {
             // 开高低收，保留小数
            let priceDigit = options.contracts._totalMap[this.contract] && options.contracts._total[options.contracts._totalMap[this.contract]].priceDigit;
            //console.log("TCL: this.stxx.chart.panel.yAxis.priceFormatter -> options.contracts.total[this.contract]", options.contracts.total[this.contract])
            return price.toFixed(priceDigit);
        }

        if (!!options.info) {
            let open = options.info.open;
            let close = options.info.close;
            let high = options.info.high;
            let low = options.info.low;

            this.prependHeadsUpHR = this.prependHeadsUpHR.bind(this,open,close,high,low,options.contracts);
            window.CIQ.ChartEngine.prototype.prepend("headsUpHR", this.prependHeadsUpHR);
        }

        if (!!options.theme) {
            this.stxx.setThemeSettings(options.theme);
        }
        // this.stxx.doDisplayCrosshairs();
        
        this.initial = true;
    },

    prependHeadsUpHR(open,close,high,low,contracts){
        if (!!ChartIQ.stxx) {
            let tick=ChartIQ.stxx.barFromPixel(ChartIQ.stxx.cx);
            let priceDigit =    contracts._total[contracts._totalMap[this.contract]].priceDigit;
        
            let prices=ChartIQ.stxx.chart.xaxis[tick];
            if(prices){
                if(prices.data){

                    let openDom = document.querySelector(open);
                    let closeDom = document.querySelector(close);
                    let highDom = document.querySelector(high);
                    let lowDom = document.querySelector(low);

                    if (openDom) {
                        openDom.innerHTML=''+prices.data.Open.toFixed(priceDigit)+' ';
                    }

                    if (closeDom) {
                        closeDom.innerHTML=''+prices.data.Close.toFixed(priceDigit)+' ';

                    }

                    if (highDom) {
                        highDom.innerHTML=''+prices.data.High.toFixed(priceDigit)+' ';
                    }

                    if (lowDom) {
                        lowDom.innerHTML=''+prices.data.Low.toFixed(priceDigit)+' ';
                    }
                }
            }else{
                let openDom = document.querySelector(open);
                    let closeDom = document.querySelector(close);
                    let highDom = document.querySelector(high);
                    let lowDom = document.querySelector(low);

                    if (openDom) {
                        openDom.innerHTML='-- ';
                    }

                    if (closeDom) {
                        closeDom.innerHTML='-- ';
                    }

                    if (highDom) {
                        highDom.innerHTML='-- ';
                    }

                    if (lowDom) {
                        lowDom.innerHTML='-- ';
                    }
            }
        }
        
    },

    /**销毁 */
    destroy () {
        if (!!this.stxx) {
            this.stxx.clear();
            this.stxx.destroy();
            this.stxx = null;
            this.contract = null;
            this.initial = false;
            this.timeUnit = null;
            this.interval = null;
            this.period = null;
            this.type = 'slice';
            let dom = document.querySelector(this.domName);
            while (dom && dom.firstChild) {
                if (dom && dom.firstChild) {
                    dom && dom.removeChild(dom && dom.firstChild);
                }
            }
            this.domName = null;
        }
    },

    /**更换行情
     * @param {String} contract
     */
    swapContract(contract){
        if (!contract) return console.error('缺少初始商品ID');
        this.contract = contract;
        this.stxx.newChart(this.contract,null,null,null)
    },

    /**更换分辨率
     * 
     */
    swapResolution({period,timeUnit,interval},type='dynamic'){
        this.type = type;
        this.stxx.newChart(
            this.contract, 
            null,
            null,
            null,
            {periodicity:{period:period,timeUnit:timeUnit,interval:interval}}
        ); 
    },

    /**可以设置一堆参数
     * 
     */
    updateChart({masterData=null,chart=null,cb=null,option}){
        this.stxx.newChart(
            this.contract, 
            masterData,
            chart,
            cb,
            option
        ); 
    },

    /**更换行情图样式
     * 以下是一些样式
     * "none"
        "line"
        "step"
        "mountain"
        "baseline_delta"
        "candle"
        "bar"
        "hlc"
        "wave"
        "scatterplot"
        "histogram"
        "rangechannel"
     */
    swapChartStyle(style){
        this.stxx.layout.chartType = style;
        this.stxx.draw();
    },
    /**更换行情图样式与分辨率
     * 以下是一些样式
     * "none"
        "line"
        "step"
        "mountain"
        "baseline_delta"
        "candle"
        "bar"
        "hlc"
        "wave"
        "scatterplot"
        "histogram"
        "rangechannel"
     */
    swapResolutionAndChartStyle({period,timeUnit,interval},style){
        this.swapChartStyle(style);
        this.swapResolution({period,timeUnit,interval});
    },

    /**切换主题 */
    swapTheme(theme){
        this.stxx.setThemeSettings(theme);
    },

    /**隐藏或显示十字线 */
    setCrosshairs(condition){
        this.stxx.layout.crosshair=condition;
		this.stxx.doDisplayCrosshairs();
    },

    _refreshQuoteList(url){
        if(window.quoteFeedSimulator){
            window.quoteFeedSimulator.initial(url);
        }
    }
};

export{
    ChartIQ
}