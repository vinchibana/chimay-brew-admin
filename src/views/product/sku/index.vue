<template>
  <div>
    <el-table style="width: 100%" border :data="skuList">
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        width="width"
      ></el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述"
        width="width"
      ></el-table-column>
      <el-table-column label="默认图片" width="120px" align="center">
        <template v-slot="{ row, $index }">
          <img
            alt=""
            :src="row.skuDefaultImg"
            style="height: 90px; width: 90px"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="prop"
        label="重量"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="prop"
        label="价格"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column prop="prop" label="操作" width="300px" align="center">
        <template v-slot="{ row, $index }">
          <el-button
            type="success"
            v-if="row.isSale == 0"
            @click="cancelSale(row)"
            icon="el-icon-bottom"
            size="mini"
          ></el-button>
          <el-button
            type="success"
            v-else
            @click="onSale(row)"
            icon="el-icon-top"
            size="mini"
          ></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px; text-align: center"
      background
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[10, 20, 50]"
      layout="prev, pager, next, jumper,->,sizes,total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">SKU名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">SKU百科</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">¥ {{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            style="margin-bottom: 10px; margin-right: 10px"
            type="success"
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            >{{ attr.attrName }}: {{ attr.valueName }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="450px">
            <el-carousel-item
              v-for="(item, index) in skuInfo.skuImageList"
              :key="index"
            >
              <img :src="item.imgUrl" alt="" style="width: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      skuList: [],
      total: 0,
      drawer: false,
      skuInfo: {},
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList() {
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.skuList = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getSkuList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuList();
    },

    async onSale(sku) {
      let result = await this.$API.sku.reqOnSale(sku.id);
      if (result.code == 200) {
        sku.isSale = 1;
        this.$message.success("上架成功");
      }
    },

    async cancelSale(sku) {
      let result = await this.$API.sku.reqCancelSale(sku.id);
      if (result.code == 200) {
        sku.isSale = 0;
        this.$message.success("下架成功");
      }
    },
    async getSkuInfo(sku) {
      this.drawer = true;
      let result = await this.$API.sku.reqSkuById(sku.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
.el-carousel__item h3 {
  color: #ffffff;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #ffffff;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #ffffff;
}
</style>
