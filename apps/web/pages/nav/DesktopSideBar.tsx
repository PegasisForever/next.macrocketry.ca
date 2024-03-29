import {desktopSideBarBreakPoint, NavLinks, SideBarLogo} from './common'
import {Anchor, Stack, useMantineTheme} from '@mantine/core'
import {useModals} from '@mantine/modals'
import PrepareAdminDialog from './PrepareAdminDialog'

export default function DesktopSideBar(props: { alwaysShow?: boolean }) {
  const modals = useModals()
  const theme = useMantineTheme()

  return <Stack pt={96} pl={56} pb={32} sx={[
    {
      width: 288,
      height: '100vh',
      overflowY: 'auto',
    },
    !props.alwaysShow ? {
      [`@media (max-width: ${desktopSideBarBreakPoint - 0.1}px)`]: {
        display: 'none',
      },
    } : {},
  ]}>
    <SideBarLogo/>
    <NavLinks/>
    <Anchor color={'dimmed'} onClick={() => {
      modals.openModal({
        className: '',
        closeButtonLabel: '',
        withinPortal: false,
        centered: true,
        overlayBlur: 10,
        overlayColor: theme.fn.rgba(theme.black, 0.4),
        withCloseButton: false,
        padding: 'xl',
        children: <PrepareAdminDialog/>,
      })
    }}>
      Member Login
    </Anchor>
  </Stack>
}

