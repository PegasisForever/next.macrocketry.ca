import RightPanelContainer from '../../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../../contexts'
import {Box, Group, Stack, Text, Title, useMantineTheme} from '@mantine/core'
import pcbSchema from './images/pcb_schema.png'
import pcbLayout from './images/pcb_layout.png'
import pcb2d from './images/pcb_2d.png'
import Image from 'next/image'
import {Sx} from '@mantine/styles/lib/theme/types/DefaultProps'
import {forwardRef, PropsWithChildren, ReactNode, useEffect, useRef, useState} from 'react'
import {useMeasure, useScrollbarWidth, useWindowSize} from 'react-use'
import {MotionValue, useElementScroll, useTransform} from 'framer-motion'
import {useBoundingclientrect} from 'rooks'
import { ParallaxContainer } from './ParallaxContainer'
import {PCB3DSection} from './PCB3DSection'

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
      <Box sx={{
        height: '100vh',
        backgroundColor: theme.colors.green[4],
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

export const getStaticProps: GetStaticProps<PropsWithSideBar<{}>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}