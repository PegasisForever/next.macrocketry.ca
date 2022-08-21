import {ActionIcon, createStyles} from '@mantine/core'
import {IconArrowLeft, IconMenu2} from '@tabler/icons'
import {desktopSideBarBreakPoint} from './common'
import {useEffect, useState} from 'react'
import DesktopSideBar from './DesktopSideBar'
import {useRouter} from 'next/router'
import {m} from 'framer-motion'

const sideBarTransition = {type: 'spring', duration: 0.4, bounce: 0}

const useStyles = createStyles(theme => ({
  mobileSideBar: {
    position: 'absolute',
    top: 0,
    left: 0,

    [`@media (min-width: ${desktopSideBarBreakPoint}px)`]: {
      display: 'none',
    },
  },
}))

export default function MobileSideBar() {
  const {classes, theme} = useStyles()
  const router = useRouter()
  const [show, setShow] = useState(false)
  console.log('show', show)

  useEffect(() => {
    const handleRouteChange = () => {
      setShow(false)
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  return <>
    <ActionIcon
      onClick={() => setShow(true)}
      size={64}
      className={classes.mobileSideBar}
      sx={{
        zIndex: 100,
        color: theme.colors.gray[1],

        '&:hover': {
          background: theme.fn.rgba(theme.white, 0.4),
        },
      }}>
      <IconMenu2 size={48}/>
    </ActionIcon>
    <m.div
      className={classes.mobileSideBar}
      style={{
        zIndex: 105,
        height: '100vh',
        width: '100vw',
        backgroundColor: theme.black,
        pointerEvents: show ? undefined : 'none',
      }}
      onClick={() => setShow(false)}
      initial={false}
      transition={sideBarTransition}
      animate={{
        opacity: show ? 0.5 : 0,
      }}
    />
    <m.div
      className={classes.mobileSideBar}
      style={{
        zIndex: 110,
        height: '100vh',
        backgroundColor: theme.white,
      }}
      initial={false}
      transition={sideBarTransition}
      animate={{
        translateX: show ? '0%' : '-125%',
      }}
    >
      <ActionIcon
        onClick={() => setShow(false)}
        size={64}
        className={classes.mobileSideBar}
        sx={{
          zIndex: 115,
          color: theme.colors.gray[8],
          '&:hover': {
            background: theme.fn.rgba(theme.black, 0.3),
          },
        }}>
        <IconArrowLeft size={48}/>
      </ActionIcon>
      <DesktopSideBar alwaysShow/>
    </m.div>
  </>
}