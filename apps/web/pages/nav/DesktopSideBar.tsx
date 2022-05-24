import {NavLinks, SideBarData, SideBarLogo} from './common'
import {Anchor, Stack} from '@mantine/core'
import Link from 'next/link'

export default function DesktopSideBar(props: { data: SideBarData }) {
  return <Stack pt={96} pl={56} pb={32} sx={{
    width: 288,
    height: '100vh',
    overflowY: 'auto',
  }}>
    <SideBarLogo/>
    <NavLinks data={props.data}/>
    <Link href={''} passHref>
      <Anchor color={'dimmed'}>
        Member Login
      </Anchor>
    </Link>
  </Stack>
}