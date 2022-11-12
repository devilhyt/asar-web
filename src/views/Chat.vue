<script setup>
    import { onMounted, onBeforeUnmount } from 'vue'


    let url = window.location.origin
    
    let chat = document.createElement('script')
    chat.src = 'https://unpkg.com/@rasahq/rasa-chat'
    chat.type = 'application/javascript'

    onMounted(()=>{
        document.head.appendChild(chat)
    })

    onBeforeUnmount(()=>{
        chat.parentNode.removeChild(chat)
        document.getElementById('rasa-chat-widget-container').remove()
    })

    function listen(fn){
        fn = fn || console.log
        let property = Object.getOwnPropertyDescriptor(MessageEvent.prototype,"data")
        const data = property.get
        function lookAtMessage(){
            let socket = this.currentTarget instanceof WebSocket
            if(!socket){
                return data.call(this)
            }
            let msg = data.call(this)
            Object.defineProperty(this,"data",{value: msg})
            fn({data: msg, socket: this.currentTarget, event: this})
            return msg
        }
        property.get = lookAtMessage
        Object.defineProperty(MessageEvent.prototype,"data", property)
    }
    // listen(({data}) => console.log(data))
</script>

<template>
    <div id="rasa-chat-widget" :data-websocket-url="url + '/rasa/socket.io'"></div>
</template>