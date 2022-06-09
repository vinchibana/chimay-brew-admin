<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShow" />
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 15px 0"
          :disabled="!category3Id"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" :data="spuList" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU名称"
            width="300px"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="250px">
            <template v-slot="{ row, $index }">
              <el-tooltip
                class="item"
                effect="dark"
                content="添加"
                placement="top"
              >
                <el-button
                  type="success"
                  icon="el-icon-plus"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="修改"
                placement="top"
              >
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="详情"
                placement="top"
              >
                <el-button
                  type="info"
                  icon="el-icon-info"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="margin-top: 20px; text-align: center"
          background
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[5, 10, 20]"
          layout="prev, pager, next, jumper,->,sizes,total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1"></SpuForm>
      <SkuForm v-show="scene == 2"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "@/views/product/spu/SpuForm";
import SkuForm from "@/views/product/spu/SkuForm";
export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      isShow: true,

      page: 1,
      limit: 5,
      total: 100,
      spuList: [],

      // 0：展示SPU列表数据 1：添加修改SPU 2：添加SKu
      scene: 0,
    };
  },
  mounted() {
    this.getSpuList();
  },
  methods: {
    async getSpuList() {
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.total = result.data.total;
        this.spuList = result.data.records;
      }
    },
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
        this.getSpuList();
      }
    },

    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
    handleCurrentChange(page) {
      console.log(page);
      this.page = page;
      this.getSpuList();
    },
  },
};
</script>
<style></style>
