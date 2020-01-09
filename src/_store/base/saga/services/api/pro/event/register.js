import { Req } from "../network/Req";
import { exposure } from "../../core/store";
import { TEST } from "../../lib/data/test";
import ERROR from './error';
import Account from './account'
import { getCookie, Storage } from "../../lib/utils";
import matchApi from '../network/matchApi'
import { EVENT } from ".";

export default {
    getVerifyCode() {
        return `/api/vf/verifyCode.jpg?_=${new Date()}`;
    },
    confirmCode(mobile = '0', imageCode = '0000', test = true) {
        if (test) {
            if (!TEST.PHONE.test(mobile)) return ERROR.PROMISE('请输入正确的手机号码');
            if (!TEST.CAPTCHA.test(imageCode)) return ERROR.PROMISE('请输入正确的图片验证码')
        }
        this.mobile = mobile;
        return Req({
            url: matchApi('/api/sso/register.htm'),
            type: 'POST',
            data: {
                action: 'sendCode',
                mobile: mobile,
                imageCode: imageCode
            },
            animate: true
        })
    },
    verify(verifyCode = '0000', mobile, test = true) {
        if (test) {
            if (!TEST.CAPTCHA.test(verifyCode)) return ERROR.PROMISE('请输入正确的手机验证码');
        }
        return Req({
            url: matchApi('/api/sso/register.htm'),
            type: 'POST',
            data: {
                action: 'verifyCode',
                verifyCode: verifyCode,
                mobile: mobile || this.mobile
            },
            animate: true
        })
    },
    mobile: '',
    password: '',
    submit(username = '', password = '', test = true) {
        if (test) {
            if (!TEST.NICKNAME.test(username)) return ERROR.PROMISE('请输入正确的昵称', 0);

            if (password === '') return ERROR.PROMISE('请输入密码', 1);

            if (!TEST.SET_PASSWORD.test(password)) return ERROR.PROMISE('密码格式不正确(密码由6-16位字母+数字组成,不能纯数字)', 2);

            if (password.length < 6 || password.length > 16) return ERROR.PROMISE('密码最少6位,最多16位', 3);

            if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/.test(password)) return ERROR.PROMISE('密码必须包含数字和字母', 4);
        }

        this.password = password;

        const o = {
            action: 'register',
            username: username,
            password: password,
            mobile: this.mobile
        };

        if (getCookie('ru')) {
            o.ru = getCookie('ru');
        }
        if (getCookie('f')) {
            o.f = getCookie('f');
        }

        return Req({
            url: matchApi('/api/sso/register.htm'),
            type: 'POST',
            data: o,
            animate: true
        });
    },
    async callback() {
        Storage.setItem('isLogin', 'true');
        Storage.setItem('mobile', this.mobile);
        Account.isLogin = true;
        try {
            await Account.submit(this.mobile, this.password);
            Account.callback()
        } catch (e) {

        }
    }
};