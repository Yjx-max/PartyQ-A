<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';
import Rank from '@/components/rankView.vue'

import { Picker } from '@varlet/ui'
import { changeUser, getParty } from '@/ulits/http.js';

const name = ref('');
const student_id = ref('')

// 存储选中的选项
const selectedCollege = ref('')
const selectedSubject = ref('')
const selectedClass = ref('')

const party_branch = ref('')


async function picker() {
    const { College, Subject, Class } = await Picker({
        cascade: true,
        columns: [
            {
                text: '土建与水利学院',
                children: [
                    {
                        text: '工程力学',
                        children: [
                            {
                                text: '22级',
                            },
                            {
                                text: '23级',
                            },
                        ],
                    }, {
                        text: '土木，水利与海洋',
                        children: [
                            {
                                text: '22级',
                            },
                            {
                                text: '23级',
                            },
                        ],
                    }, {
                        text: '建筑学',
                        children: [
                            {
                                text: '22级',
                            },
                            {
                                text: '23级',
                            },
                        ],
                    }
                ],
            },
            {
                text: '齐鲁交通学院',
                children: [
                    {
                        text: '城市地下空间',
                        children: [
                            {
                                text: '22级',
                            },
                            {
                                text: '23级',
                            },
                        ],
                    }, {
                        text: '智能建造与智慧交通',
                        children: [
                            {
                                text: '22级',
                            },
                            {
                                text: '23级',
                            },
                        ],
                    }, {
                        text: '工程软件',
                        children: [
                            {
                                text: '22级',
                            },
                            {
                                text: '23级',
                            },
                        ],
                    }
                ],
            },
        ],
        onConfirm(values) {
            console.log(values)
            //更新党支部信息
            selectedCollege.value = values[0]
            selectedSubject.value = values[1]
            selectedClass.value = values[2]
            console.log(selectedClass.value)
            //发送请求更新党支部信息$[selectedClass]$[selectedSubject]['selectedCollege']
            var data = {
                "name": name.value,
                "student_id": student_id.value,
                "party_branch": `山东大学${selectedCollege.value}${selectedClass.value}${selectedSubject.value}党支部`
            }
            //更新页面党支部信息
            party_branch.value = `山东大学${selectedCollege.value}${selectedClass.value}${selectedSubject.value}党支部`
            console.log(data)
            changeUser(data)
        },

    })
}

const getData = () => {
    student_id.value = localStorage.getItem("student_id")
    name.value = localStorage.getItem("name")
    let userId = student_id.value
    getParty(userId).then(
        (res) => {
            // let party_branch = res
            party_branch.value = res
            // console.log(party_branch)
        }
    )
    // .then(() => {
    //     console.log(temp)
    // })


    // selectedCollege.value = temp
    // selectedClass.value = temp
    // selectedSubject.value = temp
}

onMounted(() => {
    getData()
})
</script>

<template>
    <!-- tab栏 -->
    <div class="tab">
        <img src="../assets/箭头.png" alt="" style="width: 15px;height: 28px;" class="arrow"
            @click="() => { router.push('/homepage') }">
        <img src="../assets/xx.png" alt="">
    </div>

    <!-- 个人信息展示 -->
    <div class="basic">
        <div class="information" style="font-size: 24px;font-weight: bold;">{{ name }}</div>
        <div class="information" style="margin-top: 10px;font-size: 20px;">{{ student_id }}</div>
        <div class="information" style="margin-top: 10px;font-size: 15px;font-weight: bold;">
            <div v-if="party_branch">
                <!-- <div>山东大学{{ selectedCollege }}{{ selectedClass }}{{ selectedSubject }}党支部</div> -->
                <div>{{ party_branch }}</div>
            </div>
        </div>
    </div>

    <!-- 两个功能 -->
    <div class="function">
        <div class="function-item" id="mid" @click="() => { router.push('/allQA') }">
            <img src="../assets/2.png" alt="">
            <div style="font-size: 15px;">所有问答</div>
        </div>
        <div class="function-item" @click="picker">
            <img src="../assets/3.png" alt="">
            <div style="font-size: 15px;">修改党支部信息</div>
            <!-- <var-button type="primary" block @click="picker">级联选择</var-button> -->
        </div>
    </div>

    <!-- 排行榜 -->
    <div style="position: relative;top: -50px;">
        <Rank />
    </div>

</template>

<style scoped>
.tab {
    width: 100%;
    height: 61px;
    background-color: #9C0C13;
    display: flex;
    justify-content: space-between;
    padding: 0 22px;
    box-sizing: border-box;
}

.tab img {
    width: 105px;
    height: 32px;
    line-height: 61px;
    position: relative;
    top: 17px;
    left: 9px;
}

.arrow {
    float: left;
}

.basic {
    width: 100%;
    height: 135px;
    background-color: #9C0C13;
    color: #ffffff;
    margin: 0;
    padding: 20px 0 45px 0px;
}

.information {
    padding: 0 40px;
}

.function {
    width: 82%;
    height: 89px;
    position: relative;
    margin: 0 auto;
    /* 水平居中 */
    top: -50px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 5px;
    box-shadow: 0 4px 10px #515151a2;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-left: 30px;
    padding-right: 30px;
    box-sizing: border-box;
}

.function-item img {
    width: 30px;
    height: 30px;
}

.function-item {
    width: auto;
    height: 54px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 13px;
    padding: 15px;
}

.popup-overlay {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: auto;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.miranking {
    width: 90%;
    height: 71px;
    line-height: 71px;
    font-size: 20px;
    border-radius: 5px;
    box-shadow:
        inset 0 4px 4px rgba(0, 0, 0, 0.25),
        0 4px 4px rgba(0, 0, 0, 0.25);
    position: fixed;
    bottom: 10px;
    left: 50%;
    /* 将左边缘定位到视口宽度的50% */
    transform: translateX(-50%);
    /* 通过向左移动自身宽度的50%来居中 */
    display: flex;
    justify-content: space-around;
}
</style>