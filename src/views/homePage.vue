<script setup>
</script>

<template>
    <div class="imgDiv">
        <div class="xx"><img src="../assets/xx.png" alt=""></div>

        <h1>党建问答</h1>

        <div class="btn">
            <div class="option">
                <button class="button-container" @click="() => $router.push('/qst')">开始答题</button>
                <button class="button-container" @click="() => $router.push('/user')">个人中心</button>
            </div>
        </div>
    </div>

</template>

<style>
.imgDiv {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background-image: url(../assets/hmpg.png);
    background-size: cover;
    background-position: top right;
    background-repeat: no-repeat;
}

.xx {
    position: absolute;
    top: 1rem;
    right: 1rem;
}

.xx img {
    width: 111px;
    height: 38px;
    padding: 9px;
    float: right;
}

h1 {
    font-size: 2.7rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 160px;
    color: rgba(255, 255, 255, 1);
}

.btn {
    width: 100%;
    display: flex;
    justify-content: center;
    height: auto;
    position: absolute;
    bottom: 17vh;
}

.option {
    width: 158px;
    height: auto;
    display: block;
}

.button-container {
    margin: 20px;
    padding: 10px 30px;
    border-radius: 20px;
    width: 138px;
    height: 52px;
    border: 0;
    font-size: 16px;
    font-weight: bold;
    box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.5);
}
</style>