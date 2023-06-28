import instance from "@/utils/request";

/**
 * 注册接口
 */
export function Register(data = {}) {
    return instance.request({
        method: "POST",
        url: "user/register",
        data,
    });
}

/** 登录 */
export function Login(data = {}) {
    return instance.request({
        method: "POST",
        url: "user/login",
        data,
    });
}
