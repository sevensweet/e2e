<template>
    <div class="parent">
        <div class="child1">
            <div class="subChild">1-1</div>
            <!-- <div class="subChild">1-2</div> -->
            <div class="subChild subChildTwo">1-3</div>
        </div>
        <div class="child2">2</div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
    .parent {
        display: grid;
        /* 左右两边布局 */
        grid-template-columns: 1.05fr 0.95fr;
        gap: 16px;
        padding: 16px;
        box-sizing: border-box;
        background-color: pink;

    }

    .child1 {
        background-color: orange;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
    }

    .child1 > .subChild {
        background-color: lightgreen;
    }

    .child1 > .subChildTwo {
       grid-column: span 2;
    }

    .child2 {
        background-color: lightblue;
    }
</style>