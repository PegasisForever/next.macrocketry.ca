import {GetStaticProps} from 'next'
import {getSideBarData} from '../../nav/sideBarDataHelper'
import {Box, createStyles, Stack, Text, Title} from '@mantine/core'
import RightPanelContainer from '../../RightPanelContainer'
import {useCallback, useEffect, useRef, useState} from 'react'
import FlightProfile from './FlightProfile'
import {PropsWithSideBar, ScrollContext} from '../../contexts'
import {useElementScroll} from 'framer-motion'
import Overview from './Overview'
import LaunchVideo from './LaunchVideo'
import Gallery from '../../components/Gallery'
import imageA from './images/a.jpg'
import imageB from './images/b.jpg'
import imageC from './images/c.jpg'
import imageD from './images/d.jpg'
import imageE from './images/e.jpg'
import imageF from './images/f.jpg'
import imageG from './images/g.jpg'
import imageH from './images/h.jpg'
import imageI from './images/i.jpg'
import launchSiteImage from './images/launch_site.jpg'

export const useMarauder1Styles = createStyles(theme => ({
  marauderFont: {
    fontFamily: '"Arvo", serif',
  },
  title: {
    fontWeight: 500,
    fontSize: 48,
    lineHeight: 1,
  },
  subTitle: {
    fontWeight: 500,
    fontSize: 40,
  },
  blackSectionBackground: {
    background: theme.fn.linearGradient(180, theme.fn.darken(theme.colors.gray[9], 0.2), theme.colors.gray[9]),
    color: theme.white,
  },
}))

export default function Marauder1Page() {
  const {classes, theme} = useMarauder1Styles()
  const [isInsideLaunchProfile, setIsInsideLaunchProfile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const {scrollY} = useElementScroll(scrollContainerRef)
  const launchProfileRef = useRef<HTMLDivElement | null>(null)
  const scrollListener = useCallback(() => {
    const containerRect = scrollContainerRef.current?.getBoundingClientRect()
    const launchProfileRect = launchProfileRef.current?.getBoundingClientRect()
    if (containerRect && launchProfileRect) {
      setIsInsideLaunchProfile(launchProfileRect.top < containerRect.top && launchProfileRect.bottom > containerRect.bottom)
    }
  }, [])

  useEffect(() => {
    const e = scrollContainerRef.current
    const listener = scrollListener
    e?.addEventListener('scroll', listener)
    return () => {
      e?.removeEventListener('scroll', listener)
    }
  }, [scrollListener])

  return <RightPanelContainer hrefIndex={1}>
    <Text sx={{
      position: 'absolute',
      width: '100%',
      height: '100vh',
      background: theme.black,
      color: theme.white,
    }}>
      VIDEO
    </Text>
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        color: theme.white,
        scrollSnapType: isInsideLaunchProfile ? 'y mandatory' : undefined,
      }}
      ref={scrollContainerRef}>
      <ScrollContext.Provider value={scrollY}>
        <Box sx={{
          height: '125vh',
        }}>
          <Stack spacing={0} align={'center'} justify={'center'} sx={{
            height: '75vh',
          }}>
            <Title order={1} className={classes.marauderFont} sx={{
              fontWeight: 500,
              fontSize: 72,
            }}>
              MARAUDER I
            </Title>
            <Text>
              McMaster&apos;s First 3KM Rocket
            </Text>
          </Stack>
        </Box>

        <Overview/>
        <LaunchVideo/>
        <FlightProfile ref={launchProfileRef}/>

        <Gallery
          blur
          title={<Title order={1} mt={32} className={classes.title}>
            Gallery
          </Title>}
          images={[
            imageH,
            imageI,
            imageB,
            imageG,
            imageC,
            imageD,
            imageE,
            imageF,
            imageA,
            launchSiteImage,
          ]}/>
      </ScrollContext.Provider>
    </Box>
  </RightPanelContainer>
}


export const getStaticProps: GetStaticProps<PropsWithSideBar<{}>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}