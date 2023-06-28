import axios from "axios";
//引入element-plus
import { ElMessage } from "element-plus";
console.log("11", process.env.VUE_APP_BASE_API); 

//创建实例
const service = axios.create({
    baseURL: "http://43.139.14.96:8081/", //请求地址
    timeout: 5000, //超时
});

//添加请求拦截器
service.interceptors.request.use(
    function (config) {
        //在发送请求之前做些什么
        return config;
    },
    function (error) {
        console.log(error.request);
        const errorData = JSON.parse(error.request.response);
        if (errorData.message) {
            //判断是否具有message属性
            ElMessage({
                message: errorData.message,
                type: "error",
            });
        }
        //对请求错误做些什么
        return Promise.reject(errorData);
    }
);

//添加响应拦截器
service.interceptors.response.use(
    function (response) {
        //对响应数据做些什么
        console.log("响应数据", response);
        const code = response.status
        if(code === 200) {
            const data = response.data;
            return Promise.resolve(data)
        }
        else if (code < 200 || code > 300) {
            this.$Notification.error({
                title: response.message
              })
            return Promise.reject('error')
        }
    },
    function (error) {
        //对响应错误做些什么
        console.log("错误数据", error);
        let code
        try {
            code = error.code
            console.log("code: ", code)
            return code
        } catch (e) {
            if (error.toString().indexOf('Error: timeout') !== -1) {
                this.$Notification.error({
                  title: '网络请求超时',
                  duration: 5000
                })
                return Promise.reject(error)
              }
        }
    }
);

//暴露service
export default service;
