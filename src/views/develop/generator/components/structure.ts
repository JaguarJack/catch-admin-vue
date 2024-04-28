export interface Field {
  id: number
  name: string
  type: string | null
  unsigned: boolean
  length: number
  index: string
  nullable: boolean
  default: string | null | Array<string | number>
  comment: string
  component: string | null
  op: string | null
}

export interface Structure {
  table: string
  model?: string
  controller?: string
  paginate: boolean
  createdAt: boolean
  deletedAt: boolean
  primary: string
  comment: string
  creatorId: boolean
  engine: string
  json: boolean
  fields: Array<Field>
}
