<template>
    <div class="message">
        <Message v-for="msg of messages" :sticky="false" :life="6000" :icon="msg.icon" :severity="msg.severity" :key="msg">{{ msg.content }}</Message>
    </div>
</template>

<script>
    export default {
        props: ["messages"],
        watch: {
            messages: {
                deep: true,
                handler(){
                    if(this.$props.messages.length > 5){
                        this.$props.messages.shift()
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .message {
        position: absolute;
        z-index: 100;
        right: 14px;
        bottom: 0px;
        width: 350px;
    }
</style>>