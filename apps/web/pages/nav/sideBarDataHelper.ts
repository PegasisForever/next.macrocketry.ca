import {SideBarData} from './common'

export async function getSideBarData(): Promise<SideBarData> {
  // const teamGroups = await getTeamGroups()

  return [
    {
      href: '/',
      children: 'Overview',
    },
    {
      href: `/teams`,
      children: 'Teams',
    },
    {
      href: '/rockets/marauder-1',
      children: 'Rockets',
    },
    {
      href: '/avionics/void-lake-5',
      children: 'Avionics',
    },
    {
      href: '/blogs',
      children: 'Blogs',
    },
    {
      href: '/sponsors',
      children: 'Sponsors',
    },
    {
      href: '/recruitment',
      children: 'Recruitment',
    },
    {
      href: '/contact',
      children: 'Contact Us',
    },
  ]
}