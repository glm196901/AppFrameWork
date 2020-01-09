import ERROR from './error';
import { Req } from "../network/Req";
import { TEST } from "../../lib/data/test";
import matchApi from '../network/matchApi'
import { EVENT } from '.';

export default {


    validPhone: null,
    message: '',
    mobile: '',

    async changePassword(oldPass, newPass, comPass) {

        if (oldPass.length === 0) return ERROR.PROMISE('请输入旧密码');
        if (newPass.length === 0) return ERROR.PROMISE('请输入新密码');
        if (comPass.length === 0) return ERROR.PROMISE('请输入确认新密码');

        if (oldPass.length < 6 || oldPass.length > 16) return ERROR.PROMISE('旧密码不能少于6位，多于16位');
        if (newPass.length < 6 || newPass.length > 16) return ERROR.PROMISE('新密码不能少于6位，多于16位');
        if (comPass.length < 6 || comPass.length > 16) return ERROR.PROMISE('确认新密码不能少于6位，多于16位');

        if (oldPass === '') return ERROR.PROMISE('请输入旧密码');
        if (newPass === '') return ERROR.PROMISE('请输入新密码');
        if (comPass === '') return ERROR.PROMISE('请输入确认密码');

        if (!TEST.SET_PASSWORD.test(newPass)) return ERROR.PROMISE('密码格式不正确(密码由6-16位字母+数字组成,不能纯数字)');
        if (newPass !== comPass) return ERROR.PROMISE('两次输入密码不相同');

        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/mine/loginPasswd.htm',
                    type: 'POST',
                    data: {
                        oldPass: oldPass,
                        newPass: newPass,
                        newPassCfm: comPass
                    },
                    animate: true
                });
                this.message = result.message;
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },
    changeWithdrawPassword(oldPass, newPass, comPass) {

        if (oldPass.length === 0) return ERROR.PROMISE('请输入旧密码');
        if (newPass.length === 0) return ERROR.PROMISE('请输入新密码');
        if (comPass.length === 0) return ERROR.PROMISE('请输入确认新密码');

        if (oldPass.length < 6 || oldPass.length > 16) return ERROR.PROMISE('旧密码不能少于6位，多于16位');
        if (newPass.length < 6 || newPass.length > 16) return ERROR.PROMISE('新密码不能少于6位，多于16位');
        if (comPass.length < 6 || comPass.length > 16) return ERROR.PROMISE('确认新密码不能少于6位，多于16位');

        if (oldPass === '') return ERROR.PROMISE('请输入旧密码');
        if (newPass === '') return ERROR.PROMISE('请输入新密码');
        if (comPass === '') return ERROR.PROMISE('请输入确认密码');
        if (!TEST.SET_PASSWORD.test(newPass)) return ERROR.PROMISE('密码格式不正确(密码由6-16位字母+数字组成,不能纯数字)');
        if (newPass !== comPass) return ERROR.PROMISE('两次输入密码不相同');

        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/mine/atmPasswd.htm',
                    type: 'POST',
                    data: {
                        password: oldPass,
                        withdrawPw: newPass,
                        withdrawPwCfm: comPass
                    },
                    animate: true
                })
                this.message = result.message;
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },
    //todo 验证图片验证码
    confirmCode(step, phoneNumber, imageCode) {
        if (imageCode.length === 0) return ERROR.PROMISE('请输入验证码');
        let action = step === 1 ? 'sendVerify' : 'sendVerifyNew';

        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/mine/mobile.htm',
                    type: 'POST',
                    data: {
                        action: action,
                        mobile: phoneNumber,
                        imageCode: imageCode
                    },
                    animate: true
                });
                this.mobile = phoneNumber
                this.message = result.message;
                resolve();
            } catch (error) {
                reject(error)
            }
        })
    },
    verifySMSCode(mobile, smsCode, type) {
        if (smsCode.length === 0) return ERROR.PROMISE('请输入验证码');

        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/mine/mobile.htm',
                    type: 'POST',
                    data: {
                        action: 'verify',
                        type: type,
                        verifyCode: smsCode,
                        mobile: mobile
                    },
                    animate: true
                });
                this.message = result.message;
                if (type === 2) {
                    EVENT.Account.getFinanceUserInfo();
                    EVENT.Account.getBasicUserInfo();
                }
                resolve();
            } catch (error) {
                reject(error)
            }
        })
    },

    /**
 * 找回密码第一步
 * 发送短信
 * 找回资金密码  type = 2
 */
    validCodeNum(phone, imgCode, type) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: matchApi('/api/sso/findback.htm'),
                    type: 'POST',
                    data: {
                        action: 'sendCode',
                        mobile: phone,
                        imageCode: imgCode,
                        type: type
                    },
                    animate: true
                })
                this.message = result.message
                this.validPhone = result
                this.mobile = phone
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },
    /**
     * 找回密码第二步
     * 验证手机
     * 找回资金密码  type = 2
     */
    validPhoneNum(mobile, code, type) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: matchApi('/api/sso/findback.htm'),
                    type: 'POST',
                    data: {
                        action: 'verifyCode',
                        verifyCode: code,
                        type: '' || type,
                        mobile: mobile
                    },
                    animate: true
                });
                this.validPhone = result.redirectUrl;
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },
    /**
     * 找回提款第三步
     * 验证身份证号
     * 找回资金密码  type = 2
     */
    validUserId(name, id, type) {
        if (name.length > 30) return ERROR.PROMISE('真实姓名最多30个字')
        if (!/^[\u4e00-\u9fa5]+$|^[\u4e00-\u9fa5]+·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*[\u4e00-\u9fa5]+$/.test(name)) return ERROR.PROMISE('请输入真实姓名只支持中文');// AlertFunction({title:'警告',msg:'请输入真实姓名'});
        // if (!/^[^\x00-\xff]{0,}$/.test(name) || name.length === 0) return ERROR.PROMISE('真实姓名只支持中文')

        if (name.length === 0) return ERROR.PROMISE('请输入真实姓名');// AlertFunction({title:'警告',msg:'请输入真实姓名'});        
        if (id.length === 0) return ERROR.PROMISE('请输入身份证号')//AlertFunction({title:'警告',msg:'请输入身份证号'});
        if (id.length !== 18) return ERROR.PROMISE('请输入正确身份证号')//AlertFunction({title:'警告',msg:'请输入正确身份证号'});

        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: matchApi('/api/sso/findback.htm'),
                    type: 'POST',
                    data: {
                        action: 'auth',
                        name: name,
                        identityNumber: id,
                        type: '' || type,
                        mobile: this.mobile
                    },
                    animate: true
                })
                this.message = result.message
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },
    /**
     * 找回提款第四步
     * 验证身份证号
     * 找回资金密码  type = 2
     */
    validNewPass(newPass, confirmPass, type) {

        if (newPass.length === 0) return ERROR.PROMISE('请输入新密码');
        if (confirmPass.length === 0) return ERROR.PROMISE('请输入确认密码');
        if (confirmPass !== newPass) return ERROR.PROMISE('新密码与确认密码不一致');

        if (newPass === '') return ERROR.PROMISE('请输入新密码');
        if (newPass !== confirmPass) return ERROR.PROMISE('两次密码不一致，请您再次确认');
        if (!TEST.SET_PASSWORD.test(newPass)) return ERROR.PROMISE('密码格式不正确(密码由6-16位字母+数字组成,不能纯数字)');
        if (!TEST.SET_PASSWORD.test(confirmPass)) return ERROR.PROMISE('密码格式不正确(密码由6-16位字母+数字组成,不能纯数字)');
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: matchApi('/api/sso/findback.htm'),
                    type: 'POST',
                    data: {
                        action: 'passwd',
                        newPass: newPass,
                        newPassCfm: confirmPass,
                        type: '' || type,
                        mobile: this.mobile
                    },
                    animate: true
                });
                this.message = result.message
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },
}