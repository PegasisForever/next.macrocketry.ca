import {forwardRef, PropsWithChildren, useContext, useState} from 'react'
import {m} from 'framer-motion'
import {useRouter} from 'next/router'
import Head from 'next/head'
import {useEffectOnce} from 'react-use'
import {getSideBarIndex} from './nav/common'
import {Box, useMantineTheme} from '@mantine/core'
import {NavContext} from './contexts'
import {Sx} from '@mantine/styles/lib/theme/types/DefaultProps'

const RightPanelContainer = forwardRef<HTMLDivElement, PropsWithChildren<{ hrefIndex: number, sx?: Sx }>>(function RightPanelContainer(props, ref) {
  const theme = useMantineTheme()
  const router = useRouter()
  const {sideBarData, prevHrefIndex} = useContext(NavContext)!
  const [exitStyle, setExitStyle] = useState({opacity: 0, translateY: '0px'})
  useEffectOnce(() => {
    const handleRouteChange = (nextHref: string) => {
      const nextIndex = getSideBarIndex(nextHref)
      setExitStyle(nextIndex > props.hrefIndex ? {opacity: 1, translateY: '-50px'} : {opacity: 0, translateY: '50px'})
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  })

  return <>
    <Head>
      <title>{sideBarData[props.hrefIndex].children}</title>
    </Head>
    <Box
      component={m.div}
      sx={[{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.gray[0],
        overflowY: 'auto',
      }, props.sx]}
      ref={ref}
      style={{zIndex: props.hrefIndex}}
      initial={prevHrefIndex < props.hrefIndex ? {opacity: 0, translateY: '50px'} : {opacity: 1, translateY: '-50px'}}
      animate={{opacity: 1, translateY: '0px'}}
      exit={exitStyle}
      transition={{type: 'spring', bounce: 0, duration: 0.5}}>
      {props.children}
    </Box>
  </>
})

export default RightPanelContainer