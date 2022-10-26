<template>
    <LocaleSwitch class="locale-switch" />
    <div class="form-group">
        <div class='form-title' style="font-weight:bold">Asar</div>
        <br>
        <span class="p-float-label">
            <InputText type="text" v-model="username" />
            <label for="username">{{ $t('username') }}</label>
        </span>
        <br>
        <span class="p-float-label">
            <Password class="input-password" v-model="password" :feedback="false" toggleMask />
            <label for="password">{{ $t('password') }}</label>
        </span>
        <br>
        <Button @click="onLogin">{{ $t('login') }}</Button>
    </div>
</template>

<script>
    import { login } from '../assets/utils/backend.js'
    import { addMessage ,addBackendMessage } from '../assets/utils/message.js'

    export default {
        name: "Login",
        created() {
            document.body.style.backgroundColor = "#2C2F33"
            addMessage({severity: 'info', content: this.$t('welcomeMessage')})
        },
        data() {
            return { 
                username: "",
                password: "" 
            }
        },
        methods: {
            async onLogin(){
                let response = await login(this.username, this.password)
                if(response["access_token"]){
                    this.$router.push("/home");
                }
                addBackendMessage("/api.auth.login.", response, {test:123})
            }
        },
    };
</script>

<style lang="scss" scoped>
    .locale-switch {
        position: absolute;
        top: 18px;
        left: 24px;
        z-index: 30;
    }
    .form-group {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 320px;
        padding: 20px;
        transform: translate(-50%, -50%);
        background: #6577C4;
        box-sizing: border-box;
        box-shadow: 0 15px 25px rgba(0,0,0,.6);
        border-radius: 10px;
        text-align: center;
        line-height: 25px;
    }
    label {
        padding-left: 40px;
    }
    .form-title {
        font-size: 34px;
    }
    .p-input-icon-right:deep(.p-inputtext) {
        padding-right: 0.429rem;
    }
</style>
