import {
  ListTodo,
  Package,
  Users,
  Command,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'G-Scores',
      logo: Command,
      plan: 'Tra cứu điểm thi',
    },
  ],
  navGroups: [
    {
      title: 'G-Scores',
      items: [
        {
          title: 'Tra cứu điểm',
          url: '/score-search',
          icon: Users,
        },
        {
          title: 'Báo cáo thống kê',
          url: '/reports',
          icon: Package,
        },
        {
          title: 'Xếp hạng khối A',
          url: '/top-students',
          icon: ListTodo,
        },
      ],
    },
  ],
}
