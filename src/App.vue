<template>
    <div id="container">
        <h1>{{initData}}</h1>
    </div>
</template>

<script>
export default {
    data() {
        return {
            initData: 'Vue test env'
        }
    }
}
</script>

<style scoped>
    #container {
        color: red;
        display: flex;
    }
</style>