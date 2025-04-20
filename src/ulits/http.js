// 所有request请求放这里，在login.vue里引用
import router from '@/router';
import axios from "axios";

import { Auth } from "@/ulits/authentication.js";
import { ElMessage } from "element-plus";

let isRefreshing = false

const request = axios.create({
    baseURL: "https://partyqa.rrrexyz.icu/api"
})

// const setToken = (access_token, refresh_token) => {
//     request.defaults.headers["Authorization"] = "Bearer ${access_token}"
//     localStorage.setItem("access_token", access_token)
//     localStorage.setItem("refresh_token", refresh_token)
// }

// const refreshToken = () => {
//     //返回的是一个包含更新后的token和refresh——token
//     var params = localStorage.getItem('refresh_token')
//     return request.get("/refresh/token", {
//         headers: {
//             "Authorization": "Bearer ${params}"
//         }
//     })
// }

// const usrData = ref({
//     sduid: "",
//     password: "",
// });

const Fail = () => {
    // const resultDiv = document.getElementById("result");
    // resultDiv.innerHTML = `认证失败：账号秘密错误`;
    // resultDiv.style.color = "red";
    ElMessage.error("密码错误请重新登录")
};
const Success = () => {
    // const resultDiv = document.getElementById("result");
    // resultDiv.innerHTML = `认证成功`;
    // resultDiv.style.color = "green";
    router.push('/homepage')
};
const Other = () => {
    ElMessage.error("网络错误，登录失败，请重新登录")
}

const login = async (usrData) => {
    // const resultDiv = document.getElementById("result");
    // resultDiv.innerHTML = `正在连接认证服务器...`;
    Auth(usrData, Success, Fail, Other);
};

// const login = async (data) => {
//     try {
//         const response = await request.post(
//             "/login", data = data, {
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded"
//             }
//         }
//         )
//         setToken(response.data.access_token, response.data.refresh_token)
//         console.log(response)
//     } catch (error) {
//         console.log(error)
//     }
// }

request.interceptors.response.use(
    // (response) => {
    //     if (response.status == 200) {
    //         return Promise.resolve(response)
    //     } else {
    //         return Promise.reject(response)
    //     }
    // }
    undefined, (error) => {
        if (error.response.status == 401) {
            var config = error.config
            if (!isRefreshing) {
                isRefreshing = true
                return refreshToken().then(
                    (res) => {
                        const access_token = res.access_token
                        const refresh_token = res.refresh_token
                        //刷新token，更新Authorization
                        setToken(access_token, refresh_token)
                        config.headers["Authorization"] = "Bearer ${access_token}"
                        //将所有失败的函数重新执行
                        requests.forEach((cb) => cb(access_token));
                        requests = []
                        return request(config)
                    }, (err) => {
                        rouyer.push("/login")
                    }
                ).catch((ref) => {
                    console.error("refresh_token error =>", res)
                }).finally(() => {
                    isRefreshing = false
                })

            } else {
                //保存函数，等待执行
                new Promise((resolve) => {
                    requests.push((access_token) => {
                        config.headers["Authorization"] = "Bearer ${access_token}"
                        resolve(request(config))
                    })
                })
            }
        }
    }
)

const createPost = async () => {
    try {
        const newPost = await request.post('/project')
        console.log(newPost)
        return newPost
    } catch (error) {
        console.log(error)
    }
}

const changeUser = async (data) => {
    try {
        const response = await request.post('/user', data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log({ response })
    } catch (error) {
        console.error({ error })
    }
}

const answerQst = async (data) => {
    try {
        const response = await request.post('/user/project', data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log({ response })
    } catch (error) {
        console.error(error)
    }
}

const getParty = async (userId) => {
    try {
        const response = await request.get(`/user/${userId}`,)
        let temp = response.data
        // console.log(temp.data.party_branch)
        return temp.data.party_branch
    } catch (error) {
        console.error(error)
    }
}
export {
    login,
    createPost,
    changeUser,
    answerQst,
    getParty
}