<template>
    <div class="topBar">
        <Button class="backBtn" @click="onLeave">{{ $t('leave') }}</Button>
        <label>{{ $route.params.fileName }}</label>
        <slot name="top" style="position:absolute"/>
    </div>
    <div class="bottom">
        <div class='content'>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Project",
        created() {
            document.body.style.backgroundColor = "#333333";
        },
        methods: {
            onLeave(){
                this.$router.push({name: "project", params: {projectName: this.$route.params.projectName, fileType: "stories"}});
            }
        }
    };
</script>

<style lang='scss' scoped>
    .topBar {
        width: 100%;
        text-align: center;
        font-size: 50px;
        color: #E0E0E0;
        background-color: #222222;
        .backBtn {
            position: flex;
            float: left;
            left: 18px;
            top: 18px;
        }
    }

    .bottom {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        color: #E0E0E0;
    }
    
</style>