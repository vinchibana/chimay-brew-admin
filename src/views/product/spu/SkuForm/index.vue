<template>
  <div>
    <el-card>
      <el-form ref="form" label-width="80px">
        <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
        <el-form-item label="SKU名称">
          <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input
            style="width: 200px"
            placeholder="价格"
            type="number"
            v-model="skuInfo.price"
          ></el-input>
        </el-form-item>
        <el-form-item label="重量">
          <el-input
            placeholder="重量"
            v-model="skuInfo.weight"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input
            type="textarea"
            rows="4"
            v-model="skuInfo.skuDesc"
          ></el-input>
        </el-form-item>

        <el-form-item label="平台属性">
          <el-form :inline="true" ref="form" label-width="80px">
            <el-form-item
              v-for="attr in attrInfoList"
              :label="attr.attrName"
              :key="attr.id"
            >
              <!-- v-model的值为当前被选中的el-option的 value 属性值-->
              <el-select v-model="attr.attrIdAndValueId">
                <el-option
                  :value="`${attr.id}:${attrValue.id}`"
                  v-for="attrValue in attr.attrValueList"
                  :key="attrValue.id"
                  :label="attrValue.valueName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>

        <el-form-item label="销售属性">
          <el-form :inline="true" ref="form" label-width="80px">
            <el-form-item
              v-for="saleAttr in spuSaleAttrList"
              :label="saleAttr.saleAttrName"
              :key="saleAttr.id"
            >
              <el-select v-model="saleAttr.saleAttrIdAndValueId">
                <el-option
                  v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                  :key="saleAttrValue.id"
                  :value="`${saleAttr.id}:${saleAttrValue.id}`"
                  :label="saleAttrValue.saleAttrValueName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>

        <el-form-item label="图片列表">
          <el-table
            style="width: 100%; margin: 15px 0"
            border
            :data="spuImageList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              prop="prop"
              width="80px"
              label="选择"
            ></el-table-column>
            <el-table-column prop="imgUrl" width="140px" label="图片">
              <template v-slot="{ row, $index }">
                <el-image
                  style="width: 90px; height: 90px"
                  :src="row.imgUrl"
                  alt=""
                  fit="contain"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="imgName"
              width="width"
              label="名称"
            ></el-table-column>

            <el-table-column prop="prop" width="250px" label="操作">
              <template v-slot="{ row, $index }">
                <el-button
                  type="primary"
                  size="small"
                  v-if="row.isDefault == 0"
                  @click="setAsDefault(row)"
                  >设为默认</el-button
                >
                <div v-else>
                  <el-tag
                    type="success"
                    disable-transitions
                    style="margin: 0 10px"
                    >默认</el-tag
                  >
                  <el-button
                    type="warning"
                    size="small"
                    @click="row.isDefault = 0"
                    >取消默认</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="saveSkuInfo">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spu: {},
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      attrIdAndValueId: "",
      saleAttrIdAndValueId: "",
      // 为skuForm收集sku数据
      skuInfo: {
        // 来自父组件的数据
        category3Id: "",
        spuId: "",
        tmId: "",
        // 通过v-model双向绑定收集到的数据
        price: 0,
        skuName: "",
        weight: "",
        skuDesc: "",
        // 通过发送请求收集
        skuAttrValueList: [],
        skuDefaultImg: "",
        skuImageList: [],
        skuSaleAttrValueList: [],
      },
      multipleSelection: [],
    };
  },

  methods: {
    async getSkuInfo(category1Id, category2Id, spu) {
      // 来自父组件的数据
      this.spu = spu;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;

      let result = await this.$API.sku.reqSpuImageList(spu.id);
      if (result.code == 200) {
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }

      let result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id);
      if (result.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      let result2 = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    setAsDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    async saveSkuInfo() {
      const { attrInfoList, skuInfo, spuSaleAttrList, multipleSelection } =
        this;
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);

      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.saleAttrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);

      skuInfo.skuImageList = multipleSelection.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImageId: item.id,
        };
      });
      let result = await this.$API.sku.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message.success("添加 SKU 成功");
        this.$emit("changeScenes", 0);
      }
    },
  },
};
</script>

<style scoped></style>
