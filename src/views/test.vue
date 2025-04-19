<script setup>
import axios from 'axios';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import router from '@/router';

const basurl = 'https://partyqa.rrrexyz.icu';
// const emit = defineEmits('send_userrank');

// 定义响应式数据------------------------
const isOverlayVisible = ref(false);
const isDialogVisible = ref(false);

// 退出键start-------------------
// 函数：打开弹窗
const openDialog = () => {
    isOverlayVisible.value = true;
    isDialogVisible.value = true;
};

// 函数：退出
const exit = () => {
    isOverlayVisible.value = false;
    isDialogVisible.value = false;
    //剩下的题全部判断错误，并提交到后端
};

// 函数：继续答题
const continueAnswer = () => {
    isOverlayVisible.value = false;
    isDialogVisible.value = false;
    router.push('/homepage');
};
// 退出键end-------------------

const questionType = computed(() => {
    const currentQuestion = questions.value[current_que.value];
    const answer = currentQuestion['answer'];
    return typeof answer === 'string' && answer.length === 1 ? '单选题' : '多选题';
});

//题目内容start----------------------------
// 计算属性：获取 questions 的长度
const questionCount = computed(() => questions.value.length);

//0未选中，1选中，2正确，3错误
const option_ele_state = ref([0, 0, 0, 0]);

//填入初始格式
const questions = ref([11]);

//点击选项触发的事件
function selected_op(op_i) {
    if (questions.value[current_que.value]['answer'].length == 1) {
        option_ele_state.value = [0, 0, 0, 0];
    }
    //点击，选中的就取消，没选的就选上
    if (option_ele_state.value[op_i] == 0) {
        option_ele_state.value[op_i] = 1;
    }
    else if (option_ele_state.value[op_i] == 1) {
        option_ele_state.value[op_i] = 0;
    }
}

// 定义响应式变量
const cor_num = ref(0);
const used_time = ref(0)   // 计时器的时间（以秒为单位）
const isRunning = ref(true) // 计时器是否在运行
let intervalId = null;      // 计时器ID
const current_que = ref(0);

// 格式化时间为 hh:mm:ss
const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(2, '0')
    const minutes = Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0')
    const seconds = (totalSeconds % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
}

// 开始计时器
const startTimer = () => {
    console.log('startTimer 被调用');
    isRunning.value = true
    intervalId = setInterval(() => {
        console.log('计时器运行中');
        used_time.value++
    }, 1000)
}

// 停止计时器
const stopTimer = () => {
    console.log('stopTimer 被调用');
    // if (!isRunning.value) return
    if (isRunning.value && intervalId !== null) {
        clearInterval(intervalId);
        isRunning.value = false;
        intervalId = null;
    }
    // intervalId = null
    // 在这里可以添加提交逻辑，例如发送计时数据到服务器
    // emit('send_userrank', [used_time, cor_num])
    // console.log('计时已停止，时间:', formatTime(used_time))
}

//错误-两秒后自动跳转
const wrongRouter = () => {
    console.log('wrongRouter 被调用');
    if (current_que.value < questions.value.length - 1) {
        setTimeout(() => {
            console.log('wrongRouter 定时器回调执行');
            if (current_que.value < questions.value.length - 1) {
                current_que.value++;
                option_ele_state.value = [0, 0, 0, 0];
            } else {
                // 最后一道题操作：停止计时，向后端发送数据，跳转
                stopTimer();
                // router.push('user');
            }
        }, 2000);
    }
};

//正确-自动跳转
const correctRouter = () => {
    //自动跳转下一题
    if (current_que.value < questions.value.length - 1) {
        current_que.value++;
        option_ele_state.value = [0, 0, 0, 0];
    } else {
        //最后一题操作
        stopTimer()
    }
}

function checkout_answer() {
    let correctAnswer = questions.value[current_que.value]['answer'];
    let userAnswer = '';
    for (var i = 0; i < 4; i++) {
        var char = String.fromCharCode('A'.charCodeAt() + i);
        //单选
        if (correctAnswer.length == 1) {
            //选中
            if (option_ele_state.value[i] == 1) {
                if (correctAnswer.indexOf(char) == -1) {
                    //选中且错误-3标红
                    option_ele_state.value[i] = 3;
                    //两秒后自动跳转
                    wrongRouter()
                } else {
                    //选中且正确-2标绿
                    option_ele_state.value[i] = 2;
                    cor_num.value++;
                    //自动跳转下一题
                    correctRouter();
                }
            }
            //未选中
            else {
                if (correctAnswer.indexOf(char) == -1) {
                    //未选中且错误-不管
                } else {
                    //未选中且正确-2标绿
                    option_ele_state.value[i] = 2
                    userAnswer += String.fromCharCode('A'.charCodeAt() + i);
                }
            }
        }
        //多选
        else {
            if (correctAnswer.indexOf(char) == -1) {//错误选项
                if (option_ele_state.value[i] == 0) {
                    //未选中，不管
                }
                else if (option_ele_state.value[i] == 1) {
                    //选中了，标成红色-错误
                    option_ele_state.value[i] = 3;
                    //两秒后自动跳转
                    wrongRouter()
                }
            }
            else {//正确选项
                if (option_ele_state.value[i] == 0) {
                    //未选中，标成红色-错误
                    option_ele_state.value[i] = 3;
                    //两秒后自动跳转
                    wrongRouter()
                }
                else if (option_ele_state.value[i] == 1) {
                    //选中了，标成绿色-正确
                    option_ele_state.value[i] = 2;
                    userAnswer += String.fromCharCode('A'.charCodeAt() + i);
                    if (userAnswer === correctAnswer) {
                        //全对正确数加一
                        cor_num.value++;
                        console.log(cor_num.value);
                        //并且自动跳转
                        correctRouter()
                    }
                }
            }
        }

    }
}
//-------------------------------

// 获取数据
axios.get(`${basurl}/api/user/project/8e7873b6-0d16-11f0-b5e5-00163e050df7`, {
    params: {
        student_id: '202500996677'
    }
})
    .then(response => {
        const data = response.data.data;
        console.log(response.data)
        if (response.data.code === 200 && response.data.status === 'success') {
            questions.value = data.questions;
        } else {
            console.error('获取数据失败:', response.data.message);
        }
        console.log(questions.value)
    })
    .catch(error => {
        console.error('请求失败:', error);
    });

// // 向后端发送数据
// const param1 = ref('');
// const param2 = ref('');

// // 定义方法
// const validateParams = () => {
//   if (!param1.value || !param2.value) {
//     console.error('缺少必需的参数');
//     return;
//   }
//   // 其他逻辑
// };

// const fetchData = async () => {
//   try {
//     const response = await axios.post(`${basurl}/api/user/project`, {
//       param1: param1.value,
//       param2: param2.value,
//       // 其他参数
//     });
//     if (response.data.code === 201 && response.data.status === 'success') {
//       // 处理成功响应
//       console.log(response.data)
//       questions.value = response.data.questions.value;
//     } else {
//       console.error('获取数据失败:', response.data.message);
//     }
//   } catch (error) {
//     console.error('请求失败:', error);
//   }
// };

// 下一题
const nextQuestion = () => {
    if (current_que.value < questions.value.length - 1) {
        current_que.value++;
        option_ele_state.value = [0, 0, 0, 0];
    } else {
        // 如果已经是最后2结束信息
        // 这里选择重置到第一题
        // emit('send_userrank', [used_time, cor_num])
        // current_que.value = 0;

        //发送数据
        // axios.post(`${basurl}/api/user/project`, data)
        //     .then(response => {
        //     console.log(response.data)
        //     if (response.data.code === 201 && response.data.status === 'success') {
        //     } else {
        //         console.error('获取数据失败:', response.data.message);
        //     }
        //     console.log(data.questions.value)
        // })
        //     .catch(error => {
        //         console.error('获取数据失败:', error);
        //     });


        router.push('user')
    }
};

// 在组件挂载时自动启动计时器
onMounted(() => {
    startTimer();
    wrongRouter();
    correctRouter();
    // fetchData()
    // validateParams()
})

// 在组件卸载时清理计时器
onUnmounted(() => {
    console.log('组件已卸载');
    stopTimer();
}
)
</script>

<template>
    <div class="bcimg">
        <div id="bac_1"></div>
        <div id="bac_2"></div>
    </div>

    <!-- 返回键 -->
    <div class="arrow">
        <img @click="openDialog" src="../assets/箭头.png" alt="" style="width: 15px;height: 28px;"
            class="clickable-image">
    </div>
    <!-- 遮罩层 -->
    <div class="overlay" :style="{ display: isOverlayVisible ? 'block' : 'none' }"></div>

    <!-- 确认弹窗 -->
    <div class="confirm-dialog" :style="{ display: isDialogVisible ? 'block' : 'none' }">
        <div class="dialog-title">确定要退出答题？</div>
        <div class="dialog-message">如果退出将会结束此次答题，后面的题目会算全错</div>
        <div class="dialog-buttons">
            <button class="dialog-button exit" @click="exit">取消</button>
            <button class="dialog-button continue" @click="continueAnswer">继续</button>
        </div>
    </div>

    <!-- 答题 -->
    <div class="main">
        <div class="quiz-container">
            <div class="description">
                <h3>{{ questionType }}</h3>
                <h3>{{ current_que + 1 }}/{{ questionCount }}</h3>
            </div>
            <div class="question">
                {{ questions[current_que]['text'] }}
            </div>
            <div class="options">
                <div v-for="(i, index) in option_ele_state" :key="index">
                    <div :class="'op' + i" @click="selected_op(index)">
                        <!-- @touchend="selected_op(index)" -->
                        {{ String.fromCharCode('A'.charCodeAt() + index) }} :
                        {{ questions[current_que][String.fromCharCode('A'.charCodeAt() + index)] }}
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- 计时器 -->
    <div class="timer-container">
        <div class="time-display">{{ formatTime(used_time) }}</div>
    </div>

    <div>正确数{{ cor_num }}</div>

    <div class="generalBtn" @click="checkout_answer">
        <button>确定</button>
    </div>
</template>

<style scoped>
.bcimg {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: -100;
    display: grid;
    grid-template-rows: 1fr 1fr;
    background-color: #FFD5D5;
}

.bcimg>* {
    background-size: 100vw auto;
    background-repeat: no-repeat;
}

#bac_1 {
    background-image: url('../assets/qt_top.png');
    background-position: top;
}

#bac_2 {
    background-image: url('../assets/qt_bot.png');
    background-position: bottom;
}

.arrow {
    z-index: 0;
    width: 100%;
    height: auto;
    position: absolute;
    top: 1rem;
}

.arrow img {
    float: left;
    margin: 15px;
}

button {
    float: right;
    margin: 15px;
    padding: 10px 20px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
}

button:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
}

.main {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
}

.quiz-container {
    width: 85%;
    height: auto;
    margin: 0 auto;
    padding: 0 20px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.158);
    box-sizing: border-box;
    position: absolute;
    top: 10rem;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 1);
}

.description {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgb(88, 88, 88);
    padding: 10px 0;
    margin-bottom: 20px;
}

.question {
    margin-bottom: 20px;
    font-size: large;
}

.options {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.op0 {
    width: 90%;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid rgba(88, 88, 88, 0.373);
    cursor: pointer;
    border-radius: 5px;
}

.op1 {
    background-color: rgba(249, 245, 242, 1);
    width: 90%;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid rgba(185, 158, 131, 1);
    color: rgba(185, 158, 131, 1);
    cursor: pointer;
    border-radius: 5px;
}

.op2 {
    background-color: rgba(236, 249, 240, 1);
    color: rgba(70, 188, 129, 1);
    border: 1px solid rgba(70, 188, 129, 1);
    width: 90%;
    padding: 10px;
    margin: 5px 0;
    cursor: pointer;
    border-radius: 5px;
}

.op3 {
    background-color: rgba(254, 236, 236, 1);
    color: rgba(244, 68, 76, 1);
    border: 1px solid rgba(244, 68, 76, 1);
    width: 90%;
    padding: 10px;
    margin: 5px 0;
    cursor: pointer;
    border-radius: 5px;
}

/* 遮罩层样式 */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.545);
    display: none;
    z-index: 9;
}

/* 弹窗样式 */
.confirm-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 4px;
    width: 80%;
    text-align: center;
    display: none;
    z-index: 10;
}

/* 标题样式 */
.dialog-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
}

/* 提示信息样式 */
.dialog-message {
    background: #f0f0f0;
    padding: 10px;
    margin-bottom: 20px;
    font-size: 13px;
}

/* 按钮样式 */
.dialog-button {
    padding: 8px 30px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.dialog-button.exit {
    background: white;
    color: #333;
}

.dialog-button.continue {
    background: #d4af37;
    color: white;
}

.timer-container {
    position: fixed;
    top: 2rem;
    height: 30vh;
    left: 50%;
    transform: translateX(-50%);
}

.time-display {
    font-size: 2rem;
    margin: 20px 0;
}

button {
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
    background-color: rgba(156, 12, 19, 1);
    color: white;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.generalBtn {
    position: fixed;
    top: 10px;
    width: 70%;
    color: white;
    background-color: rgba(156, 12, 19, 1);
    border: none;
    border-radius: 5px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    top: 37rem;
}
</style>