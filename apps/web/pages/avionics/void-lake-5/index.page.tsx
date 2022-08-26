import RightPanelContainer from '../../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../../contexts'
import {Box, Group, Stack, Text, useMantineTheme} from '@mantine/core'
import pcbSchema from './images/pcb_schema.png'
import pcbLayout from './images/pcb_layout.png'
import pcb2d from './images/pcb_2d.png'
import Image from 'next/image'
import {Sx} from '@mantine/styles/lib/theme/types/DefaultProps'
import {forwardRef, PropsWithChildren, ReactNode, useEffect, useRef, useState} from 'react'
import {useMeasure, useWindowSize} from 'react-use'
import {useMergedRef} from '@mantine/hooks'
import {MotionValue, useElementScroll, useTransform} from 'framer-motion'

export default function VoidLake5Page() {
  const theme = useMantineTheme()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const {scrollY} = useElementScroll(scrollContainerRef)

  return <RightPanelContainer hrefIndex={3} sx={{
    overflowY: 'hidden',
    backgroundColor: theme.colors.gray[9],
  }}>
    <Box ref={scrollContainerRef} sx={{
      position: 'relative',
      left: 0,
      top: 0,
      right: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>
      <ParallaxContainer
        sx={{
          height: '100vh',
        }}
        noneParallax={<Stack spacing={8} align={'center'} justify={'center'} sx={{
          width: '100%',
          height: '100%',
          backgroundColor: theme.fn.rgba(theme.black, 0.5),
          opacity: 0.999,
          color: theme.white,
        }}>
          <Group align={'flex-start'}>
            <Box component={'span'} sx={{
              fontWeight: 500,
              fontSize: 96,
              lineHeight: '100%',
              textShadow: `0 0 10px ${theme.fn.rgba(theme.black, 0.5)}`,
            }}>
              VOID LAKE
            </Box>
            <Box component={'span'} sx={{
              filter: `drop-shadow(0 0 6px ${theme.fn.rgba(theme.black, 0.5)})`,
              marginTop: 20,
            }}>
              <Box component={'span'} sx={{
                fontWeight: 500,
                fontSize: 20,
                color: theme.colors.gray[7],
                backgroundColor: theme.white,

                padding: '2px 12px',
                lineHeight: '100%',
                clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)',
              }}>
                V5
              </Box>
            </Box>

          </Group>
          <Text size={'lg'} sx={{
            textShadow: `0 0 6px ${theme.black}`,
          }}>
            Striving Perfection
          </Text>
        </Stack>}>
        <Image
          priority
          src={pcbSchema}
          placeholder={'blur'}
          layout={'fill'}
        />
      </ParallaxContainer>
      <PCBLayoutSection/>
      <PCB2DSection/>
      <PCB3DSection scrollY={scrollY}/>
    </Box>
  </RightPanelContainer>
}

function PCBLayoutSection() {
  const [ref, {width: containerWidth}] = useMeasure<HTMLDivElement>()
  const {height: windowHeight} = useWindowSize()

  const paddingX = 64
  const imageWidth = containerWidth - paddingX * 2
  const imageHeight = pcbLayout.height / (pcbLayout.width / imageWidth)
  const paddingTop = (windowHeight - imageHeight) / 2


  return <ParallaxContainer
    ref={ref}
    sx={{
      height: imageHeight + paddingTop,
    }}
    innerSx={{
      paddingTop,
      paddingLeft: paddingX,
      paddingRight: paddingX,
    }}>
    <Image
      priority
      src={pcbLayout}
      placeholder={'blur'}
      layout={'responsive'}
    />
  </ParallaxContainer>
}

function PCB2DSection() {
  const [ref, {width: containerWidth}] = useMeasure<HTMLDivElement>()
  const {height: windowHeight} = useWindowSize()

  const paddingX = 64
  const imageWidth = containerWidth - paddingX * 2
  const imageHeight = pcbLayout.height / (pcbLayout.width / imageWidth)
  const paddingTop = (windowHeight - imageHeight) / 2

  return <ParallaxContainer
    ref={ref}
    sx={{
      height: imageHeight,
    }}
    innerSx={{
      height: imageHeight + paddingTop,
      paddingTop,
      paddingLeft: paddingX,
      paddingRight: paddingX,
    }}>
    <Image
      priority
      src={pcb2d}
      placeholder={'blur'}
      layout={'responsive'}
    />
  </ParallaxContainer>
}

function PCB3DSection(props: { scrollY: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastProgress = useRef<number>(0)
  const ref1 = useRef<HTMLDivElement>(null)
  const [ref2, {width: containerWidth}] = useMeasure<HTMLDivElement>()
  // @ts-ignore
  const mergedRef = useMergedRef(ref1, ref2)

  const [absoluteTop, setAbsoluteTop] = useState(0)
  const {height: windowHeight} = useWindowSize()
  const videoProgress = useTransform(props.scrollY, [absoluteTop + windowHeight, absoluteTop + windowHeight * 2], [0, 1])


  const paddingLeft = 8
  const paddingRight = 8
  const imageWidth = containerWidth - paddingLeft - paddingRight
  const imageHeight = 1080 / (1920 / imageWidth)
  const paddingTop = (windowHeight - imageHeight) / 2

  useEffect(() => {
    if (ref1.current) {
      const rect = ref1.current.getBoundingClientRect()
      const absoluteTop = rect.top + props.scrollY.get()
      setAbsoluteTop(absoluteTop + 300)
    }
  }, [props.scrollY, ref1])

  useEffect(() => videoProgress.onChange(p => {
    p = Math.round(p * 26) / 26
    console.log(p)
    if (videoRef.current && lastProgress.current !== p) {
      videoRef.current.currentTime = p
      lastProgress.current = p
    }
  }), [videoProgress])

  return <ParallaxContainer
    ref={mergedRef}
    sx={{
      height: '300vh',
    }}
    innerSx={{
      paddingTop,
      paddingLeft,
      paddingRight,
    }}>
    <video ref={videoRef} width={'100%'} loop muted playsInline>
      <source src={'/videos/3d.webm'} type={'video/webm'}/>
      <source src={'/videos/3d.mov'} type={'video/mp4; codecs="hvc1"'}/>
    </video>
  </ParallaxContainer>
}

const ParallaxContainer = forwardRef<HTMLDivElement, PropsWithChildren<{ sx?: Sx, innerSx?: Sx, noneParallax?: ReactNode }>>(function ParallaxContainer(props, ref) {
    return <Box ref={ref} sx={[{
      position: 'relative',
      width: '100%',
      backfaceVisibility: 'hidden',
      overflow: 'hidden',
      clipPath: 'inset(0 0 0 0)',
    }, props.sx]}>
      <Box sx={[{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }, props.innerSx]}>
        {props.children}
      </Box>
      {props.noneParallax}
    </Box>
  },
)

export const getStaticProps: GetStaticProps<PropsWithSideBar<{}>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}