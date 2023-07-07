<template>
  <div>
    <table class="w-erc20-table mt-10" :class="{ 'with-header': `${bold}` }">
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
  </div>
</template>
  
  <script>
export default {
  name: "erc20-table",
  data() {
    return {
      bold: true,
      tableData2: [
        [
          { value: "TX Hash" },
          { value: "Time" },
          { value: "Address" },
          { value: "Amount" },
          { value: "Type" },
          { value: "Token" },
        ],
        [
          { value: "No Item" },
          { value: "No Item" },
          { value: "No Item" },
          { value: "No Item" },
          { value: "No Item" },
          { value: "No Item" },
        ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "100,000,000.00" },
        //   { value: "Burn" },
        //   { value: "MTC Test Token (NTT)" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "100,000,000.00" },
        //   { value: "Burn" },
        //   { value: "MTC Test Token (NTT)" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "100,000,000.00" },
        //   { value: "Burn" },
        //   { value: "MTC Test Token (NTT)" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "100,000,000.00" },
        //   { value: "Burn" },
        //   { value: "MTC Test Token (NTT)" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "100,000,000.00" },
        //   { value: "Burn" },
        //   { value: "MTC Test Token (NTT)" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "100,000,000.00" },
        //   { value: "Burn" },
        //   { value: "MTC Test Token (NTT)" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "100,000,000.00" },
        //   { value: "Burn" },
        //   { value: "MTC Test Token (NTT)" },
        // ],
      ],
    };
  },
};
</script>