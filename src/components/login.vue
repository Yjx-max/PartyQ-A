<script setup>
import { login } from '@/ulits/http.js';
import { onMounted, ref } from 'vue';
import router from '@/router';

const sduid = ref('')
const password = ref('')
const isRemember = ref('')
// 在class旁边绑定v-model这里才能ref,给按钮添加点击事件

const handleLogin = async () => {
    var userData = {
        sduid: sduid.value,
        password: password.value,
    }
    console.log(isRemember.value)
    if (isRemember.value) {
        localStorage.setItem("sduid", sduid.value)
        localStorage.setItem("password", password.value)
        localStorage.setItem("student_id", sduid.value)
        // localStorage.setItem("name", 'yjx')
    } else {
        localStorage.setItem("sduid", "")
        localStorage.setItem("password", "")
    }
    await login(userData)
        .catch((error) => { console.error(error) })
    // router.push('/homepage')
}

onMounted(() => {
    sduid.value = localStorage.getItem("sduid")
    password.value = localStorage.getItem("password")
}

)
</script>

<template>
    <div class="block">
        <div class="card">
            <div class="title">党建问答登录</div>
            <div class="inputDiv">
                <div class="field">
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z">
                        </path>
                    </svg>
                    <input autocomplete="off" v-model="sduid" placeholder="学号" class="input-field" type="text">
                </div>
                <div class="field">
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z">
                        </path>
                    </svg>
                    <input placeholder="密码" v-model="password" class="input-field" type="password">
                </div>
            </div>
            <div class="remember">
                <div class="flex-row">
                    <div>
                        <input v-model="isRemember" type="checkbox">
                        <label style="margin-left: 5px;">remember me</label>
                    </div>
                </div>
            </div>
            <div class="loginBtnDiv">
                <button @click="handleLogin" class="loginBtn">
                    Login
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.block {
    width: 100%;
    height: 490px;
    position: fixed;
    top: 232px;
}

.card {
    margin: 0 auto;
    width: 280px;
    height: 410px;
    min-width: 250px;
    background-color: rgba(255, 255, 255, 0.56);
    border-radius: 30px;
    box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
}

.title {
    position: relative;
    top: 40px;
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* 下面这两个想居中，必须把display改成flex */
    font-size: large;
    font-weight: bold;
}

.inputDiv {
    position: relative;
    top: 40px;
    width: 100%;
    height: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.field {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    border-radius: 25px;
    padding: 0.6em;
    margin-top: 10px;
    border: none;
    outline: none;
    color: rgb(0, 0, 0);
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(0, 0, 0, 0.5);
}

.input-icon {
    height: 1.3em;
    width: 1.3em;
    fill: rgb(0, 0, 0);
}

.input-field {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color: #121212;
}

.remember {
    position: relative;
    top: 60px;
    right: 40px;
    width: 100%;
    height: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
}

.loginBtnDiv {
    top: 100px;
    position: relative;
    width: 100%;
    height: 8%;
    font-size: medium;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loginBtn {
    width: auto;
    height: 100%;
    padding: 0 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: #ffffff;
    border-radius: 7px;
    border: 0px solid rgba(0, 0, 0, 0.5);
    background-color: rgba(225, 51, 15, 1);
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
}

.OR {
    margin: 0 10px 0 10px;
}

.ORDiv {
    position: relative;
    top: 90px;
    width: 100%;
    height: 1%;
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.line {
    width: 60px;
    height: 1px;
    background-color: #000000;
}

.signUpDiv {
    position: relative;
    top: 90px;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.fb {
    margin-left: 5px;
    color: #2332dc;
}
</style>