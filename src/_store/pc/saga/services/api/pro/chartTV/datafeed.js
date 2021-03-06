/*
	This class implements interaction with UDF-compatible datafeed.

	See UDF protocol reference at
	https://github.com/tradingview/charting_library/wiki/UDF
*/
let gap = 0;

function parseJSONorNot(mayBeJSON) {
    if (typeof mayBeJSON === 'string') {
        return JSON.parse(mayBeJSON);
    } else {
        return mayBeJSON;
    }
}

let Datafeeds = {};

Datafeeds.UDFCompatibleDatafeed = function (datafeedURL, updateURL, updateFrequency,contract) {
    this._datafeedURL = datafeedURL;
    this._updateURL = updateURL;
    this._updateTried = 0;
    this._updateRefresh = false;
    this._configuration = undefined;
    this._contract = contract;

    this._symbolSearch = null;
    this._symbolsStorage = null;
    this._barsPulseUpdater = new Datafeeds.DataPulseUpdater(this, updateFrequency || 10 * 1000);
    this._quotesPulseUpdater = new Datafeeds.QuotesPulseUpdater(this);

    this._enableLogging = false;
    this._initializationFinished = false;
    this._callbacks = {};
    this._interval = null;

    this._initialize();
};

Datafeeds.UDFCompatibleDatafeed.prototype.updateQuoteUrl = function (arr) {
    this._updateRefresh = true;
    this._updateTried = 0;
    this._updateURL = arr;
};

Datafeeds.UDFCompatibleDatafeed.prototype.defaultConfiguration = function () {
    return {
        supports_search: true,
        supports_group_request: false,
        supported_resolutions: ['1','3', '5', '15', '60', '1D'],
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time:true
    };
};

Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
    if (this._configuration.supports_time) {
        const time = this._contract.serviceTime;
        gap = time - parseInt((new Date().valueOf()) / 1000);
        if (!isNaN(time)) {
            callback(time);
        }
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype.on = function (event, callback) {
    if (!this._callbacks.hasOwnProperty(event)) {
        this._callbacks[event] = [];
    }

    this._callbacks[event].push(callback);
    return this;
};

Datafeeds.UDFCompatibleDatafeed.prototype._fireEvent = function (event, argument) {
    if (this._callbacks.hasOwnProperty(event)) {
        let callbacksChain = this._callbacks[event];
        for (let i = 0; i < callbacksChain.length; ++i) {
            callbacksChain[i](argument);
        }

        this._callbacks[event] = [];
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype.onInitialized = function () {
    this._initializationFinished = true;
    this._fireEvent('initialized');
};

Datafeeds.UDFCompatibleDatafeed.prototype._logMessage = function (message) {
    if (this._enableLogging) {
        let now = new Date();
        console.log(now.toLocaleTimeString() + '.' + now.getMilliseconds() + '> ' + message);
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype._send = function (url, params, over) {
    let request = url;
    if (params) {
        for (let i = 0; i < Object.keys(params).length; ++i) {
            let key = Object.keys(params)[i];
            let value = encodeURIComponent(params[key]);
            request += (i === 0 ? '?' : '&') + key + '=' + value;
        }
    }

    this._logMessage('New request: ' + request);

    if (over) {
        return fetch(request, {
            method: 'GET',
            mode: 'cors'
        });
    } else {
        return fetch(request, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'content-type': 'text/plain'
            }
        });
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype._initialize = function () {
    this._setupWithConfiguration(this.defaultConfiguration())
    // let that = this;
    // this._send(this._datafeedURL + '/config')
    //     .then(function (response) {
    //         try {
    //             response.json().then(function (data) {
    //                 let configurationData = parseJSONorNot(data);
    //                 that._setupWithConfiguration(configurationData);
    //             }).catch(function (err) {
    //                 that._setupWithConfiguration(that.defaultConfiguration(err))
    //             })
    //         } catch (err) {
    //             that._setupWithConfiguration(that.defaultConfiguration(err));
    //         }
    //     })
    //     .catch(function (reason) {
    //         that._setupWithConfiguration(that.defaultConfiguration());
    //     });
};

Datafeeds.UDFCompatibleDatafeed.prototype.onReady = function (callback) {
    let that = this;
    if (this._configuration) {
        setTimeout(function () {
            callback(that._configuration);
        }, 0);
    } else {
        this.on('configuration_ready', function () {
            callback(that._configuration);
        });
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype._setupWithConfiguration = function (configurationData) {
    this._configuration = configurationData;

    if (!configurationData.exchanges) {
        configurationData.exchanges = [];
    }

    //	@obsolete; remove in 1.5
    let supportedResolutions = configurationData.supported_resolutions || configurationData.supportedResolutions;
    configurationData.supported_resolutions = supportedResolutions;

    //	@obsolete; remove in 1.5
    let symbolsTypes = configurationData.symbols_types || configurationData.symbolsTypes;
    configurationData.symbols_types = symbolsTypes;

    if (!configurationData.supports_search && !configurationData.supports_group_request) {
        throw new Error('Unsupported datafeed configuration. Must either support search, or support group request');
    }

    if (!configurationData.supports_search) {
        this._symbolSearch = new Datafeeds.SymbolSearchComponent(this);
    }

    if (configurationData.supports_group_request) {
        //	this component will call onInitialized() by itself
        this._symbolsStorage = new Datafeeds.SymbolsStorage(this);
    } else {
        this.onInitialized();
    }

    this._fireEvent('configuration_ready');
    this._logMessage('Initialized with ' + JSON.stringify(configurationData));
};

//	===============================================================================================================================
//	The functions set below is the implementation of JavaScript API.

Datafeeds.UDFCompatibleDatafeed.prototype.getMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
    if (this._configuration.supports_marks) {
        this._send(this._datafeedURL + '/marks', {
            symbol: symbolInfo.ticker.toUpperCase(),
            from: rangeStart,
            to: rangeEnd,
            resolution: resolution
        })
            .then(function (response) {
                response.json().then((o) => {
                    onDataCallback(parseJSONorNot(o));
                });

            })
            .catch(function () {
                onDataCallback([]);
            });
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype.getTimescaleMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
    if (this._configuration.supports_timescale_marks) {
        this._send(this._datafeedURL + '/timescale_marks', {
            symbol: symbolInfo.ticker.toUpperCase(),
            from: rangeStart,
            to: rangeEnd,
            resolution: resolution
        })
            .then(function (response) {
                response.json().then((o) => {
                    onDataCallback(parseJSONorNot(o));
                })
            })
            .catch(function () {
                onDataCallback([]);
            });
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype.searchSymbols = function (searchString, exchange, type, onResultReadyCallback) {
    let MAX_SEARCH_RESULTS = 30;

    if (!this._configuration) {
        onResultReadyCallback([]);
        return;
    }

    if (this._configuration.supports_search) {
        this._send(this._datafeedURL + '/search', {
            limit: MAX_SEARCH_RESULTS,
            query: searchString.toUpperCase(),
            type: type,
            exchange: exchange
        })
            .then(function (response) {
                response.json().then((o) => {
                    let data = parseJSONorNot(o);

                    for (let i = 0; i < data.length; ++i) {
                        if (!data[i].params) {
                            data[i].params = [];
                        }

                        data[i].exchange = data[i].exchange || '';
                    }

                    if (typeof data.s == 'undefined' || data.s !== 'error') {
                        onResultReadyCallback(data);
                    } else {
                        onResultReadyCallback([]);
                    }
                });
            })
            .catch(function (reason) {
                onResultReadyCallback([]);
            });
    } else {
        if (!this._symbolSearch) {
            throw new Error('Datafeed error: inconsistent configuration (symbol search)');
        }

        let searchArgument = {
            searchString: searchString,
            exchange: exchange,
            type: type,
            onResultReadyCallback: onResultReadyCallback
        };

        if (this._initializationFinished) {
            this._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
        } else {
            let that = this;

            this.on('initialized', function () {
                that._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
            });
        }
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype._symbolResolveURL = '/symbols';

//	BEWARE: this function does not consider symbol's exchange
Datafeeds.UDFCompatibleDatafeed.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    let that = this;

    if (!this._initializationFinished) {
        this.on('initialized', function () {
            that.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
        });

        return;
    }

    let resolveRequestStartTime = Date.now();
    that._logMessage('Resolve requested');

    function onResultReady(data) {
        let postProcessedData = data;
        if (that.postProcessSymbolInfo) {
            postProcessedData = that.postProcessSymbolInfo(postProcessedData);
        }

        that._logMessage('Symbol resolved: ' + (Date.now() - resolveRequestStartTime));
        onSymbolResolvedCallback(postProcessedData);
    }

    if (!this._configuration.supports_group_request) {

        let {priceDigit,priceChange,session,code} = this._contract.getItem(symbolName);
        priceDigit = priceDigit || 0;
        priceChange = priceChange || 1;
        const pow = Math.pow(10,priceDigit);
        const o = {
            name:symbolName ? symbolName.toUpperCase() : '',
            currency_code: "USD",
            data_status: "streaming",
            description: code,
            expiration_date: "",
            expired: false,
            force_session_rebuild: false,
            fractional: false,
            has_daily: true,
            has_empty_bars: false,
            has_intraday: true,
            has_no_volume: true,
            has_seconds: false,
            has_weekly_and_monthly: false,
            intraday_multipliers: ["1", "3", "5", "15","60"],
            minmov: priceChange.mul(pow),
            minmove2: 0,
            pricescale:pow,
            session: session,
            supported_resolutions: ["1", "3", "5", "15", "60", "1D"],
            ticker: code,
            timezone: "Asia/Hong_Kong",
            type: "",
            volume_precision: true
        };
        setTimeout(()=>{
            onResultReady(o);
        },0);


        // this._send(this._datafeedURL + this._symbolResolveURL, {
        //     symbol: symbolName ? symbolName.toUpperCase() : ''
        // })
        //     .then(function (response) {
        //         response.json().then((o) => {
        //             let data = parseJSONorNot(o);
        //
        //             if (data.s && data.s !== 'ok') {
        //                 onResolveErrorCallback('unknown_symbol');
        //             } else {
        //                 data.name = symbolName ? symbolName.toUpperCase() : '';
        //                 data.expiration_date = '';
        //                 onResultReady(data);
        //             }
        //         })
        //     })
        //     .catch(function (reason) {
        //         that._logMessage('Error resolving symbol: ' + JSON.stringify([reason]));
        //         onResolveErrorCallback('unknown_symbol');
        //     });
    } else {
        if (this._initializationFinished) {
            this._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
        } else {
            this.on('initialized', function () {
                that._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
            });
        }
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype._historyURL = '/history';

let flag = true;
Datafeeds.UDFCompatibleDatafeed.prototype.start = () => flag = true;
Datafeeds.UDFCompatibleDatafeed.prototype.end = () => flag = false;

Datafeeds.UDFCompatibleDatafeed.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
    if(flag){

    if (gap !== 0) {
        rangeStartDate += gap;
        rangeEndDate += gap;
    }
    //	timestamp sample: 1399939200
    if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
        throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate]);
    }

    let val = rangeEndDate - rangeStartDate;
    if (val === 600) {
        this._send(this._updateURL + '/quota.jsp', {
            callback: '?',
            symbol: symbolInfo.ticker.toUpperCase(),
            resolution: resolution,
            from: rangeStartDate,
            to: rangeEndDate,
            _: new Date().getTime(),
        }, true).then(function (response) {
            response.json().then((o) => {
                dataCB(o, onDataCallback, onErrorCallback)
            });
        }).catch((arg) => {
            console.warn(['getBars(): HTTP error', arg]);
            // if(!this._updateRefresh){
            //     this._updateTried++;
            //     if (this._updateTried > this._updateURL.length - 1) this._updateTried = 0;
            // }else{
            //     this._updateRefresh = false;
            // }
            if (!!onErrorCallback) {
                onErrorCallback('network error: ' + parseJSONorNot(arg));
            }
        })
    } else {
        this._send(this._datafeedURL + this._historyURL, {
            symbol: symbolInfo.ticker.toUpperCase(),
            resolution: resolution,
            from: rangeStartDate,
            to: rangeEndDate
        }).then(function (response) {
            response.json().then((o) => {
                dataCB(o, onDataCallback, onErrorCallback);
            })
        }).catch(function (arg) {
            console.warn(['getBars(): HTTP error', arg]);
            if (!!onErrorCallback) {
                onErrorCallback('network error: ' + parseJSONorNot(arg));
            }
        });
    }
} else {
   const data =  {"s":"ok","t":[],"c":[],"o":[ ],"h":[],"l":[],"v":[]}
   dataCB(JSON.stringify(data), onDataCallback, onErrorCallback);

}

};

function dataCB(response, onDataCallback, onErrorCallback) {
    let data = parseJSONorNot(response);
    let nodata = data.s === 'no_data';
    if (data.s !== 'ok' && !nodata) {
        if (!!onErrorCallback) {
            onErrorCallback(data.s);
        }
        return;
    }
    let bars = [];
    //	data is JSON having format {s: "status" (ok, no_data, error),
    //  v: [volumes], t: [times], o: [opens], h: [highs], l: [lows], c:[closes], nb: "optional_unixtime_if_no_data"}
    let barsCount = nodata ? 0 : data.t.length;

    let volumePresent = typeof data.v !== 'undefined';
    let ohlPresent = typeof data.o !== 'undefined';

    for (let i = 0; i < barsCount; ++i) {
        let barValue = {
            time: data.t[i] * 1000,
            close: +data.c[i]
        };

        if (ohlPresent) {
            barValue.open = +data.o[i];
            barValue.high = +data.h[i];
            barValue.low = +data.l[i];
        } else {
            barValue.open = barValue.high = barValue.low = +barValue.close;
        }

        if (volumePresent) {
            barValue.volume = +data.v[i];
        }

        bars.push(barValue);
    }

    onDataCallback(bars, {noData: nodata, nextTime: data.nb || data.nextTime});
}

Datafeeds.UDFCompatibleDatafeed.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
    this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback);
};

Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGUID) {
    this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
};

Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeAll = function () {
    this._barsPulseUpdater.unsubscribeAllListener();
};

Datafeeds.UDFCompatibleDatafeed.prototype.calculateHistoryDepth = function (period, resolutionBack, intervalBack) {
};

Datafeeds.UDFCompatibleDatafeed.prototype.getQuotes = function (symbols, onDataCallback, onErrorCallback) {
        this._send(this._datafeedURL + '/quotes', {symbols: symbols})
        .then(function (response) {
            let data = parseJSONorNot(response);
            if (data.s === 'ok') {
                //	JSON format is {s: "status", [{s: "symbol_status", n: "symbol_name", v: {"field1": "value1", "field2": "value2", ..., "fieldN": "valueN"}}]}
                if (onDataCallback) {
                    onDataCallback(data.d);
                }
            } else {
                if (onErrorCallback) {
                    onErrorCallback(data.errmsg);
                }
            }
        })
        .catch(function (arg) {
            if (onErrorCallback) {
                onErrorCallback('network error: ' + arg);
            }
        });
};

Datafeeds.UDFCompatibleDatafeed.prototype.subscribeQuotes = function (symbols, fastSymbols, onRealtimeCallback, listenerGUID) {
    this._quotesPulseUpdater.subscribeDataListener(symbols, fastSymbols, onRealtimeCallback, listenerGUID);
};

Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeQuotes = function (listenerGUID) {
    this._quotesPulseUpdater.unsubscribeDataListener(listenerGUID);
};

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	It's a symbol storage component for ExternalDatafeed. This component can
	  * interact to UDF-compatible datafeed which supports whole group info requesting
	  * do symbol resolving -- return symbol info by its name
*/
Datafeeds.SymbolsStorage = function (datafeed) {
    this._datafeed = datafeed;

    this._exchangesList = ['NYSE', 'FOREX', 'AMEX'];
    this._exchangesWaitingForData = {};
    this._exchangesDataCache = {};

    this._symbolsInfo = {};
    this._symbolsList = [];

    this._requestFullSymbolsList();
};

Datafeeds.SymbolsStorage.prototype._requestFullSymbolsList = function () {
    let that = this;

    for (let i = 0; i < this._exchangesList.length; ++i) {
        let exchange = this._exchangesList[i];

        if (this._exchangesDataCache.hasOwnProperty(exchange)) {
            continue;
        }

        this._exchangesDataCache[exchange] = true;

        this._exchangesWaitingForData[exchange] = 'waiting_for_data';

        this._datafeed._send(this._datafeed._datafeedURL + '/symbol_info', {
            group: exchange
        })
            .then((function (exchange) {
                return function (response) {
                    that._onExchangeDataReceived(exchange, parseJSONorNot(response));
                    that._onAnyExchangeResponseReceived(exchange);
                };
            })(exchange))
            .catch((function (exchange) {
                return function (reason) {
                    that._onAnyExchangeResponseReceived(exchange);
                };
            })(exchange));
    }
};

Datafeeds.SymbolsStorage.prototype._onExchangeDataReceived = function (exchangeName, data) {
    function tableField(data, name, index) {
        return data[name] instanceof Array ?
            data[name][index] :
            data[name];
    }

    let symbolIndex = 0;
    try {
        for (symbolIndex = 0; symbolIndex < data.symbol.length; ++symbolIndex) {
            let symbolName = data.symbol[symbolIndex];
            let listedExchange = tableField(data, 'exchange-listed', symbolIndex);
            let tradedExchange = tableField(data, 'exchange-traded', symbolIndex);
            let fullName = tradedExchange + ':' + symbolName;

            //	This feature support is not implemented yet
            //	let hasDWM = tableField(data, "has-dwm", symbolIndex);

            let hasIntraday = tableField(data, 'has-intraday', symbolIndex);

            let tickerPresent = typeof data.ticker !== 'undefined';

            let symbolInfo = {
                name: symbolName,
                base_name: [listedExchange + ':' + symbolName],
                description: tableField(data, 'description', symbolIndex),
                full_name: fullName,
                legs: [fullName],
                has_intraday: hasIntraday,
                has_no_volume: tableField(data, 'has-no-volume', symbolIndex),
                listed_exchange: listedExchange,
                exchange: tradedExchange,
                minmov: tableField(data, 'minmovement', symbolIndex) || tableField(data, 'minmov', symbolIndex),
                minmove2: tableField(data, 'minmove2', symbolIndex) || tableField(data, 'minmov2', symbolIndex),
                fractional: tableField(data, 'fractional', symbolIndex),
                pointvalue: tableField(data, 'pointvalue', symbolIndex),
                pricescale: tableField(data, 'pricescale', symbolIndex),
                type: tableField(data, 'type', symbolIndex),
                session: tableField(data, 'session-regular', symbolIndex),
                ticker: tickerPresent ? tableField(data, 'ticker', symbolIndex) : symbolName,
                timezone: tableField(data, 'timezone', symbolIndex),
                supported_resolutions: tableField(data, 'supported-resolutions', symbolIndex) || this._datafeed.defaultConfiguration().supported_resolutions,
                force_session_rebuild: tableField(data, 'force-session-rebuild', symbolIndex) || false,
                has_daily: tableField(data, 'has-daily', symbolIndex) || true,
                intraday_multipliers: tableField(data, 'intraday-multipliers', symbolIndex) || ['1', '5', '15', '30', '60'],
                has_weekly_and_monthly: tableField(data, 'has-weekly-and-monthly', symbolIndex) || false,
                has_empty_bars: tableField(data, 'has-empty-bars', symbolIndex) || false,
                volume_precision: tableField(data, 'volume-precision', symbolIndex) || 0
            };

            this._symbolsInfo[symbolInfo.ticker] = this._symbolsInfo[symbolName] = this._symbolsInfo[fullName] = symbolInfo;
            this._symbolsList.push(symbolName);
        }
    } catch (error) {
        throw new Error('API error when processing exchange `' + exchangeName + '` symbol #' + symbolIndex + ': ' + error);
    }
};

Datafeeds.SymbolsStorage.prototype._onAnyExchangeResponseReceived = function (exchangeName) {
    delete this._exchangesWaitingForData[exchangeName];

    let allDataReady = Object.keys(this._exchangesWaitingForData).length === 0;

    if (allDataReady) {
        this._symbolsList.sort();
        this._datafeed._logMessage('All exchanges data ready');
        this._datafeed.onInitialized();
    }
};

//	BEWARE: this function does not consider symbol's exchange
Datafeeds.SymbolsStorage.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    let that = this;

    setTimeout(function () {
        if (!that._symbolsInfo.hasOwnProperty(symbolName)) {
            onResolveErrorCallback('invalid symbol');
        } else {
            onSymbolResolvedCallback(that._symbolsInfo[symbolName]);
        }
    }, 0);
};

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	It's a symbol search component for ExternalDatafeed. This component can do symbol search only.
	This component strongly depends on SymbolsDataStorage and cannot work without it. Maybe, it would be
	better to merge it to SymbolsDataStorage.
*/

Datafeeds.SymbolSearchComponent = function (datafeed) {
    this._datafeed = datafeed;
};

//	searchArgument = { searchString, onResultReadyCallback}
Datafeeds.SymbolSearchComponent.prototype.searchSymbols = function (searchArgument, maxSearchResults) {
    if (!this._datafeed._symbolsStorage) {
        throw new Error('Cannot use local symbol search when no groups information is available');
    }

    let symbolsStorage = this._datafeed._symbolsStorage;

    let results = []; // array of WeightedItem { item, weight }
    let queryIsEmpty = !searchArgument.searchString || searchArgument.searchString.length === 0;
    let searchStringUpperCase = searchArgument.searchString.toUpperCase();

    for (let i = 0; i < symbolsStorage._symbolsList.length; ++i) {
        let symbolName = symbolsStorage._symbolsList[i];
        let item = symbolsStorage._symbolsInfo[symbolName];

        if (searchArgument.type && searchArgument.type.length > 0 && item.type !== searchArgument.type) {
            continue;
        }

        if (searchArgument.exchange && searchArgument.exchange.length > 0 && item.exchange !== searchArgument.exchange) {
            continue;
        }

        let positionInName = item.name.toUpperCase().indexOf(searchStringUpperCase);
        let positionInDescription = item.description.toUpperCase().indexOf(searchStringUpperCase);

        if (queryIsEmpty || positionInName >= 0 || positionInDescription >= 0) {
            let found = false;
            for (let resultIndex = 0; resultIndex < results.length; resultIndex++) {
                if (results[resultIndex].item === item) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                let weight = positionInName >= 0 ? positionInName : 8000 + positionInDescription;
                results.push({item: item, weight: weight});
            }
        }
    }

    searchArgument.onResultReadyCallback(
        results
            .sort(function (weightedItem1, weightedItem2) {
                return weightedItem1.weight - weightedItem2.weight;
            })
            .map(function (weightedItem) {
                let item = weightedItem.item;
                return {
                    symbol: item.name,
                    full_name: item.full_name,
                    description: item.description,
                    exchange: item.exchange,
                    params: [],
                    type: item.type,
                    ticker: item.name
                };
            })
            .slice(0, Math.min(results.length, maxSearchResults))
    );
};

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	This is a pulse updating components for ExternalDatafeed. They emulates realtime updates with periodic requests.
*/

Datafeeds.DataPulseUpdater = function (datafeed, updateFrequency) {
    this._datafeed = datafeed;
    this._subscribers = {};

    this._requestsPending = 0;
    let that = this;

    let update = function () {
        if (that._requestsPending > 0) {
            return;
        }

        for (let listenerGUID in that._subscribers) {
            let subscriptionRecord = that._subscribers[listenerGUID];
            let resolution = subscriptionRecord.resolution;
            let datesRangeRight;
            datesRangeRight = parseInt((new Date().valueOf()) / 1000);


            //	BEWARE: please note we really need 2 bars, not the only last one
            //	see the explanation below. `10` is the `large enough` value to work around holidays
            let datesRangeLeft = datesRangeRight - that.periodLengthSeconds(resolution, 10);
            that._requestsPending++;

            (function (_subscriptionRecord) { // eslint-disable-line
                that._datafeed.getBars(_subscriptionRecord.symbolInfo, resolution, datesRangeLeft, datesRangeRight, function (bars) {
                        that._requestsPending--;

                        //	means the subscription was cancelled while waiting for data
                        if (!that._subscribers.hasOwnProperty(listenerGUID)) {
                            return;
                        }

                        if (bars.length === 0) {
                            return;
                        }

                        let lastBar = bars[bars.length - 1];
                        if (!isNaN(_subscriptionRecord.lastBarTime) && lastBar.time < _subscriptionRecord.lastBarTime) {
                            return;
                        }

                        let subscribers = _subscriptionRecord.listeners;

                        //	BEWARE: this one isn't working when first update comes and this update makes a new bar. In this case
                        //	_subscriptionRecord.lastBarTime = NaN
                        let isNewBar = !isNaN(_subscriptionRecord.lastBarTime) && lastBar.time > _subscriptionRecord.lastBarTime;

                        //	Pulse updating may miss some trades data (ie, if pulse period = 10 secods and new bar is started 5 seconds later after the last update, the
                        //	old bar's last 5 seconds trades will be lost). Thus, at fist we should broadcast old bar updates when it's ready.
                        if (isNewBar) {
                            if (bars.length < 2) {
                                throw new Error('Not enough bars in history for proper pulse update. Need at least 2.');
                            }

                            let previousBar = bars[bars.length - 2];
                            for (let i = 0; i < subscribers.length; ++i) {
                                subscribers[i](previousBar);
                            }
                        }

                        _subscriptionRecord.lastBarTime = lastBar.time;

                        for (let i = 0; i < subscribers.length; ++i) {
                            subscribers[i](lastBar);
                        }
                    },

                    //	on error
                    function () {
                        that._requestsPending--;
                    });
            })(subscriptionRecord);
        }
    };

    if (typeof updateFrequency !== 'undefined' && updateFrequency > 0) {
        this._interval = setInterval(update, updateFrequency);
    }
};

Datafeeds.DataPulseUpdater.prototype.unsubscribeAllListener = function () {
    clearInterval(this._interval);
    this._subscribers = {};
};

Datafeeds.DataPulseUpdater.prototype.unsubscribeDataListener = function (listenerGUID) {
    this._datafeed._logMessage('Unsubscribing ' + listenerGUID);
    delete this._subscribers[listenerGUID];
};

Datafeeds.DataPulseUpdater.prototype.subscribeDataListener = function (symbolInfo, resolution, newDataCallback, listenerGUID) {
    this._datafeed._logMessage('Subscribing ' + listenerGUID);
    if (!this._subscribers.hasOwnProperty(listenerGUID)) {
        this._subscribers[listenerGUID] = {
            symbolInfo: symbolInfo,
            resolution: resolution,
            lastBarTime: NaN,
            listeners: []
        };
    }

    this._subscribers[listenerGUID].listeners.push(newDataCallback);
};

Datafeeds.DataPulseUpdater.prototype.periodLengthSeconds = function (resolution, requiredPeriodsCount) {
    let daysCount = 0;

    if (resolution === 'D') {
        daysCount = requiredPeriodsCount;
    } else if (resolution === 'M') {
        daysCount = 31 * requiredPeriodsCount;
    } else if (resolution === 'W') {
        daysCount = 7 * requiredPeriodsCount;
    } else {
        daysCount = requiredPeriodsCount * resolution / (24 * 60);
    }

    return daysCount * 24 * 60 * 60;
};

Datafeeds.QuotesPulseUpdater = function (datafeed) {
    this._datafeed = datafeed;
    this._subscribers = {};
    this._updateInterval = 60 * 1000;
    this._fastUpdateInterval = 10 * 1000;
    this._requestsPending = 0;

    let that = this;

    setInterval(function () {
        that._updateQuotes(function (subscriptionRecord) {
            return subscriptionRecord.symbols;
        });
    }, this._updateInterval);

    setInterval(function () {
        that._updateQuotes(function (subscriptionRecord) {
            return subscriptionRecord.fastSymbols.length > 0 ? subscriptionRecord.fastSymbols : subscriptionRecord.symbols;
        });
    }, this._fastUpdateInterval);
};

Datafeeds.QuotesPulseUpdater.prototype.subscribeDataListener = function (symbols, fastSymbols, newDataCallback, listenerGUID) {
    if (!this._subscribers.hasOwnProperty(listenerGUID)) {
        this._subscribers[listenerGUID] = {
            symbols: symbols,
            fastSymbols: fastSymbols,
            listeners: []
        };
    }

    this._subscribers[listenerGUID].listeners.push(newDataCallback);
};

Datafeeds.QuotesPulseUpdater.prototype.unsubscribeDataListener = function (listenerGUID) {
    delete this._subscribers[listenerGUID];
};

Datafeeds.QuotesPulseUpdater.prototype._updateQuotes = function (symbolsGetter) {
    if (this._requestsPending > 0) {
        return;
    }

    let that = this;
    for (let listenerGUID in this._subscribers) {
        this._requestsPending++;

        let subscriptionRecord = this._subscribers[listenerGUID];
        this._datafeed.getQuotes(symbolsGetter(subscriptionRecord),

            // onDataCallback
            (function (subscribers, guid) { // eslint-disable-line
                return function (data) {
                    that._requestsPending--;

                    // means the subscription was cancelled while waiting for data
                    if (!that._subscribers.hasOwnProperty(guid)) {
                        return;
                    }

                    for (let i = 0; i < subscribers.length; ++i) {
                        subscribers[i](data);
                    }
                };
            }(subscriptionRecord.listeners, listenerGUID)),
            // onErrorCallback
            function (error) {
                that._requestsPending--;
            });
    }
};

export const DataFeeds = Datafeeds;
