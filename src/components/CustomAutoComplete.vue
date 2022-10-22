<template>
    <AutoComplete v-model="selectedItem" :forceSelection='true' :suggestions="filteredItems" @complete="searchItems" dropdown/>
</template>

<script>
    export default{
        props:["data_list"],
        data() {
            return {
                selectedItem: null,
                filteredItems: null,
            }
        },
        methods: {
            searchItems(event) {
                let query = event.query;
                let filteredItems = [];

                for(let i = 0; i < this.data_list.length; i++) {
                    let data = this.data_list[i];
                    if (data.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                        filteredItems.push(data);
                    }
                }
                this.filteredItems = filteredItems;
            }
        },
        watch: {
            selectedItem(){
                this.$emit('onChange')
            }
        }
    }
</script>