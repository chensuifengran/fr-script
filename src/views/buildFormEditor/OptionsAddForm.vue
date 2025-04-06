<template>
  <el-form :model="addOptionForm" label-position="left" label-width="140px">
    <el-form-item label="选项类型" prop="opType">
      <el-segmented
        :options="['常量', '对象']"
        v-model="addOptionForm.opType"
      />
    </el-form-item>
    <template v-if="addOptionForm.opType === '对象'">
      <el-form-item label="标签" prop="label">
        <el-input v-model="addOptionForm.label" />
      </el-form-item>
    </template>
    <template v-if="form.cForm.select.enabledGroupOption">
      <el-form-item label="分组标签" prop="group">
        <el-autocomplete
          v-model="addOptionForm.group"
          :fetch-suggestions="queryGroupLabels"
          placeholder="请输入分组标签"
          clearable
        />
      </el-form-item>
    </template>
    <el-form-item
      v-if="form.cForm.select.valueType === 'string'"
      :label="addOptionForm.opType + '值'"
      prop="stringValue"
    >
      <el-input v-model="addOptionForm.stringValue" />
    </el-form-item>
    <el-form-item
      v-if="form.cForm.select.valueType === 'number'"
      :label="addOptionForm.opType + '值'"
      prop="numberValue"
    >
      <el-input-number v-model="addOptionForm.numberValue" />
    </el-form-item>
    <el-form-item
      v-if="form.cForm.select.valueType === 'boolean'"
      :label="addOptionForm.opType + '值'"
      prop="booleanValue"
    >
      <el-switch v-model="addOptionForm.booleanValue" />
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
const { form, addOptionForm } = useRenderItemEditForm();

const labelFilter = (queryString: string) => {
  return (label: string) => {
    return {
      value: label
        .toLocaleLowerCase()
        .includes(queryString.toLocaleLowerCase()),
    };
  };
};

const queryGroupLabels = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString
    ? form.cForm.select.groupOptions
        .map((g) => g.groupLabel)
        .filter(labelFilter(queryString))
    : form.cForm.select.groupOptions.map((g) => ({ value: g.groupLabel }));
  cb(results);
};
</script>

<style lang="scss" scoped></style>
