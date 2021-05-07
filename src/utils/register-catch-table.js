import CatchTable from '@/components/Catch/Table'
import switch_ from '@/components/Catch/Table/columns/switch'
import editNumber from '@/components/Catch/Table/columns/editNumber'
import edit from '@/components/Catch/Table/columns/edit'
import select_ from '@/components/Catch/Table/columns/select'
import tinymce from '@/components/Tinymce'
import preview from '@/components/Catch/Table/columns/preview'
import download from '@/components/Catch/Table/columns/download'

import Vue from 'vue'

Vue.component('CatchTable', CatchTable)
Vue.component('switch_', switch_)
Vue.component('editNumber', editNumber)
Vue.component('edit', edit)
Vue.component('select_', select_)
Vue.component('preview', preview)
Vue.component('download', download)
Vue.component('editor', tinymce)
