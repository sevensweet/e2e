<template>
    <div class="parent">
        <div class="child">1-1</div>
            <div class="child">1-2</div>
            <div class="child">1-3</div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
    .parent {
        display: grid;
        /* 左右两边布局 */
        /* grid-template-columns: repeat(auto-fill, minmax(500px, 800px)); */
         grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
        gap: 16px;
        padding: 16px;
        box-sizing: border-box;
        background-color: pink;

    }

    .child {
        background-color: purple;
    }

</style>