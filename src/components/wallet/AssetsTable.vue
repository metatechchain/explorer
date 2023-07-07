<template>
  <div>
    <table class="w-assets-table mt-10" :class="{ 'with-header': `${bold}` }">
      <tr
        v-for="(row, x) in tableData2"
        :key="x"
        :class="{ bold: bold && x === 0 }"
      >
        <td v-for="(col, y) in row" :key="y" :data-th="tableData2[0][y].value">
          {{ tableData2[x][y].value }}
        </td>
      </tr>
    </table>
    <div class="no-items" v-if="tableData2.length <= 1">No items</div>
  </div>
</template>
        
        <script>
export default {
  name: "assets-table",
  data() {
    return {
      bold: true,
      tableData2: [
        [
          { value: "Assets" },
          { value: "Available" },
          { value: "Deposited" },
          { value: "Borrowed" },
        ],
      ],
    };
  },
};
</script>