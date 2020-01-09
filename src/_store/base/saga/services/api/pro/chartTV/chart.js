import {TradingView} from "./charting_library.min";
import {DataFeeds} from "./datafeed";

let jsonList = null;

export function JsonListMerge(address) {
    jsonList = address;
}

let turn = false;

function lighten(obj) {
    if (obj) {
        if (turn) {
            obj.applyOverrides({
                'mainSeriesProperties.areaStyle.color1': '#e34c4c',
                'mainSeriesProperties.areaStyle.linecolor': '#e34c4c'
            })
        } else {
            obj.applyOverrides({
                'mainSeriesProperties.areaStyle.color1': '#00b38f',
                'mainSeriesProperties.areaStyle.linecolor': '#00b38f'
            })
        }
        turn = !turn
    }
    setTimeout(() => {
        lighten(obj)
    }, 100)
}

//todo 生成详细的覆盖配置文件
const Chart = {
    study: [],
    table: null,
    widget: null,
    type: 'sline',
    initial: false,
    volume: true,

    _initWaiting:null,
    _initLooping(options){
        if(!!options.contract && (!!options.code || options.contract.index !== '')){
            if(options.contract.getItem(options.code || options.contract.index).usable){
                this._initWaiting = null;
                this._init(options)
            }else if(this._initWaiting !== null){
                this._initWaiting = setTimeout(()=>{
                    this._initLooping(options)
                },500)
            }
        }else {
            console.warn('参数错误');
        }
    },
    _init(options){
        if (this.initial) return;

        const RAISE = options.RAISE || '#e34c4c';
        const FALL = options.FALL || '#00b38f';

        if (options.volume === false) this.volume = false;

        let overrides = Object.assign({
            'paneProperties.vertGridProperties.color': "#f8f8f8",
            'paneProperties.horzGridProperties.color': "#f8f8f8",

            'paneProperties.legendProperties.showSeriesTitle': false,
            // 'paneProperties.legendProperties.showStudyTitles': false,
            // 'paneProperties.legendProperties.showStudyValues': false,
            'paneProperties.legendProperties.showLegend': false,

            'mainSeriesProperties.candleStyle.upColor': RAISE,
            'mainSeriesProperties.candleStyle.downColor': FALL,
            'mainSeriesProperties.candleStyle.drawWick': true,
            'mainSeriesProperties.candleStyle.drawBorder': false,
            'mainSeriesProperties.candleStyle.borderUpColor': RAISE,
            'mainSeriesProperties.candleStyle.borderDownColor': FALL,
            'mainSeriesProperties.candleStyle.wickUpColor': RAISE,
            'mainSeriesProperties.candleStyle.wickDownColor': FALL,
            'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
            'mainSeriesProperties.areaStyle.color1': "#32577a",
            'mainSeriesProperties.areaStyle.color2': "#ffffff",
            'mainSeriesProperties.areaStyle.linecolor': "#32577a",
            // LINESTYLE_SOLID = 0
            // LINESTYLE_DOTTED = 1
            // LINESTYLE_DASHED = 2
            // LINESTYLE_LARGE_DASHED = 3
            'mainSeriesProperties.areaStyle.linestyle': 0,
            'mainSeriesProperties.areaStyle.linewidth': 2,
            'mainSeriesProperties.areaStyle.priceSource': "close",
            "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)"
        }, options.overrides || {});


        let studies_overrides = Object.assign({
            "volume.volume.color.0": FALL,
            "volume.volume.color.1": RAISE,
            "volume.volume.transparency": 30,
        }, options.studies_overrides || {});

        try {
            if (!options.dom) return console.error('缺少chart容器ID');

            if (!options.code) return console.error('缺少初始商品ID');
            const cover = Object.options({
                // fullscreen: true,
                // height: options.height,
                // width: options.width,
                // autosize: true,
                autosize:options.autosize,
                height:options.height,
                width:options.width,
                preset:options.preset
            });

            let widget = this.widget = new TradingView.widget(Object.assign({
                symbol: options.code,
                interval: '1',
                // timeframe:'',
                timezone: 'Asia/Hong_Kong',
                container_id: options.dom,
                datafeed: new DataFeeds.UDFCompatibleDatafeed("/api/tv/tradingView", jsonList, 1000, options.contract),
                library_path: process.env.PUBLIC_URL + "/chartLab/",
                locale: 'zh',
                //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
                // drawings_access: {type: 'black', tools: [{name: "Regression Trend"}]},
                // toolbar_bg: '#ffffff',
                loading_screen:'backgroundColor',
                disabled_features: [
                    "use_localstorage_for_settings",
                    "header_symbol_search",
                    "header_saveload",
                    "header_screenshot",
                    "header_settings",
                    "header_compare",
                    "header_undo_redo",
                    "timeframes_toolbar",
                    "remove_library_container_border",
                    "border_around_the_chart",
                    "display_market_status",
                    "show_logo_on_all_charts",
                    "show_chart_property_page",
                    // "panel_context_menu"
                ],
                enabled_features: [
                    "study_templates",
                    "keep_left_toolbar_visible_on_small_screens",
                    "side_toolbar_in_fullscreen_mode",
                    "property_pages",
                ],
                charts_storage_url: 'http://saveload.tradingview.com',
                charts_storage_api_version: "1.1",
                user_id: 'jailecoeu',
                overrides: overrides,
                preset: "mobile",
                studies_overrides: studies_overrides,
                custom_css_url: options.css || ''
            },cover));

            widget.onChartReady(() => {
                if (this.widget === null)
                    return;
                this.initial = true;
                this.table = this.widget.chart();
                this.ma();
                // STYLE_BARS = 0;
                // STYLE_CANDLES = 1;
                // STYLE_LINE = 2;
                // STYLE_AREA = 3;
                // STYLE_HEIKEN_ASHI = 8;
                // STYLE_HOLLOW_CANDLES = 9;
                this.table.setChartType(3);
                // setTimeout(()=>{
                //     lighten(this.widget)
                // },2000);
                this.table.onIntervalChanged().subscribe(null, (interval, obj) => {
                    if (interval === '1' && this.type === 'sline') {
                        this.table.setChartType(3);
                        if (this.study.length > 0) {
                            for (let i = 0, len = this.study.length; i < len; i++) {
                                let entityId = this.study.pop();
                                this.table.removeEntity(entityId);
                            }
                        }
                        this.ma();
                    } else {
                        this.table.setChartType(1);
                        if (this.study.length <= 1) {
                            if (this.study.length === 1) {
                                let entityId = this.study.pop();
                                this.table.removeEntity(entityId);
                            }
                            this.ma();
                        }
                    }
                })
            });

        } catch (err) {
            console.warn(err);
        }
    },

    init(options) {
        clearTimeout(this._initWaiting);
        this._initWaiting = true;
        this._initLooping(options);
    },
    _refreshQuoteList(address) {
        if (this.widget) {
            this.widget.options.datafeed.updateQuoteUrl(address);
        } else {
            jsonList = address
        }
    },
    _addTechnicalIndicators() {
        if (this.study.length <= 1) {
            if (this.study.length === 1) {
                let entityId = this.study.pop();
                this.table.removeEntity(entityId);
            }
            this.ma();
        } else if (this.study.length > 0) {
            for (let i = 0, len = this.study.length; i < len; i++) {
                let entityId = this.study.pop();
                this.table.removeEntity(entityId);
            }
            this.ma();
        }
    },
    ma(){
        this.table.createStudy('Moving Average', true, false, [5], (entityId) => {
            this.study.push(entityId);
        }, {
            'plot.color': "rgba(150,95,196,1)"
        });
        this.table.createStudy('Moving Average', true, false, [10], (entityId) => {
            this.study.push(entityId);
        }, {
            'plot.color': "rgba(132,170,213,1)"
        });
        this.table.createStudy('Moving Average', true, false, [20], (entityId) => {
            this.study.push(entityId);
        }, {
            'plot.color': "rgba(85,178,99,1)"
        });
        this.table.createStudy('Moving Average', true, false, [40], (entityId) => {
            this.study.push(entityId);
        }, {
            'plot.color': "rgba(183,36,138,1)"
        });
        if (this.volume) {
            this.table.createStudy('Volume', false, false, [], (entityId) => {
                this.study.push(entityId);
            }, {
                'volume ma.color': "rgba(132,170,213,1)"
            });
        }
    },
    /**
     * 切换至全屏,尚未开发完成
     */
    fullScreen(){
        if(!this.table)
            return;
        this.widget.options.fullscreen = true;
        this.widget._autoResizeChart();
    },

    swap(options) {
        if (!this.table)
            return;

        if (!options)
            return console.error('切换表格缺少参数 options');
        //todo 模式一 切换类型
        if (!!options.type && !options.code) {
            if (this.type === 'sline' && options.type === '1') {
                this.table.setChartType(1);
                this._addTechnicalIndicators();
                this.type = options.type;
            } else if (this.type === '1' && options.type === 'sline') {
                this.table.setChartType(3);
                this._addTechnicalIndicators();
                this.type = options.type;
            } else {
                this.type = options.type;
                const type = (options.type === 'sline' ? '1' : options.type);
                this.table.setResolution(type);
            }
        }

        //todo 模式二 切换合约
        if (!!options.code && !options.type) {
            this.table.setSymbol(options.code);
        }

        //todo 模式三 切换模式与合约
        if (!!options.code && !!options.type) {
            this.type = options.type;
            const type = (options.type === 'sline' ? '1' : options.type);
            this.widget.setSymbol(options.code, type);
        }
    },
    /**
     * 更换面积图的颜色
     * @param color
     */
    switchAreaStyle(color){
        if(!this.table)
            return;
        this.table.applyOverrides({
            'mainSeriesProperties.areaStyle.color1': color,
            'mainSeriesProperties.areaStyle.linecolor': color
        })
    },
    exit() {
        this.widget.options.datafeed.end();
        // this.widget && this.widget.options && this.widget.options.datafeed.unsubscribeAll();
        // if(!!this.widget){
        //     this.widget.remove();
        // }
        // this.widget = null;
        // this.table = null;
        // this.type = 'sline';
        // this.initial = false;
        // this.volume = true;
    },
    start(){
        this.widget.options.datafeed.start();
        // this.widget && this.widget.options && this.widget.options.datafeed.subscribeQuotes(symbol);
    }
};
export {
    Chart
}