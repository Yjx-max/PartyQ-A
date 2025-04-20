<script setup>
import Tab from '@/components/tab.vue'
import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from '@/router';

const baseurl = 'https://dangjian.0linetekcenter.tech';

function fetchAllQA() {
    axios.get(baseurl + '/api/user/projects/all')
        .then((response) => {
            if (response.data && response.data.data) {
                allQA.value = response.data.data;
            } else {
                console.error('响应数据1格式不正确');
            }
        })
        .catch((error) => {
            console.error('获取数据1失败:', error);
        })
};

function fetchQA() {
    axios.get(baseurl + '/api/user/projects/participate', {
        params: {
            student_id: student_id.value
        }
    })
        .then((response) => {
            if (response.data && response.data.data) {
                QA.value = response.data.data;
            } else {
                console.error('响应数据2格式不正确');
            }
        })
        .catch((error) => {
            console.error('获取数据2失败:', error);
        })
};

const student_id = ref("")

onMounted(() => {
    student_id.value = localStorage.getItem("student_id")
    fetchAllQA();
    fetchQA();
});

const activeTab = ref('Tab1');

const tabs = ref([
    { id: 'Tab1', name: '所有问答' },
    { id: 'Tab2', name: '已完成问答' },
]);

const allQA = ref([])
const QA = ref([])

const openTab = (tabId) => {
    activeTab.value = tabId;
};

//0：未开始，1：进行中，2：已结束
// 获取状态文本
const getStatusText = (status) => {
    switch (status) {
        case 0:
            return '未开始'
        case 1:
            return '进行中'
        case 2:
            return '已结束'
        default:
            return '未知状态'
    }
}

// 获取状态对应的 CSS 类
const getStatusClass = (status) => {
    switch (status) {
        case 0:
            return 'status0'
        case 1:
            return 'status1'
        case 2:
            return 'status2'
        default:
            return 'status0'
    }
}
</script>

<template>
    <Tab />

    <!-- 标签栏 -->
    <div class="guide">
        <ul>
            <li v-for="(tab, index) in tabs" :key="index" :class="['tab-link', { active: activeTab == tab.id }]"
                @click="openTab(tab.id)">{{ tab.name }}
            </li>
        </ul>
    </div>

    <!-- 所有 总的 -->
    <div v-for="(i, index) in allQA" :key="index" :id="i.id" class="tab-content" v-if="activeTab === 'Tab1'"
        @click="router.push('/qst')">
        <div class="present">
            <div id="first-line">
                <div id="name">问答名称: {{ i.name }}</div>
                <div :class="getStatusClass(i.status)">{{ getStatusText(i.status) }}</div>
            </div>
            <div id="second-line">
                <div>
                    <div>开始时间: {{ i.starttime }}</div>
                    <div>截止时间: {{ i.deadline }}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 所有已开始项目列表 -->
    <div v-for="(i, index) in QA" :key="index" :id="i.id" class="tab-content" v-if="activeTab === 'Tab2'"
        @click="router.push('/qst')">
        <div class="present">
            <div id="first-line">
                <div id="name">问答名称: {{ i.name }}</div>
                <div :class="getStatusClass(i.status)">{{ getStatusText(i.status) }}</div>
            </div>
            <div id="second-line">
                <div>
                    <div>开始时间: {{ i.starttime }}</div>
                    <div>截止时间: {{ i.deadline }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.guide {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid rgba(228, 228, 228, 1);
}

.guide ul {
    width: 100%;
    height: 40px;
    list-style: none;
    display: flex;
    position: relative;
    padding: 0;
    margin: 0;
}

.guide ul li {
    width: 30%;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 0 15px 0 20px;
    cursor: pointer;
}

.tab-link {
    flex: 1;
    padding: 10px;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
    transition: 0.3s;
}

.tab-link.active {
    background-color: #ffffff;
    color: rgba(156, 12, 19, 1);
}

.tab-content {
    /* 这里设置成none才行 */
    padding: 20px;
}

.present {
    width: 90%;
    height: 125px;
    border: 1px solid rgba(228, 228, 228, 1);
    font-size: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;
    border-radius: 1rem;
    margin-bottom: 10px;
}

#first-line {
    width: 100%;
    height: 125px;
    display: flex;
    justify-content: space-between;
}

#name {
    position: relative;
    top: 5px;
}

#second-line {
    width: 100%;
    height: 125px;
    display: flex;
    justify-content: space-between;
}

.status0 {
    height: 20px;
    background-color: rgba(244, 244, 245, 1);
    padding: 5px 10px;
    border-radius: 15px;
    color: rgba(199, 201, 204, 1);
    border: 1px solid rgba(199, 201, 204, 1);
}

.status1 {
    height: 20px;
    line-height: 20px;
    background-color: rgba(240, 249, 235, 1);
    color: rgba(103, 194, 58, 1);
    padding: 5px 10px;
    border-radius: 15px;
}

.status2 {
    height: 20px;
    line-height: 20px;
    background-color: rgba(254, 240, 240, 1);
    padding: 5px 10px;
    border-radius: 15px;
    color: rgba(245, 108, 108, 1);
}
</style>
