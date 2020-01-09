import {Req} from "../network/Req";

export default {
    /**
     *
     * @param {Number} type 0-原油 1-黄金
     * @param {Date} [date] 请求开始日期
     * @param animate
     * @returns {Promise<any>}
     */
    async updateNews(type, date, page = 1, size = 10, animate = false) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = {
                    type: type,
                };

                if (!!date) {
                    if (date === 'pc') {
                        data.size = size;
                        data.page = page
                    } else {
                        data.date = date
                    }
                }

                const result = await Req({
                    url: '/api/news/newsList.htm',
                    type: 'GET',
                    data: data,
                    animate: animate
                });
                this.newsList = result.newsList;
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },
    async updateLive(maxId, date, device, page = 1, size = 10, animate = false) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = {
                    maxId: maxId,
                    date:date
                };
                if (!!device) {
                    if (device === 'pc') {
                        data.size = size;
                        data.page = page
                    }
                }

                let result = await Req({
                    url: '/api/news/expressList.htm',
                    type: 'GET',
                    data: data,
                    animate: animate
                });

                let dataArr = [];
                if (!!device) {
                    result = result.newsList[0].list
                } else {
                    result = result.newsList
                }

                for (let i = 0; i < result.length; i++) {
                    let element = result[i];
                    let spliceResult = element.split('#');
                    let obj = null;
                    if (spliceResult.length === 12) {
                        obj = {
                            origin: element,
                            date: spliceResult[2],
                            content: spliceResult[3],
                            id: spliceResult[spliceResult.length - 1]
                        }
                    } else if (spliceResult.length === 14) {
                        obj = {
                            origin: element,
                            date: spliceResult[8],
                            content: spliceResult[2],
                            id: spliceResult[spliceResult.length - 2],
                            qz: '前值：' + spliceResult[3],
                            yq: '预期：' + spliceResult[4],
                            sj: '实际：' + spliceResult[5],
                            tag: spliceResult[7],
                            star: spliceResult[6],
                            country: 'https://res.6006.com/jin10/flag/' + spliceResult[9].substr(0, 2) + '.png'
                        }
                    }
                    if (obj !== null) dataArr.push(obj);
                }
                this.lives = dataArr;
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },

    async updateFinanceCalender(date, animate = false) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Req({
                    url: '/api/news/calendar.htm',
                    type: 'GET',
                    data: {
                        date: date
                    },
                    animate: animate
                });
                this.calender = result;
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    async updateNotice() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Req({
                    url: '/api/discover/index.htm',
                    type: 'GET',
                    animate: false
                });

                for (let i = 0; i < result.notices.length; i++) {
                    const element = result.notices[i];
                    element.isOpen = false

                    /**新旧接口兼容 */
                    const time = element.time.time || element.time;
                    element.time = new Number(time);
                    element.time.time = time;
                    /**end */
                }
                this.notice = result.notices;
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    async updateCarousel() {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.homeBanner.length > 0 && this.homeNotice.length > 0) return resolve();
                const result = await Req({
                    url: '/api/index.htm',
                    type: 'GET',
                    data: {
                        action: 'carousel'
                    },
                    animate: false
                });
                this.homeNotice = result.notices;
                this.homeBanner = result.carousels;
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    async getNewsDetail(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Req({
                    url: '/api/news/newsDetail.htm',
                    type: 'GET',
                    data: {
                        id
                    },
                    animate: true
                });

                this.newsDetail = result.news;

                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    //币圈新闻
    async getArea(){
        return new Promise (async(resolve,reject)=>{
            try {
                const result = await Req({
                    url: '/api/news/bsjnews.htm?',
                    type: 'GET',
                    data:{
                        page:1,
                        size:20
                    },
                    animate: true
                });
                // console.log(result,'result')
                this.Area=[]
                if(result.code === 200){
                    this.Area = result.newsList[0].list;
                }else{
                    this.Area=[]
                }



                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    getAreaD(){
        return this.Area
    },

    //新闻
    newsList: null,
    getNewList() {

        return this.newsList
    },
    //直播
    lives: null,
    getLives() {
        return this.lives
    },
    //财经日历
    calender: null,
    getCalender() {
        return this.calender;
    },
    //公告
    notice: [],
    getNotice() {
        return this.notice;
    },
    //首页公告
    homeNotice: [],
    getShortNotice() {
        return this.homeNotice;
    },
    //首页广告
    homeBanner: [],
    getBanner() {
        return this.homeBanner;
    },
    newsDetail: null,
    getNewsDetailObject() {
        return this.newsDetail;
    },
}