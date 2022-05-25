import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {Box, Global, Group, MantineProvider} from '@mantine/core'
import {AnimatePresence, domMax, LazyMotion} from 'framer-motion'
import {getSideBarIndex} from './nav/common'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import SideBar from './nav/SideBar'

function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter()
  const [prevHrefIndex, setPrevHrefIndex] = useState(0)
  useEffect(() => {
    const handleRouteChange = () => {
      setPrevHrefIndex(getSideBarIndex(router.route))
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  const sideBarIndex = getSideBarIndex(router.route)
  return <LazyMotion features={domMax}>
    <MantineProvider
      emotionOptions={{key: 'macrocketry'}}
      theme={{
        fontFamily: '"Barlow", sans-serif',
        headings: {
          fontFamily: '"Barlow", sans-serif',
        },
        colors: {
          mac: [
            '#88506C',
            '#824262',
            '#7E3559',
            '#7B2851',
            '#791B49',
            '#790D42',
            '#7A003C', // main color
            '#630B36',
            '#511231',
            '#43162C',
          ],
        },
      }}
      withGlobalStyles
      withNormalizeCSS>
      <Global styles={{
        body: {
          margin: 0,
          minHeight: '100vh',
        },
      }}/>
      {sideBarIndex === -1 ? <Component prevHrefIndex={prevHrefIndex} {...pageProps}/> :
        <Group spacing={0}>
          <SideBar data={pageProps.sideBarData}/>
          <Box sx={{
            boxShadow: '0 3px 100px #00000029',
            flexGrow: 1,
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <AnimatePresence initial={false}>
              <Component key={router.route} prevHrefIndex={prevHrefIndex} {...pageProps}/>
            </AnimatePresence>
          </Box>
        </Group>}
    </MantineProvider>
  </LazyMotion>
}

export default MyApp
