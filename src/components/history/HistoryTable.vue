<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Сумма</th>
        <th>Дата</th>
        <th>Категория</th>
        <th>Тип</th>
        <th>Открыть</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(record, index) in records" :key="record.id">
        <td>{{ index + 1 }}</td>
        <td>{{ record.amount }}</td>
        <td>{{ record.date }}</td>
        <td>{{ record.title }}</td>
        <td>
          <span class="white-text badge" :class="[record.typeColor]">{{
            record.typeText
          }}</span>
        </td>
        <td>
          <button
            class="btn-small btn"
            @click="
              $router.push({
                name: 'detail-record',
                params: { id: record.id },
              })
            "
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ["records"],
};
</script>
