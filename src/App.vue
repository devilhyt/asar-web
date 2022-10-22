<template>
    <LocaleSwitch class="locale-switch" />
    <CustomMessage :messages="messages"/>
    <Suspense>
        <router-view />
    </Suspense>
</template>

<script>
    import { messages } from './assets/utils/message.js'

    export default {
        name:["App"],
        created() {
            document.body.style.backgroundColor = "#333333"
        },
        setup(){
            return {
                messages: messages.value
            }
        }
    }
</script>


<style >
    @import url("assets/noto.css");

    .locale-switch{
        position: absolute;
        bottom: 18px;
        left: 46px;
        z-index: 30;
    }

    body, html {
        height: 100%;
        overflow: hidden;
        margin: 0;
    }

    #app {
        font-family: 'Noto Sans TC', '微軟正黑體', sans-serif;
        color: #000000;
    }

    nav {
        padding: 30px;
    }

    nav a {
        font-weight: bold;
        color: #2c3e50;
    }

    nav a.router-link-exact-active {
        color: #42b983;
    }
</style>
