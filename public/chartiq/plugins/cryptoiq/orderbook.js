/* removeIf(umd) */ ;(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['componentUI'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('./componentUI'));
	} else {
		factory(root);
	}
})(this, function(_exports) {
	var CIQ = _exports.CIQ;
	/* endRemoveIf(umd) */

	/**
	 * Order Book web component `<cq-orderbook>`.
	 *
	 * Displays a table of Level 2 Bid/Ask information from {@link CIQ.ChartEngine.Chart#currentMarketData}.
	 * 
	 * **Requires [cryptoIQ]{@link CIQ.MarketDepth} plugin. See {@link CIQ.ChartEngine#updateCurrentMarketData} for data requirements**
	 * 
	 * This component will take up 100% of its parent element.
	 * 
	 * Use component's open() and close() methods to show and hide.
	 * 
	 * There are two ways to proportionally shade the rows with the size magnitude.
	 * One is with the attribute cq-size-shading which uses a linear-gradient.
	 * If your browser does not like that or render that properly the second method is to 
	 * include the `<div col="shading"></div>` cell within the template.
	 * according to the bid/ask size of the row.
	 * 
	 * Visual Reference:<br>
	 * ![img-orderBook](img-orderBook.png "img-orderBook")
	 * 
	 * @example
		<!-- This is your chart container. Position it anywhere, and in any way that you wish on your webpage. Make position style=relative -->
		<cq-context>
		<cq-ui-manager></cq-ui-manager>
		<div class="chartContainer" style="width:800px;height:460px;position:relative;">
			<cq-orderbook cq-active>
			<cq-orderbook-table reverse>
				<cq-scroll>
					<cq-orderbook-bids></cq-orderbook-bids>
				</cq-scroll>
			</cq-orderbook-table>
			<cq-orderbook-table>
				<cq-scroll>
					<cq-orderbook-asks></cq-orderbook-asks>
				</cq-scroll>
			</cq-orderbook-table>
			<template>
				<cq-item>
					<div col="price">Price</div>
					<div col="size">Size</div>
					<div col="cum_size">Total Size</div>
					<div col="amount">Amount</div>
					<div col="cum_amount">Total Amount</div>
					<div col="shading"></div>
				</cq-item>
			</template>
			</cq-orderbook>
		</div>
		</cq-context>
	 * @example
	 * // once the component is added to the HTML it can be activated and data loaded as follows:
	 * var stxx=new CIQ.ChartEngine({container:$$$(".chartContainer")}); 
	 * new CIQ.UI.Context(stxx, $("cq-context,[cq-context]"));
	 * stxx.updateCurrentMarketData(yourL2Data); // call this every time you want refresh.
	 * 
	 * @namespace WebComponents.cq-orderbook
	 * @since 6.1.0
	 */
	var Orderbook = {
		prototype: Object.create(CIQ.UI.ModalTag)
	};

	Orderbook.createMatrix=function(data){
		var res=[], lastRecord;
		for(var i=0;i<data.length;i++){
			var d=data[i];
			if(!d[1]) continue;
			var amt=d[0]*d[1];
			lastRecord={
				price:		d[0],
				size:  		d[1],
				cum_size: 	d[1]+(lastRecord?lastRecord.cum_size:0),
				amount:		amt,
				cum_amount:	amt+(lastRecord?lastRecord.cum_amount:0)
			};
			res.push(lastRecord);
		}
		return res;
	};

	Orderbook.prototype.attachedCallback=function(){
		if(this.attached) return;
		this.node=$(this);
		var myTemplate=this.node.find("template");
		var tables=this.node.find("cq-orderbook-table");
		tables.each(function(){
			var header=CIQ.UI.makeFromTemplate(myTemplate);
			if(!header) return;
			if($(this).is("[reverse]")) {
				var reverseRow=header.children().get().reverse();
				header.empty().append(reverseRow);
			}
			header.attr("cq-orderbook-header",true);
			$(this).prepend(header);
			// initialize header width at 100/n% width where n is number of columns
			var children=header.children(), childCount=children.not('[col="shading"]').length;
			children.css("width",100/childCount+"%");
		});
		CIQ.UI.ModalTag.attachedCallback.apply(this);
		this.attached=true;
	};

	Orderbook.prototype.setContext=function(context){
		var self = this;
		CIQ.UI.observe({
			obj:self.context.stx.chart.currentMarketData,
			member:"touched",
			action:"callback",
			value:function(params){ self.update(params); }
		});
	};

	Orderbook.prototype.update=function(params){
		if(!this.node.is(":visible")) return;
		var bids=params.obj.BidL2, asks=params.obj.AskL2;
		if(!bids && !asks) return;
		var sortFcn=function(a, b) {
		    return (a[0] < b[0]) ? -1 : 1;
		};
		var bidData=Orderbook.createMatrix(bids.Price_Size.slice().sort(sortFcn).reverse());
		var askData=Orderbook.createMatrix(asks.Price_Size.slice().sort(sortFcn));
		var tables=this.node.find("cq-orderbook-table");
		var self=this;
		tables.each(function(){
			if($(this).find("cq-orderbook-bids").length){
				self.createTable(bidData, "cq-orderbook-bids", $(this).is("[reverse]"));
			}
			if($(this).find("cq-orderbook-asks").length){
				self.createTable(askData, "cq-orderbook-asks", $(this).is("[reverse]"));
			}
		});
	};
	
	Orderbook.prototype.createTable=function(data, selector, reverseOrder){
		var myTemplate=this.node.find("template");
		var side=this.node.find(selector);
		if(!side.length) return;
		var self=this;
		function setHtml(i){
			return function(){
				var myCol=$(this).attr("col");
				if(myCol && data[i][myCol]!==undefined){
					var val=Number(data[i][myCol].toFixed(8)); // remove roundoff error
					var stx=self.context.stx;
					if(stx.marketDepth) stx=stx.marketDepth.marketDepth;
					val=stx.formatPrice(val, stx.chart.panel);
					$(this).html(val);
				}
			};
		}
		function order(selector){
			return function(e){
				var price=e.currentTarget.getAttribute("price");
				if(!price && price!==0) return;
				var tfc=self.context.stx.tfc;
				if(tfc){
					if(selector=="cq-orderbook-bids") tfc.newTrade("enableBuy");
					else if(selector=="cq-orderbook-asks") tfc.newTrade("enableSell");
					tfc.positionCenterLine(Number(price));
				}
			};
		}
		for(var d=0;d<data.length;d++){
			var row=side.find("cq-item")[d];
			var children;
			if(row){
				row=$(row);
			}else{
				row=CIQ.UI.makeFromTemplate(myTemplate, side);
				if(reverseOrder) {
					var reverseRow=row.children().get().reverse();
					row.empty().append(reverseRow);
				}
				children=row.children().not('[col="shading"]');
				var childCount=children.length;
				children.css("width",row.innerWidth()/childCount+"px");

				if(d===0){  // readjust headers only if there's data
					var headers=this.node.find("[cq-orderbook-header]");
					headers.children().not('[col="shading"]').css("width",headers.innerWidth()/childCount+"px");
				}
				row[0].selectFC=order(selector);
				row.stxtap(row[0].selectFC);
			}
			children=row.children().not('[col="shading"]');
			children.each(setHtml(d));
			row.attr("price",data[d].price);

			var percentSize=100*data[d].size/data[data.length-1].cum_size+"%";
			// using linear-gradient is ideal, but it doesn't shade the row in IE Edge or Safari - the cells get the shading instead.  Too bad.
			if(row.is("[cq-size-shading]")){
				row.css("background","linear-gradient("+(reverseOrder?"to right, "+row.css("border-left-color"):"to left, "+row.css("border-right-color"))+" "+percentSize+", transparent "+percentSize+", transparent)");
			}
			// use absolutely positioned cell instead
			var shadeCell=row.find('[col="shading"]');
			shadeCell.css("width",percentSize);
		}
		// this removes any extra rows from the end.
		side.find("cq-item:nth-last-child(-n+"+(side.children().length-data.length).toString()+")").remove();
		var scroll=this.node.find("cq-scroll");
		scroll.each(function(){this.resize();});
	};

	Orderbook.prototype.open=function(){
		this.node.attr("cq-active",true);
	};

	Orderbook.prototype.close=function(){
		this.node.removeAttr("cq-active");
	};

	CIQ.UI.Orderbook=document.registerElement("cq-orderbook", Orderbook);

	/* removeIf(umd) */
	return _exports;
});
/* endRemoveIf(umd) */
