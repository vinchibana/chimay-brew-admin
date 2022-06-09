<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select value="" placeholder="请选择品牌"></el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="请输入SPU描述"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select value="" placeholder=""></el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin: 0 10px"
          >添加销售属性</el-button
        >

        <el-table
          prop="prop"
          label="label"
          width="width"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80px"
          ></el-table-column>
          <el-table-column
            prop="prop"
            label="属性名"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="prop"
            label="属性值名称列表"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <el-button type="primary">保存</el-button>
            <el-button type="primary">取消</el-button>
          </el-table-column>
        </el-table>
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
      spuList: [],
    };
  },
  methods: {
    handleRemove() {},
    handlePictureCardPreview() {},
  },
};
</script>

<style scoped></style>
