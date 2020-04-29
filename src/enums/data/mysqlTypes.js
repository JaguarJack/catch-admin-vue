import { Enum } from '@/enums/enum.js'

export const mysqlTypes = new Enum({
  数字: [
    'tinyint',
    'smallint',
    'mediumint',
    'int',
    'bigint',
    'decimal',
    'float',
    'double',
    'bit',
    'boolean',

  ],
  日期与时间: [
    'date',
    'datetime',
    'timestamp',
    'time',
    'year',
  ],
  文本: [
    'char',
    'varchar',
    'tinyText',
    'text',
    'mediumText',
    'longText',
    'binary',
    'varbinary',
    'tinyblob',
    'blob',
    'mediumblob',
    'longblob',
    'enum',
    'set'
  ],
  空间: [
    'geometry',
    'point',
    'linestring',
    'polygon',
    'multipoint',
    'multilinestring',
    'multipolygon',
    'geometrycollection'
  ],
  json: [
    'json'
  ]
})
