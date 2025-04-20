<script setup>
import axios from "axios";
import { UploadFilled } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx';
import { reactive, ref, toRaw } from 'vue'
import { ElMessage } from "element-plus";

const request = axios.create({
    baseURL: "https://dangjian.0linetekcenter.tech/api"
})

const register = async () => {
    try {
        const response = await request.post('/admin/register',
            {
                "username": "qqq",
                "password": "qqq"
            }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log({ response })
    } catch (error) {
        console.error({ error })
    }
}

const login = async () => {
    try {
        const response = await request.post('/admin/login',
            {
                "grant_type": "password",
                "username": "qqq",
                "password": "qqq"
            }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        console.log({ response })
        setToken(response.data.data.access_token, response.data.data.refresh_token)
    } catch (error) {
        console.error({ error })
    }
}

const setToken = (access_token, refresh_token) => {
    request.defaults.headers["Authorization"] = `Bearer ${access_token}`
    console.log(access_token)
    localStorage.setItem("access_token", access_token)
    localStorage.setItem("refresh_token", refresh_token)
}

const creatQuestion = async (data) => {
    try {
        const response = await request.post('/admin/project', data, {
            headers: {
                "Content-Type": "application/json"
            }
        }
        )
        console.log({ response })
    } catch (error) {
        console.error({ error })
    }
}

const handleFileChange = (uploadFile) => {
    console.log('success')
    const file = uploadFile.raw
    if (!file) return;

    const isExcel = file.name.match(/\.(xlsx|xls)$/i);
    if (!isExcel) {
        ElMessage.error('仅支持Excel文件');
        return;
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // 获取第一张表
            const firstSheetName = workbook.SheetNames[0];
            const secondSheetName = workbook.SheetNames[1];
            const firstworksheet = workbook.Sheets[firstSheetName];
            const secondworksheet = workbook.Sheets[secondSheetName]

            // 转换为JSON数据（二维数组）
            const jsonData1 = XLSX.utils.sheet_to_json(firstworksheet, { header: 1 });

            const tableHeader1 = ref()

            const tableData1 = ref()
            // 提取表头和表格数据
            if (jsonData1.length > 0) {
                tableHeader1.value = jsonData1[0]; // 假设第一行为表头
                tableData1.value = jsonData1.slice(1).map(row => {
                    return tableHeader1.value.reduce((obj, key, index) => {
                        obj[key] = row[index] || '';
                        return obj;
                    }, {});
                });
            }

            // 转换为JSON数据（二维数组）
            const jsonData2 = XLSX.utils.sheet_to_json(secondworksheet, { header: 1 });

            const tableHeader2 = ref()

            const tableData2 = ref()
            // 提取表头和表格数据
            if (jsonData2.length > 0) {
                tableHeader2.value = jsonData2[0]; // 假设第一行为表头
                tableData2.value = jsonData2.slice(1).map(row => {
                    return tableHeader2.value.reduce((obj, key, index) => {
                        obj[key] = row[index] || '';
                        return obj;
                    }, {});
                });
            }

            console.log(tableData1.value)
            console.log(tableData2.value)

            let tempForm = toRaw(tableData1.value[0])

            let tempQuestion = toRaw(tableData2.value)

            console.log(tempQuestion)

            for (let index = 0; index < tempQuestion.length; index++) {
                if (tempQuestion[index].type == '单选题') {
                    tempQuestion[index].type = 0
                } else if (tempQuestion[index].type == '多选题') {
                    tempQuestion[index].type = 1
                } else {
                    ElMessage.error('数据格式错误')
                }
                console.log(typeof (tempQuestion[index].A))
                if (typeof (tempQuestion[index].A) == 'number') {
                    tempQuestion[index].A = String(tempQuestion[index].A)
                }
                if (typeof (tempQuestion[index].B) == 'number') {
                    tempQuestion[index].B = String(tempQuestion[index].B)
                }
                if (typeof (tempQuestion[index].C) == 'number') {
                    tempQuestion[index].C = String(tempQuestion[index].C)
                }
                if (typeof (tempQuestion[index].D) == 'number') {
                    tempQuestion[index].D = String(tempQuestion[index].D)
                }
            }


            let form = { ...tempForm, ...{ questions: tempQuestion } }
            // console.log(tempForm)
            // console.log(tempQuestion)
            console.log(form)
            ElMessage.success('文件解析成功');

            creatQuestion(form)
            // 此处可提交数据到后端
            // await submitData(jsonData);

        } catch (error) {
            ElMessage.error('文件解析失败: ' + error.message);
            console.log(error.message)
        }
    };
    reader.onerror = () => {
        ElMessage.error('文件读取失败');
    };

    reader.readAsArrayBuffer(file);
}


</script>

<template>
    <div class="btnDiv">
        <el-button class="btnStyle" type="primary" @click="register">注册管理员账号</el-button>
        <el-button class="btnStyle" type="primary" @click="login">登录</el-button>
    </div>
    <div class="formDiv">

        <el-upload ref="uploadRef" class="upload-demo" :auto-upload="false" :on-change="handleFileChange">
            <template #trigger>
                <el-button type="primary">select file and create project</el-button>
            </template>

            <!-- <el-button style="position: relative;left: 30px;" class="ml-3" type="success" @click="handleFileChange">
                upload to server
            </el-button> -->
        </el-upload>

    </div>

</template>

<style scoped>
.btnDiv {
    position: relative;
    padding: 20px 80px;
    display: flex;
    flex-direction: column;
}

.btnStyle {
    margin: 0;
    padding: 0;
    margin: 15px;
}

.formDiv {
    margin: 0;
    width: 80%;
    padding: 0 10%;
}

/* .formDiv div {
    width: 80%;
} */
</style>