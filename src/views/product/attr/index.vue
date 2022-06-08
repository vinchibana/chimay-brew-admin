<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table style="width: 100%; margin-top: 20px" border :data="attrList">
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="attrName"
          label="属性名称"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="prop" label="属性值列表" resizable>
          <template slot-scope="{ row, $index }">
            <el-tag
              type="success"
              v-for="attr in row.attrValueList"
              :key="attr.id"
              style="margin: 0 6px"
              >{{ attr.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 三级 id 全部都确定后发请求
        this.getAttrList();
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    handleEdit() {},
    handleDelete() {},
  },
};
</script>

<style scoped></style>
