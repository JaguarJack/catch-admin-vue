<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="queryParam.type" clearable placeholder="请选择类型" class="filter-item" style="margin-right: 5px">
        <el-option
              v-for="(type, k) in types"
              :key="k"
              :label="type"
              :value="k">
            </el-option>
      </el-select>
      <el-input v-model="queryParam.rr" placeholder="主机记录" clearable class="filter-item form-search-input" />
      <el-select v-model="queryParam.line" clearable placeholder="请选择线路" class="filter-item" style="margin-right: 5px">
        <el-option
              v-for="(route, k) in routes"
              :key="k"
              :label="route"
              :value="k">
        </el-option>
      </el-select>
      <el-input v-model="queryParam.value" placeholder="请输入记录值" clearable class="filter-item form-search-input" />
      <el-select v-model="queryParam.status" clearable placeholder="请选择状态" class="filter-item" style="margin-right: 5px">
        <el-option value="Enable" label="启用" />
        <el-option value="Disable" label="禁用" />
      </el-select>
      <el-button class="filter-item search" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
        重置
      </el-button>
      <el-button class="filter-item fr" type="primary" icon="el-icon-plus" @click="handleCreate()">
        新增
      </el-button>
    </div>
    <el-button v-if="this.selectedIds.length" size="small" class="filter-item mb-5" type="danger" icon="el-icon-delete" @click="handleMultiDelete">
      批量删除
    </el-button>
    <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" border fit @selection-change="handleSelectMulti">
      <el-table-column type="index" width="55" />
      <el-table-column label="主机记录" prop="rr" />
      <el-table-column prop="type" label="记录类型" />
      <el-table-column prop="line" label="解析路线">
        <template slot-scope="record">
          {{ routes[record.row.line] }}
        </template>value
      </el-table-column>
      <el-table-column prop="value" label="记录值" />
      <el-table-column prop="ttl" label="TTL">
        <template slot-scope="record">
          {{ ttls[record.row.ttl] }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="record">
          <el-switch
            v-model="record.row.status"
            active-text="启用"
            inactive-text="禁用"
            active-value="ENABLE"
            inactive-value="DISABLE"
            @change="disOrEnableRecord(record.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="job">
          <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(job.row)" />
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(job.row.recordid)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-container"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginate.current"
      hide-on-single-page
      :page-sizes="paginate.sizes"
      :page-size="paginate.limit"
      :layout="paginate.layout"
      :total="paginate.total"/>
    <!----------------------------------- 部门 ---------------------------------------------->
    <el-dialog :title="title" :visible.sync="formVisible" width="40%" @close="handleCancel">
      <el-form :ref="formName" :model="formFieldsData" :rules="rules">
        <el-form-item label="记录类型" :label-width="formLabelWidth" prop="type">
          <el-select v-model="formFieldsData.type" placeholder="请选择记录类型" style="width:90%">
            <el-option
              v-for="(type, k) in types"
              :key="k"
              :label="type"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机记录" :label-width="formLabelWidth" prop="rr">
          <el-input v-model="formFieldsData.rr" placeholder="请填写主机记录" style="width:70%" autocomplete="off" clearable />
          .{{ domain }}
        </el-form-item>
        <el-form-item label="解析线路" :label-width="formLabelWidth">
          <el-select v-model="formFieldsData.line" placeholder="请选择解析线路" style="width:90%">
            <el-option
              v-for="(route, k) in routes"
              :key="k"
              :label="route"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="记录值" :label-width="formLabelWidth" prop="value">
          <el-input v-model="formFieldsData.value" placeholder="请填写主机记录" style="width:90%" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="TTL" :label-width="formLabelWidth">
          <el-select v-model="formFieldsData.ttl" style="width:90%">
            <el-option
              v-for="(t, k) in ttls"
              :key="k"
              :label="t"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formOperate from '@/layout/mixin/formOperate'

export default {
  mixins: [formOperate],
  data() {
    return {
      formName: 'domain_record',
      formLabelWidth: '120px',
      queryParam: {
        name: '',
        rr: '',
        type: '',
        value: '',
        line: '',
        status: ''
      },
      defaultQueryParam: [
        'name'
      ],
      url: 'record/domain',
      pk: 'recordid',
      formVisible: false,
      formFieldsData: {
        type: '',
        rr: '',
        line: '',
        ttl: '',
        value: ''
      },
      // 解析类型
      types: {
        A: 'A-将域名指向一个IPV4地址',
        CNAME: 'CNAME-将域名指向另外一个域名',
        AAAA: 'AAAA-将域名指向一个IPV6地址',
        NS: 'NS-将子域名指定其他DNS服务器解析',
        MX: 'MX-将域名指向邮件服务器地址',
        SRV: 'SRV-记录提供特定的服务的服务器',
        TXT: 'TXT-文本长度限制512，通常做SPF记录(反垃圾邮件)',
        CAA: 'CAAA-CA证书颁发机构授权校验',
        显性URL: '显性URL-将域名重定向到另一个地址',
        隐性URL: '隐性URL-与显性URL类似，但是会隐藏真实的目标地址'
      },
      // 解析线路
      routes: {
        default: '默认',
        telecom: '中国电信',
        unicom: '中国联通',
        mobile: '中国移动',
        oversea: '境外',
        edu: '中国教育网',
        baidu: '百度',
        biying: '必应',
        google: '谷歌'
      },
      ttls: {
        600: '10分钟',
        1800: '30分钟',
        3600: '1小时',
        43200: '12小时',
        86400: '24小时'
      },
      // 表单验证
      rules: {
        type: [
          { required: true, message: '请选择记录类型', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入记录值', trigger: 'blur' }
        ],
        rr: [
          { required: true, message: '请输入主机记录', trigger: 'blur' }
        ],
        ttl: [
          { required: true, message: '请选择 ttl', trigger: 'blur' }
        ]
      },
      domain: ''
    }
  },
  created() {
    if (this.$route.params.domain !== undefined) {
      this.domain = this.queryParam.name = this.$route.params.domain
    }
  },
  methods: {
    beforeCreate() {
      this.formFieldsData.name = this.domain
    },
    beforeUpdate() {
      this.formFieldsData.name = this.domain
    },
    disOrEnableRecord(record) {
      this.$http.put('record/domain/' + record.recordid + '/' + record.status).then(response => {
        this.$message.success(response.message)
      })
    }
  }
}
</script>
