export interface Permission {
  id: number
  parent_id: number
  permission_name: string
  type: number
  icon: string
  component: string
  module: string
  permission_mark: string
  route: string
  redirect: string
  keepalive: number
  hidden: boolean
  active_menu: string
}
