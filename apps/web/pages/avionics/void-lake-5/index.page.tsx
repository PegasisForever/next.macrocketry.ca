import RightPanelContainer from '../../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../../contexts'
import {Box, Group, Stack, Text, useMantineTheme} from '@mantine/core'
import pcbSchema from './images/pcb_schema.png'
import pcbLayout from './images/pcb_layout.png'
import pcb2d from './images/pcb_2d.png'
import pcb3d from './images/pcb_3d.png'
import Image from 'next/image'
import {Sx} from '@mantine/styles/lib/theme/types/DefaultProps'
import {forwardRef, PropsWithChildren, ReactNode, useRef} from 'react'
import {useMeasure, useWindowSize} from 'react-use'

export default function VoidLake5Page() {
  const theme = useMantineTheme()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
            }}>
              VOID LAKE
            </Box>
            <Box component={'span'} sx={{
              fontWeight: 500,
              fontSize: 20,
              color: theme.black,
              backgroundColor: theme.white,
              borderRadius: 8,
              marginTop: 16,
              padding: '4px 8px',
              lineHeight: '100%',
            }}>
              V5
            </Box>
          </Group>
          <Text size={'lg'}>
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
      <PCB3DSection/>
      <Box sx={{
        height: '100vh',
      }}/>
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

function PCB3DSection() {
  const [ref, {width: containerWidth}] = useMeasure<HTMLDivElement>()
  const {height: windowHeight} = useWindowSize()

  const paddingLeft = 0
  const paddingRight= 48
  const imageWidth = containerWidth - paddingLeft-paddingRight
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
      paddingLeft,
      paddingRight,
    }}>
    <Image
      priority
      src={pcb3d}
      placeholder={'blur'}
      layout={'responsive'}
    />
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