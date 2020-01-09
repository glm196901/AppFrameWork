import {completeNum,formatDate} from "../../lib/utils";

export default {
    _openTime: {},
    _tradeTime: {},
    _total:[],
    _all:[],
    isTrading(contract) {
        if (!contract)
            return false;

        if (this._isHoliday(contract)) {
            return false;
        }

        let now = new Date();
        if (now.getDay() === 0) {
            return false;
        }

        let nowStr = formatDate('h:i', {date: now});

        if (now.getDay() === 6) {
            let nnClose = removeSecond(contract.niteCloseTime);
            if (nnClose < '12:00' && nowStr < nnClose) {
                return false;
            }
        }

        if (!this._tradeTime[contract.code]) {
            this._tradeTime[contract.code] = this._getAllPoint(contract, true);
        }

        return this._tradeTime[contract.code].indexOf(nowStr) !== -1;

    },
    isOpening(contract) {
        if (!contract)
            return false;

        if(contract.classifyCode === '3')
            return true;

        if (this._isHoliday(contract)) {
            return false;
        }

        let now = new Date();
        if (now.getDay() === 0) {
            return false;
        }

        let nowStr = formatDate('h:i', {date: now});

        if (now.getDay() === 6) {
            let nnClose = removeSecond(contract.niteCloseTime);
            // if (nnClose < '12:00' && nowStr > nnClose) {
            //     return false;
            // } else if (nnClose > '12:00') {
            //     return false;
            // }
            if (nnClose > '12:00' || nowStr > nnClose) {
                return false;
            }
        }

        let amStart = removeSecond(contract.amOpenTime);
        let pmStart = removeSecond(contract.pmOpenTime);
        if (now.getDay() === 1) {
            if (nowStr < amStart)
                return false;
            if (amStart === '00:00' && nowStr < pmStart)
                return false;
        }


        if (!this._openTime[contract.code]) {
            this._openTime[contract.code] = this._getAllPoint(contract, false);
        }

        return this._openTime[contract.code].indexOf(nowStr) !== -1;
    },
    _getAllPoint(contract, isTrade) {
        let amOpen, amClose, pmOpen, pmClose, nnOpen, nnClose, total = [], all = [];
        if (isTrade) {
            amOpen = removeSecond(contract.amTradeTime);
            amClose = removeSecond(contract.amClearingTime);
            pmOpen = removeSecond(contract.pmTradeTime);
            pmClose = removeSecond(contract.pmClearingTime);
            nnOpen = removeSecond(contract.niteTradeTime);
            nnClose = removeSecond(contract.niteClearingTime);
        } else {
            amOpen = removeSecond(contract.amOpenTime);
            amClose = removeSecond(contract.amCloseTime);
            pmOpen = removeSecond(contract.pmOpenTime);
            pmClose = removeSecond(contract.pmCloseTime);
            nnOpen = removeSecond(contract.niteOpenTime);
            nnClose = removeSecond(contract.niteCloseTime);
        }

        let start, end, hour, minute, timeStr = '';
        if(this._total.length === 0){
            for (let i = 0; i < 1440; i++) {
                hour = 0;
                minute = i % 60;
                if (i >= 60) {
                    hour = (i - minute).div(60);
                }
                timeStr = `${completeNum(hour)}:${completeNum(minute)}`;
                total.push(timeStr);
            }
            this._total = [].concat(total)
        }else{
            total = [].concat(this._total)
        }

        if (!!amOpen && !!amClose) {
            start = total.indexOf(amOpen);
            end = total.indexOf(amClose);
            all = all.concat(total.slice(start, end + 1));
        }
        if (!!pmOpen && !!pmClose) {
            start = total.indexOf(pmOpen);
            end = total.indexOf(pmClose);
            all = all.concat(total.slice(start, end + 1));
        }
        if (!!nnOpen && !!nnClose) {
            start = total.indexOf(nnOpen);
            end = total.indexOf(nnClose);
            if (end >= start) {
                all = all.concat(total.slice(start, end + 1));
            } else {
                all = all.concat(total.slice(start, total.length + 1));
                all = all.concat(total.slice(0, end + 1))
            }
        }

        return all.unique();
    },
    _isHoliday(contract) {

        let result = null, holiday = contract.holiday, data = new Date();
        let timeScope, arr, start, end;
        if (!!holiday) {
            holiday = holiday.split(';');
            result = holiday.find(function (e) {
                timeScope = e.trim();
                if (timeScope !== '') {
                    arr = timeScope.split(',');
                    start = new Date(arr[0].trim());
                    end = new Date(arr[1].trim());
                    return data.getTime() > start.getTime() && data.getTime() < end.getTime()
                }
                return false;
            });
        }
        if (result === undefined)
            result = false;

        if (result === null)
            result = false;

        if (result !== false)
            result = result.trim().split(',').shift();

        return result;
    }
}

function removeSecond(str) {
    let val = str.valueOf();
    let l = val.split(':');
    let t = null;
    if (l.length === 3) {
        t = `${l[0]}:${l[1]}`;
    } else {
        t = val;
    }
    return t;
}