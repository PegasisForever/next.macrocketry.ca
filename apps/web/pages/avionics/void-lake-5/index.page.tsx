import RightPanelContainer from '../../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../../contexts'
import {Box, createStyles, Group, Stack, Text, Title} from '@mantine/core'
import pcbSchema from './images/pcb_schema.png'
import pcbLayout from './images/pcb_layout.png'
import pcb2d from './images/pcb_2d.png'
import Image from 'next/image'
import {useRef} from 'react'
import {useMeasure, useWindowSize} from 'react-use'
import {useElementScroll} from 'framer-motion'
import {ParallaxContainer} from './ParallaxContainer'
import {PCB3DSection} from './PCB3DSection'
import {DataFlowSection} from './DataFlowSection'
import {VLPSection} from './VLPSection'
import Gallery from '../../components/Gallery'
import imageA from './images/a.jpg'
import imageB from './images/b.jpg'
import imageC from './images/c.jpg'
import imageD from './images/d.jpg'

export const useVoidLake5Styles = createStyles(theme => ({
  blackSectionBackground: {
    background: theme.fn.linearGradient(180, theme.fn.darken(theme.colors.gray[9], 0.2), theme.colors.gray[9]),
    color: theme.white,
  },
  title: {
    fontWeight: 500,
    fontSize: 48,
  },
}))

export default function VoidLake5Page() {
  const {classes, theme} = useVoidLake5Styles()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const {scrollY} = useElementScroll(scrollContainerRef)

  return <RightPanelContainer hrefIndex={2} sx={{
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
        innerSx={{
          height: '100%',
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
          objectFit={'cover'}
        />
      </ParallaxContainer>
      <PCBLayoutSection/>
      <PCB2DSection/>
      <PCB3DSection scrollY={scrollY}/>
      <DataFlowSection/>
      <VLPSection/>
      <Gallery
        className={classes.blackSectionBackground}
        title={<Title order={1} mt={32} className={classes.title} sx={{
          lineHeight: 1,
        }}>
          Gallery
        </Title>}
        images={[
          imageA,
          imageB,
          imageC,
          imageD,
        ]}/>
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

export const getStaticProps: GetStaticProps<PropsWithSideBar<{}>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}