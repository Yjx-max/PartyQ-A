<script setup>
import { ref, onBeforeMount, onMounted } from 'vue';
import axios from 'axios';

const basurl = 'https://partyqa.rrrexyz.icu';

onMounted(() => {
    name.value = localStorage.getItem("name")
    student_id.value = localStorage.getItem("student_id")
    fetchRanks();
    fetchAllRanks();
});

const name = ref('')

const student_id = ref()
const current = ref([]);
const my_current = ref({});
const allRank = ref([]);
const my_all = ref([]);
const activeTab = ref('Tab1');
const myrank = ref()

const tabs = ref([
    { id: 'Tab1', name: '当前排行榜' },
    { id: 'Tab2', name: '往期排行榜' },
]);

const openTab = (tabId) => {
    activeTab.value = tabId
};

function fetchRanks() {
    console.log(student_id.value)
    axios.get(basurl + '/api/ranking', {
        params: {
            "student_id": student_id.value
        }
    })
        .then((response) => {
            if (response.data && response.data.data && response.data.data.ranking && response.data.data.self_ranking) {
                // console.log(response.data.data.self_ranking)
                current.value = response.data.data.ranking;
                my_current.value = response.data.data.self_ranking;
                myrank.value = response.data.data.self_ranking.rank
                console.log(typeof (myrank.value))
                console.log(myrank.value)
                console.log(typeof (current.value[1]['rank']))
                console.log(current.value[1]['rank'])
                console.log(myrank.value == current.value[1]['rank'])
                if (response.data.data.self_ranking.student_id == undefined) {
                    console.log("empty")
                    my_current.value = {
                        correct_num: 0,
                        name: name.value,
                        rank: 999,
                        student_id: student_id.value,
                        time_used_seconds: 9999,
                    }
                }
            } else {
                console.error('响应数据格式不正确');
            }
        })
        .catch((error) => {
            console.error('获取数据失败:', error);
        });
}

function fetchAllRanks() {
    axios.get(basurl + '/api/ranking/all', {
        params: {
            student_id: student_id.value
        }
    })
        .then((response) => {
            if (response.data && response.data.data && response.data.data.ranking && response.data.data.self_ranking) {
                allRank.value = response.data.data.ranking;
                my_all.value = response.data.data.self_ranking;
                console.log(response.data.data)
            } else {
                console.error('响应数据格式不正确');
            }
        })
        .catch((error) => {
            console.error('获取数据失败:', error);
        });
}
</script>

<template>
    <!-- 当前和往期的tab切换 -->
    <div class="parent">
        <div v-for="(tab, index) in tabs" :key="index" :class="['rank-item', { active: activeTab == tab.id }]"
            @click="openTab(tab.id)">
            {{ tab.name }}
        </div>
    </div>

    <!-- 排行榜  i.rank == myrank.value-->
    <div class="mainContect">
        <div class="bar">
            <ul>
                <li>排名</li>
                <li>用户名</li>
                <li>正确数</li>
                <li>平均用时</li>
            </ul>
        </div>
        <!-- 当前 -->
        <div v-for="(i, index) in current" v-if="activeTab === 'Tab1'" class="data" :key="index"
            :class="[(i.rank == myrank) ? 'mymyrank' : 'others']">
            <div style="color: rgba(95, 91, 91, 1); opacity: 0.4;">{{ i.rank }}</div>
            <div>{{ i.name }}</div>
            <div style="color: rgba(95, 91, 91, 1);">{{ i.correct_num }}</div>
            <div>{{ i.time_used_seconds }}</div>
        </div>
        <!-- 往期 -->
        <div v-for="(j, index) in allRank" v-if="activeTab === 'Tab2'" :key="index" class="data">
            <div style="color: rgba(95, 91, 91, 1); opacity: 0.4;">{{ j.rank }}</div>
            <div>{{ j.name }}</div>
            <div style="color: rgba(95, 91, 91, 1);">{{ j.total_correct_num }}</div>
            <div>{{ j.average_time_used_seconds }}</div>
        </div>
    </div>

    <!-- 我的排名 -->
    <!-- 当前 -->
    <!-- v-for="(i, index) in my_current"  :key="index"-->
    <div v-if="activeTab === 'Tab1'" class="miranking">
        <div style="color: rgba(95, 91, 91, 1); opacity: 0.4;">{{ my_current.rank }}</div>
        <div>{{ my_current.name }}</div>
        <div style="color: rgba(95, 91, 91, 1);">{{ my_current.correct_num }}</div>
        <div>{{ my_current.time_used_seconds }}</div>
    </div>
    <!-- 往期 -->
    <div v-if="activeTab === 'Tab2'" class="miranking">
        <div style="color: rgba(95, 91, 91, 1); opacity: 0.4;">{{ my_all.rank }}</div>
        <div>{{ my_all.name }}</div>
        <div style="color: rgba(95, 91, 91, 1);">{{ my_all.total_correct_num }}</div>
        <div>{{ my_all.average_time_used_seconds }}</div>
    </div>

</template>


<style>
body {
    margin: 0;
    padding: 0;
}

.mymyrank {
    background-color: rgb(227, 255, 255);
}

.others {
    background-color: white;
}

.parent {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    font-size: 15px;
    line-height: 40px;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid rgba(228, 228, 228, 1);
}

.rank-item {
    cursor: pointer;
    color: rgba(0, 0, 0, 1);
}

.rank-item.active {
    color: rgba(156, 12, 19, 1);
}

.mainContect {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
}

.bar ul {
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-around;
    text-align: center;
}

.bar {
    width: 100%;
    height: 40px;
    font-size: 16px;
    padding: 0 20px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(95, 91, 91, 0.4);
    color: rgba(156, 12, 19, 1);
}

.bar ul li {
    line-height: 40px;
    width: 70px;
}

.data {
    width: 100%;
    height: 34px;
    line-height: 34px;
    font-size: 16px;
    display: flex;
    justify-content: space-around;
    padding: 0 20px;
    box-sizing: border-box;
}

.data div {
    width: 60px;
    text-align: center;
}

.miranking {
    opacity: 100%;
    background-color: white;
    width: 90%;
    height: 71px;
    line-height: 71px;
    font-size: 16px;
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