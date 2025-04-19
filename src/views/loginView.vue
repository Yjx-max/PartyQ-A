<script setup>
import Login from "@/components/login.vue";
</script>

<template>
    <div class="bgimg"></div>
    <div class="log">
        <Login />
    </div>

</template>

<style>
body {
    margin: 0;
}

.bgimg {
    position: fixed;
    width: 100vw;
    height: 100vh;

    z-index: -10000;
    background-image: url(../assets/log.png);
    background-size: cover;
    background-position: top;
    background-repeat: no-repeat;
}

.log {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>