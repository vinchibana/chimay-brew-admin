<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>

      <!-- 品牌table，发请求获得 -->
      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId">
          <el-option
            v-for="tradeMark in tradeMarkList"
            :key="tradeMark.id"
            :label="tradeMark.tmName"
            :value="tradeMark.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="请输入SPU描述"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          :file-list="imageList"
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlePictureUploadSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <!-- v-model的值为当前被选中的el-option的 value 属性值-->
        <el-select
          v-model="attrIdAndName"
          :placeholder="`还有${unSelectedAttr.length}项未选择`"
        >
          <el-option
            v-for="unselect in unSelectedAttr"
            :key="unselect.id"
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndName"
          style="margin: 0 10px"
          @click="addSaleAttr"
          >添加属性</el-button
        >

        <el-table
          :data="spuInfo.spuSaleAttrList"
          label="label"
          width="width"
          border
          style="width: 100%; margin: 10px 0"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80px"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="150px"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <!-- 每行是一个 spuSaleAttrList 对象 -->
            <template v-slot="{ row, $index }">
              <el-tag
                :key="index"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="true"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100" align="center">
            <template v-slot="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spuInfo.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item prop="prop" label="操作" width="width">
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuInfo: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: 0,
        spuImageList: [],
        spuSaleAttrList: [],
      },
      tradeMarkList: [],
      imageList: [],
      spuSaleAttrList: [],
      attrIdAndName: "",
    };
  },
  computed: {
    // 收集全部销售属性列表当中未赋予当前 spu 的
    unSelectedAttr() {
      return this.spuSaleAttrList.filter((item) => {
        return this.spuInfo.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
  },

  methods: {
    handleRemove(file, fileList) {
      this.imageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureUploadSuccess(response, file, fileList) {
      this.imageList = fileList;
    },
    async initSpuData(spu) {
      let spuResult = await this.$API.spu.reqSpuInfo(spu.id);
      if (spuResult.code == 200) {
        this.spuInfo = spuResult.data;
      }

      let imgResult = await this.$API.spu.reqImgList(spu.id);
      if (imgResult.code == 200) {
        let listArr = imgResult.data;

        // 图片墙展示需要数组结构为 [{name: '', url: ''}]，为服务器返回数据新增 name 和 url 两个属性
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.imageList = listArr;
      }
      let attrResult = await this.$API.spu.reqSaleAttrList();
      if (attrResult.code == 200) {
        this.spuSaleAttrList = attrResult.data;
      }

      let tradeMarkList = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkList.code == 200) {
        this.tradeMarkList = tradeMarkList.data;
      }
    },
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      let saleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuInfo.spuSaleAttrList.push(saleAttr);
      this.attrIdAndName = "";
    },

    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },

    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      let newSaleAttrValue = {
        baseSaleAttrId: baseSaleAttrId,
        saleAttrValueName: inputValue,
      };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
    },

    async addSpuData(category3Id) {
      this.spuInfo.category3Id = category3Id;
      let attrResult = await this.$API.spu.reqSaleAttrList();
      if (attrResult.code == 200) {
        this.spuSaleAttrList = attrResult.data;
      }

      let tradeMarkList = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkList.code == 200) {
        this.tradeMarkList = tradeMarkList.data;
      }
    },

    async addOrUpdateSpu() {
      this.spuInfo.spuImageList = this.imageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.addOrUpdateSpu(this.spuInfo);
      if (result.code == 200) {
        this.$message.success("保存成功！");
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spuInfo.id ? "update" : "add",
        });
      }
      Object.assign(this._data, this.$options.data());
    },

    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "update" });
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
