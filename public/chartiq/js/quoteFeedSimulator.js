// -------------------------------------------------------------------------------------------
// Copyright 2012-2017 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
// SAMPLE QUOTEFEED IMPLEMENTATION -- Connects charts to ChartIQ Simulator
(function (definition) {
	"use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.export = definition( require('./chartiq') );
	} else if (typeof define === "function" && define.amd) {
		define(["chartiq"], definition);
	} else if (typeof window !== "undefined" || typeof this !== "undefined") {
		var global = typeof window !== "undefined" ? window : this;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> wtags supported for quoteFeedSimulator.js.");
	}
})(function(_exports){
	var CIQ=_exports.CIQ;
	var quoteFeedSimulator=_exports.quoteFeedSimulator={}; // the quotefeed object

	/**
	 * Convenience function for generating a globally unique id (GUID).
	 * See http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	 * @return {string} An RFC4122 version 4 compliant UUID
	 * @private
	 */
	quoteFeedSimulator.generateGUID=function(){
		var d = new Date().getTime();
		if(window.performance && typeof window.performance.now === "function"){
			d += window.performance.now(); //use high-precision timer if available
		}
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	};

	quoteFeedSimulator.maxTicks=50000;
	quoteFeedSimulator.url="https://simulator.chartiq.com/datafeed";
	quoteFeedSimulator.url += "?session=" + quoteFeedSimulator.generateGUID(); // add on unique sessionID required by ChartIQ simulator;
	// console.log(quoteFeedSimulator.url);
	// called by chart to fetch initial data

	let duration = 0;
	let dataURL = null;
	quoteFeedSimulator.initial = function (url) {
		dataURL = url;
	}

	quoteFeedSimulator.fetchInitialData= function (symbol, suggestedStartDate, suggestedEndDate, params, cb) {
	console.log("TCL: quoteFeedSimulator.fetchInitialData -> suggestedStartDate, suggestedEndDate", suggestedStartDate, suggestedEndDate)
	
		
		let startTimeStamp = Math.ceil(parseInt(suggestedStartDate.getTime())/1000);

		let endTimeStamp = Math.ceil(parseInt(suggestedEndDate.getTime())/1000);

		let interval = params.interval;

		let resolution = interval === 'day' ? 'D' : params.period;

		let url = `/api/tv/tradingView/history?symbol=${symbol}&resolution=${resolution}&from=${startTimeStamp}&to=${endTimeStamp}`;

		fetch(url,{
							method: 'GET',
							mode: 'cors',
							credentials: 'include',
							headers:{
								'X-Requested-With':'XMLHttpRequest'
							}
		}).then(data=>{
			data.text().then(data=>{
				var newQuotes = quoteFeedSimulator.formatChartData(data);
				if (newQuotes) {
					cb({quotes:newQuotes, moreAvailable:true, attribution:{source:"myFeed", exchange:"RANDOM"}})
				}else{
					duration = duration+18000000
					let date = new Date((endTimeStamp*1000)-duration);
					setTimeout(() => {
						console.warn('重新获取行情历史图一次');
						this.fetchInitialData(symbol,date,suggestedEndDate,params,cb);
					}, 50);

					// let obj = {
					// 	s:'ok',
					// 	c:[1],
					// 	h:[1],
					// 	l:[1],
					// 	o:[1],
					// 	t:['1'],
					// 	v:[1]
					// }

					// var emptyQuotes = quoteFeedSimulator.formatChartData(JSON.stringify(obj));
					// cb({quotes:emptyQuotes, moreAvailable:true, attribution:{source:"myFeed", exchange:"RANDOM"}})

				}
			});
		}).catch(e=>{
			return new Promise((resolve, reject)=>{
				reject(e);
			})
		});
	};

	// called by chart to fetch update data
	quoteFeedSimulator.fetchUpdateData=function (symbol, startDate, params, cb) {

		let interval = params.interval;
		let resolution = interval === 'day' ? 'D' : params.period;

		let endTimeStamp = Math.ceil(parseInt(startDate.getTime())/1000);
		let startTimeStamp = endTimeStamp-600;

		let url = `${dataURL}/quota.jsp?callback=%3F&symbol=${symbol}&resolution=${resolution}&from=${startTimeStamp}&to=${endTimeStamp}&_=${new Date().getTime()}`;

		fetch(url,{
			method: 'GET',
			mode: 'cors',
			credentials: 'include',
			headers:{
				'X-Requested-With':'XMLHttpRequest'
			}
		}).then(data=>{
			data.text().then(data=>{
				var newQuotes = quoteFeedSimulator.formatChartData(data);
				if (newQuotes) {
					// cb({quotes:newQuotes, moreAvailable:true, attribution:{source:"simulator", exchange:"RANDOM"}})
					cb({quotes:newQuotes, attribution:{source:"myFeed", exchange:"RANDOM"}});
				}else{
					cb({error:'fetchUpdateData error'})	// specify error in callback
				}
			});
		}).catch(e=>{
			return new Promise((resolve, reject)=>{
				reject(e);
			})
		});
	};

	// called by chart to fetch pagination data
	quoteFeedSimulator.fetchPaginationData=function (symbol, suggestedStartDate, endDate, params, cb) {

		// var queryUrl = this.url +
		// 	"&identifier=" + symbol +
		// 	"&startdate=" + suggestedStartDate.toISOString() +
		// 	"&enddate=" + endDate.toISOString() +
		// 	"&interval=" + params.interval +
		// 	"&period=" + params.period +
		// 	"&extended=" + (params.extended?1:0);   // using filter:true for after hours

		// CIQ.postAjax(queryUrl, null, function(status, response){
		// 	// process the HTTP response from the datafeed
		// 	if(status==200){ // if successful response from datafeed
		// 		var newQuotes = quoteFeedSimulator.formatChartData(response);
		// 		cb({quotes:newQuotes, moreAvailable:suggestedStartDate.getTime()>0, attribution:{source:"simulator", exchange:"RANDOM"}}); // return fetched data (and set moreAvailable)
		// 	} else { // else error response from datafeed
		// 		cb({error:(response?response:status)});	// specify error in callback
		// 	}
		// });

		let startTimeStamp = Math.ceil(parseInt(suggestedStartDate.getTime())/1000);

		let endTimeStamp = Math.ceil(parseInt(endDate.getTime())/1000);

		let interval = params.interval;

		let resolution = interval === 'day' ? 'D' : params.period;

		let url = `/api/tv/tradingView/history?symbol=${symbol}&resolution=${resolution}&from=${startTimeStamp}&to=${endTimeStamp}`;

		fetch(url,{
							method: 'GET',
							mode: 'cors',
							credentials: 'include',
							headers:{
								'X-Requested-With':'XMLHttpRequest'
							}
		}).then(data=>{
			data.text().then(data=>{
				var newQuotes = quoteFeedSimulator.formatChartData(data);
				if (newQuotes) {
					cb({quotes:newQuotes, moreAvailable:true, attribution:{source:"myFeed", exchange:"RANDOM"}})
				}else{
					duration = duration+18000000
					let date = new Date((endTimeStamp*1000)-duration);
					// setTimeout(() => {
					// 	console.warn('重新获取行情历史图一次');
					// 	this.fetchInitialData(symbol,date,suggestedEndDate,params,cb);
					// }, 3000);

					let obj = {
						s:'ok',
						c:[1],
						h:[1],
						l:[1],
						o:[1],
						t:['1'],
						v:[1]
					}

					// var emptyQuotes = quoteFeedSimulator.formatChartData(JSON.stringify(obj));
					// cb({quotes:emptyQuotes, moreAvailable:true, attribution:{source:"myFeed", exchange:"RANDOM"}})

				}
			});
		}).catch(e=>{
			return new Promise((resolve, reject)=>{
				reject(e);
			})
		});
	};

	// utility function to format data for chart input; given simulator was designed to work with library, very little formatting is needed
	quoteFeedSimulator.formatChartData=function (response) {
		try {
			var data=JSON.parse(response);
			var arr=[];
			// for(var i=0;i<feeddata.length;i++){
			// 	newQuotes[i]={};
			// 	newQuotes[i].DT=new Date(feeddata[i].DT); // DT is a string in ISO format, make it a Date instance
			// 	newQuotes[i].Open=feeddata[i].Open;
			// 	newQuotes[i].High=feeddata[i].High;
			// 	newQuotes[i].Low=feeddata[i].Low;
			// 	newQuotes[i].Close=feeddata[i].Close;
			// 	newQuotes[i].Volume=feeddata[i].Volume;
			// }

			if (data.s === 'ok') {
		
				let nodata = data.s === 'no_data';
		
				let barsCount = nodata ? 0 : data.t.length;
		
				let volumePresent = typeof data.v !== 'undefined';
				let ohlPresent = typeof data.o !== 'undefined';
		
				// let arr = []
				for (let i = 0; i < barsCount; ++i) {
					let barValue = {
						DT: data.t[i] * 1000,
						Close: +data.c[i]
					};
		
					if (ohlPresent) {
						barValue.Open = +data.o[i];
						barValue.High = +data.h[i];
						barValue.Low = +data.l[i];
					} else {
						barValue.Open = barValue.high = barValue.low = +barValue.close;
					}
		
					if (volumePresent) {
						barValue.Volume = +data.v[i];
					}
		
					arr.push(barValue);
				}
			}else{
				return false;
			}

			return arr;
		} catch (error) {
			throw error;
		}
	};

	return _exports;

});
