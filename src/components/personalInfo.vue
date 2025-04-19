<script setup>
import axios from 'axios'
import { defineProps, defineEmits, ref, watch } from 'vue'
// 选中的选项
const selectedFacultad = ref('')
const selectedCurso = ref('')
const selectedClase = ref('')

const basurl = 'https://partyqa.rrrexyz.icu';
const party_branch = ref('');

// 定义接收的属性
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    selectedFacultad: {
        type: String,
        default: ''
    },
    selectedCurso: {
        type: String,
        default: ''
    },
    selectedClase: {
        type: String,
        default: ''
    }
});

// 定义触发的自定义事件
const emit = defineEmits(['update:visible', 'update:selectedFacultad', 'update:selectedCurso', 'update:selectedClase'])

// 定义选项数据
const facultades = ref(['外国语', '医', '土建', '历史'])
const cursos = ref([24, 23, 22, 21])
const clases = ref(['专业1', '专业2', '专业3', '专业4'])

// 控制弹出框的显示与隐藏
const isVisible = ref(props.visible)

// 监听 visible 属性的变化
watch(() => props.visible, (newVal) => {
    isVisible.value = newVal
})

// 关闭弹出框
const closePopup = () => {
    isVisible.value = false
    emit('update:visible', false)
}

// 确认选择
const confirmSelection = () => {
    if (selectedFacultad.value && selectedCurso.value && selectedClase.value) {
        const partyBranch = `${selectedFacultad.value}学院${selectedCurso.value}级${selectedClase.value}班党支部`;
        emit('update:selectedFacultad', selectedFacultad.value);
        emit('update:selectedCurso', selectedCurso.value);
        emit('update:selectedClase', selectedClase.value);
        closePopup();
        axios.post( basurl + '/api/user', {
            name: "",
            student_id: "",
            party_branch: partyBranch,
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('获取数据失败:', error);
            });
    } else {
        alert('请选择正确个数的选项');
    }
};
</script>

<template>
    <div v-if="visible" class="popup-overlay" @click.self="closePopup">
        <div class="popup-content" @click.stop>
            <h2>请选择选项</h2>
            <div class="options">
                <div class="column">
                    <div v-for="facultad in facultades" :key="facultad">
                        <label>
                            <input type="radio" v-model="selectedFacultad" :value="facultad" name="facultad" />
                            {{ facultad }}
                        </label>
                    </div>
                </div>
                <div class="column">
                    <div v-for="curso in cursos" :key="curso">
                        <label>
                            <input type="radio" v-model="selectedCurso" :value="curso" name="curso" />
                            {{ curso }}
                        </label>
                    </div>
                </div>
                <div class="column">
                    <div v-for="clase in clases" :key="clase">
                        <label>
                            <input type="radio" v-model="selectedClase" :value="clase" name="clase" />
                            {{ clase }}
                        </label>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <button @click="closePopup">取消</button>
                <button @click="confirmSelection">确定</button>
            </div>
        </div>
    </div>
</template>


<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* 半透明背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    width: 600px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.options {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.column {
    flex: 1;
    margin: 0 10px;
}

.column div {
    margin-bottom: 10px;
}

.buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

button:first-child {
    background-color: #dc3545;
    color: #fff;
}

button:last-child {
    background-color: #28a745;
    color: #fff;
}
</style>