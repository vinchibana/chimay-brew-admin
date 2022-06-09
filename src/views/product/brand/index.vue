<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加品牌</el-button
    >
    <el-table style="width: 100%" border :data="brandList">
      <el-table-column
        type="index"
        prop="index"
        label="序号"
        width="100px"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <template v-slot="{ row, $index }">
          <el-image
            style="width: 60px; height: 60px"
            :src="row.logoUrl"
            alt=""
            fit="contain"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="width">
        <template v-slot="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="modifyBrand(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteBrand(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px; text-align: center"
      background
      :total="100"
      :current-page="1"
      :page-size="10"
      :page-sizes="[10, 20, 50]"
      layout="prev, pager, next, jumper,->,sizes,total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog
      :title="brandForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="brandForm" :rules="rules" ref="brandForm">
        <el-form-item
          label="品牌名称"
          prop="tmName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="brandForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="品牌logo"
          prop="logoUrl"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          >
            <img
              v-if="brandForm.logoUrl"
              :src="brandForm.logoUrl"
              class="avatar"
              alt=""
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrModifyBrand">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Brand",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      brandList: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",

      // 临时收集上传的品牌对象
      brandForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10个字符", trigger: "change" },
        ],
        logoUrl: [
          { required: true, message: "请上传品牌logo图片", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 分页
    handleSizeChange(size) {
      this.limit = size;
      this.getBrandList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getBrandList();
    },

    async getBrandList() {
      const { page, limit } = this;
      let result = await this.$API.brand.reqBrandList(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.brandList = result.data.records;
      }
    },

    // 点击展示 dialog
    showDialog() {
      this.dialogFormVisible = true;
      this.brandForm = { tmName: "", logoUrl: "" };
    },

    // 品牌 logo 上传
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleSuccess(res) {
      if (res.code === 200) {
        this.brandForm.logoUrl = res.data;
      }
    },

    // 上传 logo 或修改名称（v-model 绑定）后，完成品牌添加或修改
    submitForm() {
      this.$refs.brandForm.validate((valid) => {
        if (valid) {
          this.addOrModifyBrand();
        } else {
          console.log();
        }
      });
    },
    addOrModifyBrand() {
      this.$refs.brandForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          let result = await this.$API.brand.reqAddOrModifyBrand(
            this.brandForm
          );
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: this.brandForm.id ? "修改品牌成功！" : "添加品牌成功！",
            });
            await this.getBrandList(this.brandForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit" || "");
          return false;
        }
      });
    },

    async modifyBrand(row) {
      console.log(row);
      this.dialogFormVisible = true;
      this.brandForm = { ...row };
    },

    deleteBrand(row) {
      this.$confirm(`将删除 ${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.brand.reqDeleteBrand(row.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            await this.getBrandList(
              this.brandList.length > 1 ? this.page : this.page - 1
            );
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.getBrandList();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
