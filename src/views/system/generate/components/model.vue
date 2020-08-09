<template>
  <div>
    <a-divider></a-divider>
    <a-table :columns="columns" :dataSource="fields" bordered :pagination="false">
      <template
        v-for="col in ['field', 'default', 'comment']"
        :slot="col"
        slot-scope="text, record, index"
      >
        <a-input style="margin: -5px 0" v-if="record[col]" :value="record[col]" @change="e => setValue(e.target.value, index, col)"/>
        <a-input style="margin: -5px 0" v-else @change="e => setValue(e.target.value, index, col)"/>

      </template>
      <template slot="type" slot-scope="text, record, index">
        <a-select
          allowClear
          placeholder="选择类型"
          :showSearch="true"
          @select="e => setValue(e, index, 'type')"
          style="width: 100%;margin-top: 17px">
          <a-select-opt-group v-for="(item, key) in mysqlTypes" :key="key" :label="key">
            <a-select-option v-for="(v, k) in item" :key="k" :value="v">{{ v }}</a-select-option>
          </a-select-opt-group>
        </a-select>
        <a-checkbox style="float: right" v-if="record['unsigned']" checked @change="e => setValue(e.target.checked, index, 'unsigned')">unsigned</a-checkbox>
        <a-checkbox style="float: right" v-else @change="e => setValue(e.target.checked, index, 'unsigned')">unsigned</a-checkbox>
      </template>
      <template slot="length" slot-scope="text, record, index">
        <a-input-number :min="1" :max="100000" :value="record['length']" @change="e => setValue(e, index, 'length')" />
      </template>
      <template slot="nullable" slot-scope="text, record, index">
        <a-checkbox @change="e => setValue(e.target.checked, index, 'nullable')" v-if="record['nullable']" checked></a-checkbox>
        <a-checkbox @change="e => setValue(e.target.checked, index, 'nullable')" v-else></a-checkbox>
      </template>
      <template slot="index" slot-scope="text, record, index">
        <a-select allowClear placeholder="选择索引" :default-value="record['index']" @select="e => setValue(e, index, 'index')" style="width: 100%">
          <a-select-option v-for="(v, k) in indexes" :key="k" :value="v">{{ v }}</a-select-option>
        </a-select>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <a-button type="danger" size="small" icon="delete" @click="deleteField(index)">删除</a-button>
      </template>
    </a-table>
    <div style="margin-top: 10px;">
      <a-input addonBefore="主键" defaultValue="id" style="width: 10%" @change="e => setExtra(e.target.value, 'primary_key')">
        <a-icon slot="addonBefore" type="key" />主键
      </a-input>
      <a-button-group style="margin-left: 5px;">
        <a-button ><a-checkbox :checked="extra.created_at" @change="setCreatedAt"></a-checkbox></a-button>
        <a-button>created_at&updated_at</a-button>
      </a-button-group>
      <a-button-group style="margin-left: 5px;">
        <a-button><a-checkbox :checked="extra.soft_delete" @change="setSoftDelete"></a-checkbox></a-button>
        <a-button>deleted_at</a-button>
      </a-button-group>
      <a-button-group style="margin-left: 5px;">
        <a-button><a-checkbox :checked="extra.creator_id" @change="setCreatorId"></a-checkbox></a-button>
        <a-button>creator_id</a-button>
      </a-button-group>
      <a-select defaultValue="InnoDB" style="width: 12%;margin-left: 5px;" @change="e => setExtra(e, 'engine')">
        <a-select-option value="InnoDB">InnoDB</a-select-option>
        <a-select-option value="MyISAM">MyISAM</a-select-option>
        <a-select-option value="Memory">Memory</a-select-option>
      </a-select>
      <a-input addonBefore="表注释" defaultValue="" style="width: 20%;margin-left: 5px;" @change="e => setExtra(e.target.value, 'comment')"/>
      <a-button type="primary" icon="plus" @click="addField" style="float: right;">新增字段</a-button>
    </div>
  </div>
</template>
<script>
import { mysqlTypes } from '@/enums/data/mysqlTypes'
const columns = [
  {
    title: '字段名称',
    dataIndex: 'field',
    width: '15%',
    scopedSlots: { customRender: 'field' }
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: '15%',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '长度',
    dataIndex: 'length',
    width: '5%',
    scopedSlots: { customRender: 'length' }
  },
  {
    title: 'NULL',
    dataIndex: 'nullable',
    width: '3%',
    scopedSlots: { customRender: 'nullable' }
  },
  {
    title: '索引',
    dataIndex: 'index',
    width: '15%',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '默认值',
    dataIndex: 'default',
    scopedSlots: { customRender: 'default' }
  },
  {
    title: '注释',
    dataIndex: 'comment',
    scopedSlots: { customRender: 'comment' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

// column 信息
export default {
  name: 'model',
  data () {
    return {
      fields: [this.column()],
      columns,
      mysqlTypes,
      indexes: [
        'unique', 'index', 'fulltext', 'spatial'
      ],
      extra: {
        'primary_key': 'id',
        'created_at': true,
        'soft_delete': true,
        'creator_id': true,
        'engine': 'Innodb',
        'comment': ''
      }
    }
  },
  methods: {
    addField () {
      this.fields.push(this.column())
    },
    column () {
      return {
        'field': '',
        'type': '',
        'length': 0,
        'nullable': false,
        'index': '',
        'default': '',
        'comment': '',
        'unsigned': false
      }
    },
    setValue (value, key, field) {
      for (const k in this.fields) {
        if (parseInt(key) === parseInt(k)) {
          this.fields[parseInt(k)][field] = value
          break
        }
      }
    },
    deleteField (index) {
      const data = this.fields.filter(function (value, key) {
        return key !== index
      })

      this.fields = data
    },
    setCreatedAt (e) {
      this.extra.created_at = e.target.checked
    },
    setSoftDelete (e) {
      this.extra.soft_delete = e.target.checked
    },
    setCreatorId (e) {
      this.extra.creator_id = e.target.checked
    },
    setExtra (e, field) {
      this.extra[field] = e
    },
    getModelData () {
      return {
        data: this.fields,
        extra: this.extra
      }
    }
  }
}
</script>
<style scoped>
    .editable-row-operations a {
        margin-right: 8px;
    }
</style>
