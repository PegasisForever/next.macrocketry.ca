import type {GetStaticProps} from 'next'
import {getSideBarData} from './nav/sideBarDataHelper'
import RightPanelContainer from './RightPanelContainer'
import Image from 'next/image'
import {useState} from 'react'
import {useEffectOnce, useInterval} from 'react-use'
import {ActionIcon, Anchor, Box, Center, createStyles, Group, Stack, Text, Title, useMantineTheme} from '@mantine/core'
import {gql, request} from 'graphql-request'
import {getGraphQLUrl} from './ssrUtils'
import {PropsWithSideBar} from './contexts'
import marauder1Image from './rockets/marauder-1/images/launch_site.jpg'
import NoSSR from './components/NoSSR'
import {atomWithStorage} from 'jotai/utils'
import {useAtom} from 'jotai'
import {IconX} from '@tabler/icons'

const useStyles = createStyles(theme => ({
  backgroundImage: {
    position: 'absolute',
  },
  teamDesc: {
    lineHeight: '28px',
    fontSize: 18,
  },
  blurBackground: {
    backdropFilter: 'blur(32px)',
    color: theme.black,
  },
}))

function BlinkingCursor(props: { intervalMs: number }) {
  const [show, setShow] = useState(false)
  useInterval(() => {
    setShow(old => !old)
  }, props.intervalMs)

  return <span style={{
    opacity: show ? 1 : 0,
  }}>_</span>
}

function TypeWriter(props: { children: string, intervalMs: number }) {
  const [text, setText] = useState(props.children[0])
  useEffectOnce(() => {
    if (typeof window !== 'undefined') {
      let intervalID: number
      let i = 1
      intervalID = window.setInterval(() => {
        setText(props.children.substring(0, i))
        if (i === props.children.length) window.clearInterval(intervalID)
        i++
      }, props.intervalMs)

      return () => window.clearInterval(intervalID)
    }
  })

  return <>
    {text}
    <BlinkingCursor intervalMs={500}/>
  </>
}

function IncreasingCounter(props: { number: number, intervalMs: number }) {
  const [number, setNumber] = useState(0)
  useEffectOnce(() => {
    if (typeof window !== 'undefined' && props.number !== 0) {
      let intervalID: number
      let i = 1
      intervalID = window.setInterval(() => {
        setNumber(i)
        if (i === props.number) window.clearInterval(intervalID)
        i++
      }, props.intervalMs)

      return () => window.clearInterval(intervalID)
    }
  })

  return <>
    {number}
  </>
}

function NumberCard(props: { title: string, number: number }) {
  const {classes, theme} = useStyles()

  return <Stack
    justify={'center'} spacing={8}
    className={classes.blurBackground}
    sx={{
      height: 96,
      borderRadius: 12,
      width: '100%',
      maxWidth: 160,
      textAlign: 'center',
      backgroundColor: theme.fn.rgba(theme.white, 0.2),
    }}>
    <Text className={'text-5xl font-medium tracking-widest'} sx={{
      fontSize: 48,
      lineHeight: '48px',
      fontWeight: 500,
      letterSpacing: 4.8,
    }}>
      <IncreasingCounter number={props.number} intervalMs={50}/>
    </Text>
    <Text className={'tracking-widest mt-1 text-sm text-center'} sx={{
      fontSize: 14,
      lineHeight: '14px',
      letterSpacing: 1.4,
    }}>
      {props.title}
    </Text>
  </Stack>
}

const showSponsorBannerAtom = atomWithStorage('showSponsorBanner', true)

function SponsorBanner() {
  const theme = useMantineTheme()
  const [show, setShow] = useAtom(showSponsorBannerAtom)

  if (!show) return null

  return <Group
    py={4}
    spacing={24}
    position={'center'}
    sx={{
      position: 'absolute',
      zIndex: 11,
      left: 0,
      top: 0,
      right: 0,
      backgroundColor: theme.colors.blue[6],
      color: theme.white,
    }}>
    <Box component={'span'} sx={{
      fontWeight: 700,
      fontSize: 18,
    }}>
      Sponsor US!
    </Box>
    {' '}
    <Anchor sx={{
      fontSize: 18,
      color: theme.white,
      textDecoration: 'underline',
      textUnderlineOffset: 1,
      textDecorationColor: theme.white,
    }} href={'/Sponsorship Package 2022 V1.pdf'} target={'_blank'} rel={'noreferrer'}>
      Sponsor Package
    </Anchor>
    <ActionIcon
      variant={'hover'}
      onClick={() => setShow(false)}
      sx={{
        position: 'absolute',
        right: 4,
        top: 4,
        color: theme.white,
        '&:hover': {
          backgroundColor: theme.fn.rgba(theme.white, 0.3),
        },
      }}>
      <IconX/>
    </ActionIcon>
  </Group>
}

type PageProp = { numberCardData: Array<{ number: number, title: string }> }

export default function Home(props: PageProp) {
  const {classes, theme} = useStyles()

  return <RightPanelContainer hrefIndex={0}>
    <Image
      className={classes.backgroundImage}
      loading={'eager'}
      placeholder={'blur'}
      src={marauder1Image}
      layout={'fill'}
      objectFit={'cover'}
      // objectPosition={'70% 30%'}
      alt={''}/>
    <NoSSR>
      <SponsorBanner/>
    </NoSSR>
    <Stack sx={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      zIndex: 10,
      padding: 80,
    }}>
      <Center sx={{
        flexGrow: 1,
        width: '55%',
        maxWidth: 700,
      }}>
        <Box p={32} className={classes.blurBackground} sx={{
          flexGrow: 1,
          backgroundColor: theme.fn.rgba(theme.white, 0.3),
        }}>
          <Title order={2} mb={24} sx={{
            fontSize: 60,
            lineHeight: '60px',
            fontWeight: 500,
          }} className={'font-medium text-6xl text-center md:text-left'}>
            <TypeWriter intervalMs={100}>
              Fueling Innovation
            </TypeWriter>
          </Title>
          <Text className={classes.teamDesc}>
            We are a student run team based at McMaster University in Hamilton, Ontario, Canada. We design, build and launch rockets and innovative payloads. This year we are
            competing in the{' '}
            <Anchor
              className={classes.teamDesc}
              href={'http://www.launchcanada.org/'}
              target={'_blank'} rel={'noreferrer'}
              sx={{
                color: theme.black,
                textDecoration: 'underline',
                textUnderlineOffset: 2,
                textDecorationColor: theme.colors.gray[8],
              }}>
              Launch Canada Competition
            </Anchor> and building a rocket to launch to 3km (10,000ft) in altitude!
          </Text>
        </Box>
      </Center>

      <Group position={'apart'}>
        {props.numberCardData.map(data => <NumberCard key={data.title} {...data}/>)}
      </Group>
      {/*<Media greaterThanOrEqual={'md'} className={'flex justify-between w-full px-[4.75rem] mb-20'}>*/}
      {/*  {props.numberCardData.map(data => <NumberCard key={data.title} className={'mx-1'} {...data}/>)}*/}
      {/*</Media>*/}
      {/*<Media lessThan={'md'} className={'grid grid-cols-2 gap-y-4 justify-items-center w-full mb-8'}>*/}
      {/*  {props.numberCardData.map(data => <NumberCard key={data.title} {...data}/>)}*/}
      {/*</Media>*/}
    </Stack>
  </RightPanelContainer>
}

export const getStaticProps: GetStaticProps<PropsWithSideBar<PageProp>> = async () => {
  const res = await request(getGraphQLUrl(), gql`
{
  Users {
    totalDocs
  }
  
  Overview {
    launches
    successes
    rocketModels
  }
}
`)

  return {
    props: {
      sideBarData: await getSideBarData(),
      numberCardData: [
        {
          number: res.Overview.launches,
          title: 'LAUNCHES',
        },
        {
          number: res.Overview.successes,
          title: 'SUCCESSES',
        },
        {
          number: res.Overview.rocketModels,
          title: 'ROCKET MODELS',
        },
        {
          number: res.Users.totalDocs,
          title: 'MEMBERS',
        },
      ],
    },
  }
}