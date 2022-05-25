import {PropsWithChildren} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import logo from './logo.png'
import {Anchor, Box, Stack, Title, useMantineTheme} from '@mantine/core'

export type SideBarData = Array<{ href: string, children: string }>

export function normalizeHref(href: string): string {
  return '/' + href.split('/')[1]
}

function NavLink(props: PropsWithChildren<{ href: string }>) {
  const theme = useMantineTheme()
  const router = useRouter()
  const selected = normalizeHref(router.route) === normalizeHref(props.href)
  return <Link href={props.href} passHref>
    <Anchor style={{
      color: selected ? theme.colors.mac[6] : theme.colors.gray[6],
      fontSize: selected ? 30 : 24,
      lineHeight: selected ? '45px' : '36px',
    }} sx={{
      fontWeight: 500,
      letterSpacing: 1.5,
      transitionProperty: 'color, font-size, line-height',
      transitionDuration: '250ms',
      transitionTimingFunction: 'ease-in-out',
    }}>
      {props.children}
    </Anchor>
  </Link>
}

export function NavLinks(props: { data: SideBarData }) {
  return <Stack mb={32} spacing={6} align={'flex-start'} justify={'center'} sx={{
    flexGrow: 1,
  }}>
    {props.data.map(data => <NavLink key={data.children} {...data}/>)}
  </Stack>
}

export function SideBarLogo() {
  return <div>
    <Box sx={{
      width: 64,
    }}>
      <Image priority sizes={'64px'} layout={'responsive'} src={logo} alt={'logo'}/>
    </Box>
    <Title mt={16} order={1} sx={{
      fontWeight: 500,
      fontSize: 36,
      lineHeight: '40px',
    }}>
      McMaster
      <br/>
      Rocketry
      <br/>
      Team
    </Title>
  </div>
}

const normalizedSideBarHrefs = [
  '/',
  '/teams',
  '/rockets',
  '/blogs',
  '/sponsors',
  '/recruitment',
  '/contact_us',
]

export function getSideBarIndex(href: string): number {
  const normalized = normalizeHref(href)
  return normalizedSideBarHrefs.indexOf(normalized)
}