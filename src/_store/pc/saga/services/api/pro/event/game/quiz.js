import {EVENT} from "../index";
import {Req} from "../../network/Req";

export default {
    rankList: [],
    myRank: {},
    commodity: [],
    compare: {},
    current: null,
    issue: null,
    monday: null,
    sunday: null,
    last: [],
    quote: null,
    brief: [],
    awardTime: null,
    nextTime: null,
    award: null,
    _callback: null,
    _subCallback: null,
    init() {
        this.getRanking();
        this.getCommodity();
    },

    exit() {
        this._callback = null;
        this._subCallback = null;
        this.quote = null;
        this.brief = [];
    },

    whileUpdate(callback, sub = false) {
        if (!sub) {
            this._callback = callback;
        } else {
            this._subCallback = callback;
        }
    },

    partExit() {
        this._subCallback = null;
    },

    _backdoorForData(data) {
        if (this.current) {
            this.quote = data[this.current];
            this.brief = this.commodity.map((e) => {
                return data[e]
            });
            this._wakeUp();
        }
    },

    _wakeUp() {
        this._callback && this._callback();
        this._subCallback && this._subCallback();
    },

    swap(contract) {
        this.current = contract;
        this.getIssue();
    },

    renew() {
        this.getIssue();
    },

    getRanking() {
        Req({
            url: '/api/quiz/ranking.htm',
            data: {
                type: 2
            }
        }).then((result) => {
            let rankList = result.rankList?result.rankList:[]
            let res = rankList.concat(['虚位以待', '虚位以待', '虚位以待', '虚位以待', '虚位以待', '虚位以待', '虚位以待', '虚位以待', '虚位以待', '虚位以待']);
            res = res.slice(0, 10);
            this.myRank = result.myRank;
            this.rankList = res;
            this._wakeUp();
        }).catch((err) => {
            EVENT.Error.throw(err);
        });
    },

    getCommodity() {
        Req({
            url: '/api/quiz/commodity.htm'
        }).then(({data}) => {
            //清空竞猜商品 避免重复添加
            this.commodity = []
            data.forEach(({contractCode, code}, key) => {
                if (key === 0) this.current = code;
                this.commodity.push(code);
                this.compare[code] = code;
            });
            this.getIssue();
        }).catch((err) => {
            EVENT.Error.throw(err);
            setTimeout(this.getCommodity, 1000)
        })
    },

    getIssue() {
        Req({
            url: '/api/quiz/issue.htm',
            data: {
                commodityCode: this.compare[this.current],
                type: 2
            }
        }).then(({thisIssue, lastIssue, poolAwardTime, pool: {eagle, monday, sunday}, nextIssue: {presellStartTime}}) => {
            this.issue = thisIssue;
            this.last = lastIssue;
            this.monday = monday.time || monday;
            this.sunday = sunday.time || sunday;
            this.awardTime = poolAwardTime.time || poolAwardTime;
            this.nextTime = presellStartTime.time ||presellStartTime;
            this.award = eagle;
            this._wakeUp();
        }).catch((err) => {
            EVENT.Error.throw(err);
            setTimeout(()=>this.getIssue, 1000);
        })
    },

    getHistory() {
        return new Promise(async (resolve, reject) => {
            try {
                const {data} = await Req({
                    url: '/api/quiz/issues_of_day.htm',
                    data: {
                        type: 2,
                        commodityCode: this.issue.commodityCode,
                        quizDate: this.issue.quizDate
                    }
                });
                resolve(data);
            } catch (err) {
                reject(err);
            }
        })
    },

    getRecord(animate = false) {
        return new Promise(async (resolve, reject) => {
            try {
                let {data} = await Req({
                    url: '/api/quiz/history.htm',
                    data: {
                        type: 2
                    },
                    animate:animate
                });
                resolve(data.map(({quizNumber, amount, buyDirection, contractCode, result, income, status}) => {
                    let target, className;
                    if (result !== 2) {
                        target = result ? Boolean(buyDirection) : !Boolean(buyDirection);
                        className = target ? 'up' : 'down';
                        target = target ? '涨' : '跌';
                    } else {
                        target = '和';
                        className = 'equal';
                    }
                    if(status !== 3) target = '--';

                    return {
                        number: quizNumber,
                        amount,
                        buyDirection,
                        resultDirection: target,
                        className,
                        code: contractCode.match(/\D+/).join(),
                        result,
                        income,
                        status
                    }
                }));
            } catch (err) {
                reject(err)
            }
        })
    },

    show() {
        return {
            awardTime: this.awardTime,
            award: this.award,
            issue: this.issue,
            last: this.last,
            rankList: this.rankList,
            myRank: this.myRank,
            monday: this.monday,
            sunday: this.sunday,
            quote: this.quote,
            brief: this.brief,
            nextTime: this.nextTime
        }
    },

    submit(amount, up = true) {
        if (amount > 10000 || amount < 50 || amount % 1 !== 0) return EVENT.Error.PROMISE('请输入 50 到 10000 之间的整数');
        if (amount === null) return EVENT.Error.PROMISE('请选择或输入您投注的积分');
        if (this.issue === null) return EVENT.Error.PROMISE('系统繁忙,请稍候尝试');
        if (!this.issue.quizCode) return EVENT.Error.PROMISE('当前奖期无法投注,请选择其他投注!');
        if (!!this.issue.betting) return EVENT.Error.PROMISE('当期已经投注，请投注其他奖期！');
        return Req({
            url: '/api/quiz/open.htm',
            type: 'POST',
            data: {
                quizCode: this.issue.quizCode,
                type: 2,
                price: this.issue.price,
                volume: parseInt(amount / this.issue.price),
                direction: Number(up)
            },
            animate:true
        });
    },

    gap() {
        return parseInt(this.nextTime.sub(new Date().getTime()).div(1000));
    }
}