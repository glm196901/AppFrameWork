import {Storage} from "../utils";

/**
 * 科学的加法
 * @returns {*}
 */
Number.prototype.add = function (arg) {
    return addition(arg, this)
};

function addition(arg1, arg2) {

    let r1, r2, m, c;

    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }

    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }

    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        let cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        }
        else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    }
    else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m

}

/**
 * 科学的减法
 * @param arg
 * @returns {*}
 */
Number.prototype.sub = function (arg) {
    return subtraction(arg, this)
};

function subtraction(arg1, arg2) {
    let r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg2 * m - arg1 * m) / m).toFixed(n));
}

/**
 * 科学的乘法
 * @param arg
 * @returns {*}
 */
Number.prototype.mul = function (arg) {
    return multiplication(arg, this)
};

function multiplication(arg1, arg2) {

    let m = 0, s1 = arg1.toString(), s2 = arg2.toString();

    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }

    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }

    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)

}

/**
 * 科学的除法
 * @param arg
 * @returns {*}
 */
Number.prototype.div = function (arg) {
    return division(this, arg)
};

/**
 * 获取小数点位数
 * @returns {number}
 */
Number.prototype.floatLength = function () {
  let s = this.toString();
  if(s.indexOf('.') === -1){
      return 0
  }else {
      return s.split('.')[1].length;
  }
};

function division(arg1, arg2) {

    let t1 = 0, t2 = 0, r1, r2;

    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }

    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }


    r1 = Number(arg1.toString().replace(".", ""));

    r2 = Number(arg2.toString().replace(".", ""));

    return (r1 / r2).mul(Math.pow(10, t2 - t1));
}

Array.prototype.remove = function (val) {
    for (let i = 0; i < this.length;) {
        if (this[i] === val) {
            this.splice(i, 1);
        } else {
            i++;
        }
    }
};

Array.prototype.unique = function () {
    let r = [];
    for (let o of this) {
        if (!r.includes(o)) {
            r.push(o)
        }
    }
    return r;
};

Array.prototype.replace = function (target, value) {
    const index = this.indexOf(target);
    if (index !== -1) {
        this[index] = value;
    }
};

Array.prototype.last = function () {
    return this[this.length - 1]
};

Array.prototype.differ = function (target) {
    return this.filter((e) => {
        return !target.includes(e)
    })
};

Array.prototype.insert = function (target) {
    target.forEach((e) => {
        if (!this.includes(e)) this.push(e)
    })
};

Array.prototype.matrix = function (size) {
    const result = [];
    for (let x = 0; x < Math.ceil(this.length / size); x++) {
        let start = x * size;
        let end = start + size;
        result.push(this.slice(start, end));
    }
    return result;
};

/**
 * 用于生成配置对象,将会移除配置中的undefined
 * @param data
 * @returns {*}
 */
Object.options = function (data) {
    for (let o of Object.keys(data)) {
        if (data[o] === undefined) {
            delete  data[o]
        }
    }
    return data;
};