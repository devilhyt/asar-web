<script setup>
    import { Handle, Position } from '@braks/vue-flow'

    defineProps({
        id: String,
    })
</script>

<template>
    <div class='node'>
        <div>{{ $t('start') }}</div>
        <Handle :id="id + '_out'" type="source" :position="Position.Bottom" />
    </div>
</template>

<style scoped lang="scss">
    .node {
        color: #0000ff;
        background-color: white;
        padding: 10px;
        border-radius: 3px;
        width: 180.1px;
        font-size: 12px;
        text-align: center;
        border-width: 0.5px;
        border-style: solid;
        border-color: var(#222222);
    }
</style>