<template>
    <select class="switch" v-model="lang">
        <option value="en_US">English</option>
        <option value="zh_TW">繁體中文</option>
    </select>
</template>

<script>
    import { ref,watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    
    export default {
        name: "LocalSwitch",
        props: ["messages"],
        setup() {
            const lang = ref(localStorage.getItem("locale"))
            const { locale } = useI18n()

            watch(lang, (newlocale) => {
                localStorage.setItem("locale", newlocale);
                locale.value = newlocale
            });

            return {
                lang: lang,
            }
        }
    };
</script>

<style scoped>
    .switch {
        width: 100px;
        height: 36.72px;
        text-align: center;
        background-color: #333333;
        color: #E0E0E0;
    }
</style>
