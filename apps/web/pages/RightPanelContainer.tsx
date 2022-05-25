import {CSSProperties, forwardRef, PropsWithChildren, useState} from 'react'
import {m} from 'framer-motion'
import {useRouter} from 'next/router'
import Head from 'next/head'
import {useEffectOnce} from 'react-use'
import {getSideBarIndex, SideBarData} from './nav/common'
import {createStyles} from '@mantine/core'

const useStyles = createStyles(theme => ({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: theme.white,
    overflowY: 'auto',
  },
}))

const RightPanelContainer = forwardRef<HTMLDivElement, PropsWithChildren<{ hrefIndex: number, prevHrefIndex: number, sideBarData: SideBarData, style?: CSSProperties }>>(function RightPanelContainer(props, ref) {
  const {classes} = useStyles()
  const router = useRouter()
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
      <title>{props.sideBarData[props.hrefIndex].children}</title>
    </Head>
    <m.div ref={ref}
           style={{...props.style, zIndex: props.hrefIndex}}
           className={classes.wrapper}
           initial={props.prevHrefIndex < props.hrefIndex ? {opacity: 0, translateY: '50px'} : {opacity: 1, translateY: '-50px'}}
           animate={{opacity: 1, translateY: '0px'}}
           exit={exitStyle}
           transition={{type: 'spring', bounce: 0, duration: 0.5}}>
      {props.children}
    </m.div>
  </>
})

export default RightPanelContainer