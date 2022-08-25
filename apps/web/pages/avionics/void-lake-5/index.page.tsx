import RightPanelContainer from '../../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../../contexts'
import {Box, Group, Stack, Text, useMantineTheme} from '@mantine/core'
import pcbSchema from './images/pcb_schema.png'
import pcbLayout from './images/pcb_layout.png'
import pcb2d from './images/pcb_2d.png'
import Image from 'next/image'
import {StaticImageData} from 'next/dist/client/image'
import {Sx} from '@mantine/styles/lib/theme/types/DefaultProps'
import {PropsWithChildren, useRef} from 'react'

export default function VoidLake5Page() {
  const theme = useMantineTheme()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return <RightPanelContainer hrefIndex={3} sx={{
    overflowY: 'hidden',
  }}>
    <Box ref={scrollContainerRef} sx={{
      position: 'relative',
      left: 0,
      top: 0,
      right: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>
      <ParallaxImage src={pcbSchema}>
        <Stack spacing={8} align={'center'} justify={'center'} sx={{
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
        </Stack>
      </ParallaxImage>
      <ParallaxImage src={pcbLayout} sx={{
        background: theme.black,
      }}/>
      <ParallaxImage src={pcb2d} sx={{
        background: theme.black,
      }}/>
    </Box>
  </RightPanelContainer>
}

function ParallaxImage(props: PropsWithChildren<{ src: StaticImageData, sx?: Sx }>) {
  return <Box sx={[{
    position: 'relative',
    height: '100vh',
    width: '100%',
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    clipPath: 'inset(0 0 0 0)',
  }, props.sx]}>
    <Box sx={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100vh',
      pointerEvents: 'none',
    }}>
      <Image
        src={props.src}
        placeholder={'blur'}
        layout={'responsive'}
        priority
        loading={'eager'}
      />
    </Box>
    {props.children}
  </Box>
}

export const getStaticProps: GetStaticProps<PropsWithSideBar<{}>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}