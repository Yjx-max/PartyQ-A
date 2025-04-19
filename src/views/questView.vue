<script setup>
import axios from 'axios';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import router from '@/router';

const basurl = 'https://partyqa.rrrexyz.icu';

// 定义响应式数据------------------------
const isOverlayVisible = ref(false);
const isDialogVisible = ref(false);
const isSummaryVisible = ref(false);
const cor_num = ref(0);
const used_time = ref(0)   // 计时器的时间（以秒为单位）
const isRunning = ref(true) // 计时器是否在运行
let intervalId = null        // 计时器ID
let userAnswer = '';

//填入初始格式
const questions = ref([{
    "text": "",
    "B": "",
    "D": "",
    "type": 0,
    "id": 3,
    "A": "",
    "C": "",
    "answer": ""
}]);
// 退出键start------------------------
// 函数：打开弹窗
const openDialog = () => {
    if (participate_status != 1) {
        isOverlayVisible.value = true;
        isDialogVisible.value = true;
    } else {
        router.push('/homepage');
    }

};

// 函数：退出
const exit = () => {
    isOverlayVisible.value = false;
    isDialogVisible.value = false;
    handleSubmit()
    router.push('/homepage');
};

// 函数：继续答题
const continueAnswer = () => {
    isOverlayVisible.value = false;
    isDialogVisible.value = false;
};
// 退出键end--------------------------

let Type;


//题目内容start----------------------------
// 计算属性：获取 questions 的长度
const questionCount = computed(() => questions.value.length);

//0未选中，1选中，2正确，3错误
const option_ele_state = ref([0, 0, 0, 0]);
const current_que = ref(0);

// 单多选显示判断
const questionType = (questions.value[current_que.value]['answer'].length == 1) ? '单选题' : '多选题'

const questionTitle = ref("")

const selectedOptions = ref([])

//点击选项触发的事件
function selected_op(op_i) {
    //如果是查看历史记录，则无法选中
    if (participate_status = 1) {
        return
    } else {
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
}

//检查答案对错
function checkout_answer() {
    let correctAnswer = questions.value[current_que.value]['answer'];
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
                    if (current_que.value < questions.value.length - 1) {
                        setTimeout(() => {
                            if (current_que.value < questions.value.length - 1) {
                                current_que.value++;
                                option_ele_state.value = [0, 0, 0, 0];
                            } else {
                                // 如果已经是最后一题，可以选择跳转到一个特定的页面或执行其他操作
                                stopTimer();
                                setTimeout(() => {
                                    isSummaryVisible.value = true;
                                }, 2000);
                            }
                        }, 2000); // 两秒后执行
                    }
                } else {
                    //选中且正确-2标绿
                    option_ele_state.value[i] = 2;
                    cor_num.value++;
                    //自动跳转下一题
                    if (current_que.value < questions.value.length - 1) {
                        current_que.value++;
                        option_ele_state.value = [0, 0, 0, 0];
                    } else {
                        //最后一题操作
                        stopTimer();
                        setTimeout(() => {
                            isSummaryVisible.value = true;
                        }, 2000);
                    }
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
                    if (current_que.value < questions.value.length - 1) {
                        setTimeout(() => {
                            if (current_que.value < questions.value.length - 1) {
                                current_que.value++;
                                option_ele_state.value = [0, 0, 0, 0];
                            } else {
                                //最后一题操作:停止计时,向后端发数据,跳转
                                stopTimer();
                                setTimeout(() => {
                                    isSummaryVisible.value = true;
                                }, 2000);
                                // router.push('user')
                            }
                        }, 2000);
                    }
                }
            }
            else {//正确选项
                if (option_ele_state.value[i] == 0) {
                    //未选中，标成红色-错误
                    option_ele_state.value[i] = 3;
                    if (current_que.value < questions.value.length - 1) {
                        current_que.value++;
                        option_ele_state.value = [0, 0, 0, 0];
                    } else {
                        //最后一题操作:停止计时,向后端发数据,跳转
                        stopTimer();
                        setTimeout(() => {
                            isSummaryVisible.value = true;
                        }, 2000);
                        // router.push('user')
                    }
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
                        if (current_que.value < questions.value.length - 1) {
                            current_que.value++;
                            option_ele_state.value = [0, 0, 0, 0];
                        } else {
                            //最后一题操作:停止计时,向后端发数据,跳转
                            stopTimer();
                            setTimeout(() => {
                                isSummaryVisible.value = true;
                            }, 2000);
                            // router.push('user')
                        }
                    }
                }
            }
        }

    }
}

//题目ens-------------------------------



const record = ref([
    {
        "question_id": 3,
        "user_answer": "B"
    }
])

let project_uuid;
let question_id;
let participate_status;
let user_cor_num;
let user_used_time;

const correctAnswers = ref([])

const userAnswers = ref([])

//做过题直接显示答案
const checkout_status = () => {
    if (participate_status = 1) {//直接显示做题记录
        // 获取当前问题的正确答案 转换为数组
        var correctAnswer = questions.value[current_que.value]['answer'];
        correctAnswers.value = correctAnswer
        // 获取用户的选择答案 转换为数组
        var userAnswer = record.value[current_que.value]['user_answer'];
        userAnswers.value = userAnswer;
        // console.log(questions.value[current_que.value])
        // console.log(correctAnswers.value)
        // console.log(userAnswers.value)
        // 遍历选项，比较用户答案和正确答案
        for (let i = 0; i < 4; i++) {
            const char = String.fromCharCode('A'.charCodeAt() + i);
            if (userAnswers.value.includes(char)) {// 用户选择了该选项
                if (correctAnswers.value.includes(char)) {// 选项正确
                    option_ele_state.value[i] = 2; // 已选择且正确-标绿
                } else {
                    // 用户选择了错误答案
                    option_ele_state.value[i] = 3; // 选择且错误-标红
                }
            } else {// 用户未选择该选项
                if (correctAnswers.value.includes(char)) {
                    // 该选项是正确的但用户未选择
                    option_ele_state.value[i] = 2; // 未选择但正确-标绿
                } else {
                    // 该选项是错误的且用户未选择
                    option_ele_state.value[i] = 0; // 未选择且错误-不管
                }
            }
        }
    } else {//做题
        startTimer()
        checkout_answer()
    }
}

function nextQ() {
    console.log(current_que.value)
    if (current_que.value == questionCount.value - 1) {
        console.log("no next page")
    } else {
        current_que.value += 1;
    }
    initData()
    checkout_status()
}


// 获取数据
const getData = async () => {
    console.log(current_que.value)
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
                record.value = data.record;
                project_uuid = data.uuid;
                question_id = data.questions.id;
                participate_status = data.participate_status;
                user_used_time = data.user_cor_num;
                user_cor_num = data.correct_num;
                initData()
                checkout_status()
                // console.log(selectedOptions)
            } else {
                console.error('获取数据失败:', response.data.message);
            }
            // console.log(questions.value)
        })
        .catch(error => {
            console.error('请求失败:', error);
        });
}

const initData = () => {
    questionTitle.value = questions.value[current_que.value]['text']
    selectedOptions.value = [
        questions.value[current_que.value]['A'],
        questions.value[current_que.value]['B'],
        questions.value[current_que.value]['C'],
        questions.value[current_que.value]['D']
    ]
}

// 提交数据
const handleSubmit = () => {
    axios.post(basurl + '/api/user/project', {
        "student_id": "202500993344",
        "project_uuid": project_uuid,
        "time_used_seconds": formatTime(used_time),
        "correct_num": cor_num.value,
        "user_answers": [
            {
                "question_id": question_id,
                "user_answer": userAnswer,
            },

        ]
    })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
        })
    router.push('/user')
}

//计时器start-----------------------------------------------------------
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
    isRunning.value = true
    intervalId = setInterval(() => {
        used_time.value++
    }, 1000)
}

// 停止计时器
const stopTimer = () => {
    if (!isRunning.value) return
    isRunning.value = false
    clearInterval(intervalId)
    intervalId = null
    console.log('计时已停止，时间:', formatTime(used_time))
}
//计时器end-----------------------------------------------------------

// 在组件挂载时自动启动计时器
onMounted(() => {
    getData()

    // startTimer()
    // fetchData()
    // validateParams()
})

// 在组件卸载时清理计时器
onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
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
        <img @click="openDialog" src="../assets/箭头(1).png" alt="" style="width: 15px;height: 28px;"
            class="clickable-image">
    </div>

    <!-- 退出弹窗遮罩层 -->
    <div class="overlay" :style="{ display: isOverlayVisible ? 'block' : 'none' }"></div>

    <!-- 退出弹窗 -->
    <div v-if="participate_status != 1" class="confirm-dialog" :style="{ display: isDialogVisible ? 'block' : 'none' }">
        <div class="dialog-title">
            <p>确定要退出答题？</p>
            <p>退出后后面题目会算作全错</p>
        </div>
        <div class="dialog-buttons">
            <button class="dialog-button exit" @click="exit">退出</button>
            <button class="dialog-button continue" @click="continueAnswer">继续</button>
        </div>
    </div>

    <!-- 总结页面弹窗遮罩层 -->
    <div class="overlay" :style="{ display: isSummaryVisible ? 'block' : 'none' }"></div>

    <!-- 总结页面弹窗 -->
    <div class="summary-dialog" :style="{ display: isSummaryVisible ? 'block' : 'none' }">
        <div class="dialog-title">
            <div>完成全部题目</div>
            <br>
            <div>用时:{{ formatTime(used_time) }}</div>
            <div>已答对{{ cor_num }}道题</div>
        </div>
        <div class="dialog-buttons">
            <button class="continueBtn" @click="handleSubmit">继续</button>
        </div>
    </div>

    <!-- 答题 -->
    <div class="main">
        <div class="quiz-container">
            <div class="description">
                <div id="leftside">
                    <div style="width: 5px;height: 23px;background-color: rgba(156, 12, 19, 1);"></div>
                    <div style="font-size: 19px;font-weight: bold;margin-left: 10px;">{{ questionType }}</div>
                </div>
                <div id="rightside">
                    <div>{{ current_que + 1 }}</div>
                    <div>/{{ questionCount }}</div>
                </div>
            </div>
            <div class="question">
                {{ questionTitle }}
            </div>
            <!-- :disabled="participate_status == 1 ? 'false' : 'true' " -->
            <div class="options">
                <div v-for="(i, index) in option_ele_state" :key="index">
                    <div :class="'op' + i" @click="selected_op(index)">
                        <!-- @touchend="selected_op(index)" -->
                        {{ String.fromCharCode('A'.charCodeAt() + index) }} :
                        {{ selectedOptions[index] }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 计时器 -->
    <div class="timer-container">
        <div class="time-display">{{ formatTime(used_time) }}</div>
    </div>

    <div class="generalBtn" @click="checkout_answer">
        <button>确定</button>
    </div>

    <div class="generalBtn" @click="nextQ" v-if="participate_status == 1">
        <button>下一题</button>
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
    margin: 0;
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
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgb(88, 88, 88);
    padding: 0;
    margin-bottom: 20px;
}

#leftside {
    display: flex;
    align-items: center;
}

#rightside {
    display: flex;
    align-items: flex-end;
    margin-bottom: 9px;
}

#rightside>div:first-child {
    font-size: 36px;
    vertical-align: bottom;
    margin-bottom: -5px;
    /* 调整数字1的位置 */
}

#rightside>div:last-child {
    font-size: 20px;
    color: rgba(165, 165, 165, 1);
    margin-left: 3px;
    /* 增加间距 */
    vertical-align: bottom;
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
    background: rgba(255, 255, 255, 1);
    padding-top: 20px;
    border-radius: 4px;
    width: 80%;
    text-align: center;
    display: none;
    z-index: 10;
}

.summary-dialog {
    width: 80%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 1);
    padding-top: 20px;
    border-radius: 4px;
    text-align: center;
    display: none;
    z-index: 10;
    font-size: 20px;
    font-weight: bold;
}

.summary-dialog-content {
    display: flex;
    flex-direction: column;
}

.continueBtn {
    width: 100%;
    height: auto;
    color: rgba(156, 12, 19, 1);
    background-color: rgba(255, 255, 255, 1);
    font-size: 20px;
    font-weight: bold;
    border: none;
}

.dialog-title {
    height: 50%;
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 15px;
    border-bottom: 1px solid rgb(216, 216, 216);
}

.dialog-buttons {
    width: 100%;
    height: auto;
    display: flex;
    font-weight: bold;
}

.dialog-button {
    width: 50%;
    padding: 18px 30px;
    font-size: 16px;
    border: none;
    background-color: rgba(255, 255, 255, 1);
    font-weight: bold;
}

.dialog-button.continue {
    color: rgba(156, 12, 19, 1);
}

.dialog-button.exit {
    color: rgba(112, 118, 116, 1);
    border-right: 1px solid rgb(216, 216, 216);
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

.generalBtn {
    position: fixed;
    top: 10px;
    width: 18rem;
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

.generalBtn button {
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
    background-color: rgba(156, 12, 19, 1);
    color: white;
}
</style>