<template>
  <div>
    <el-form :inline="true" :model="catForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="catForm.category1Id"
          @change="handleCat1"
          :disabled="show"
        >
          <el-option
            v-for="cat1 in cat1List"
            :key="cat1.id"
            :label="cat1.name"
            :value="cat1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="catForm.category2Id"
          @change="handleCat2"
          :disabled="show"
        >
          <el-option
            v-for="cat2 in cat2List"
            :key="cat2.id"
            :label="cat2.name"
            :value="cat2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="catForm.category3Id"
          @change="handleCat3"
          :disabled="show"
        >
          <el-option
            v-for="cat3 in cat3List"
            :key="cat3.id"
            :label="cat3.name"
            :value="cat3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      // 接收服务器返回数据
      cat1List: [],
      cat2List: [],
      cat3List: [],

      // 临时收集表单 id 数据
      catForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  props: ["show"],
  mounted() {
    this.getCategory1List();
  },

  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqCat1();
      if (result.code === 200) {
        this.cat1List = result.data;
      }
    },

    async handleCat1() {
      this.cat2List = [];
      this.cat3List = [];
      this.catForm.category2Id = "";
      this.catForm.category3Id = "";
      const { category1Id } = this.catForm;
      this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });
      let result = await this.$API.attr.reqCat2(category1Id);
      if (result.code === 200) {
        this.cat2List = result.data;
      }
    },

    async handleCat2() {
      this.cat3List = [];
      this.catForm.category3Id = "";
      const { category2Id } = this.catForm;
      this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });
      let result = await this.$API.attr.reqCat3(category2Id);
      if (result.code === 200) {
        this.cat3List = result.data;
      }
    },

    handleCat3() {
      const { category3Id } = this.catForm;
      this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style scoped></style>
