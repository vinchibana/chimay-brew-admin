<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category3Id"
        @click="addAttr"
        >添加属性</el-button
      >
      <el-table
        style="width: 100%; margin-top: 15px"
        border
        :data="attrList"
        v-show="isShowTable"
      >
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="100">
        </el-table-column>
        <el-table-column prop="prop" label="属性值列表" resizable>
          <template slot-scope="{ row, $index }">
            <el-tag
              type="success"
              v-for="attr in row.attrValueList"
              :key="attr.id"
              style="margin: 5px 6px"
              >{{ attr.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="150"
          align="center"
        >
          <template slot-scope="{ row, $index }">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="updateAttr(row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!isShowTable">
        <el-form
          :inline="true"
          ref="form"
          label-width="80px"
          style="margin: 15px 0"
          :model="attrInfo"
        >
          <el-form-item label="属性名">
            <el-input
              aria-placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 15px 0"
          border
          :data="attrInfo.attrValueList"
          v-show="!isShowTable"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.flag"
                @blur="toViewMode(row)"
                @keyup.native.enter="toViewMode(row)"
                aria-placeholder="请输入属性值"
                v-model="row.valueName"
                size="mini"
              ></el-input>
              <span v-else @click="row.flag = true" style="display: block">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width" align="center">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除 ${row.valueName} 吗？`"
                @onConfirm="deleteAttrValue($index)"
                ><el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttrValue">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true,

      // 收集添加的属性名与属性值列表
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
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
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    async saveAttrValue() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.flag;
            return true;
          }
        }
      );
      try {
        await this.$API.attr.reqAddAttr(this.attrInfo);
        this.isShowTable = true;
        this.$message.success("添加属性值成功");
        await this.getAttrList();
      } catch (error) {}
    },

    updateAttr(row) {
      this.isShowTable = false;
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    toViewMode(row) {
      row.flag = false;
    },

    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
  },
};
</script>

<style scoped></style>
