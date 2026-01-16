<template>
    <div class="parent">
        <div class="child">1</div>
        <div class="child">2</div>
        <div class="child">3</div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
    .parent {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        padding: 16px;
        box-sizing: border-box;
        background-color: pink;

    }

    .child {
        background-color: orange;
    }
</style>