import { Enum } from '@/enums/enum.js'

export const components = new Enum({
  layouts: [
    'userLayout',
    'basicLayout',
    'routeView',
    'blankLayout',
    'pageView'
  ],
  children: [
    'workplace',
    'users',
    'roles',
    'rules',
    'departments',
    'jobs',
    'database',
    'loginLog',
    'operateLog',
    'attachment',
    'config',
    'generate'
  ]
})
