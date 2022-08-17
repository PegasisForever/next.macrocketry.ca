import {GetStaticProps} from 'next'
import {getSideBarData} from '../nav/sideBarDataHelper'
import {TopLevelPageProps} from '../TopLevelPageProps'
import {Box, Button, createStyles, Group, Stack, Text, Title, useMantineTheme} from '@mantine/core'
import RightPanelContainer from '../RightPanelContainer'
import launchSiteImage from './launch_site.jpg'
import Image from 'next/image'
import {IconLocation, IconMapPin, IconPlayerPlay} from '@tabler/icons'

const useStyles = createStyles(theme => ({
  marauderFont: {
    fontFamily: '"Arvo", serif',
  },
}))

export default function Marauder1Page(props: TopLevelPageProps) {
  const {classes,theme}=useStyles()

  return <RightPanelContainer hrefIndex={2} prevHrefIndex={props.prevHrefIndex} sideBarData={props.sideBarData} style={{
    background: 'black',
    color: 'white',
  }}>
    <Text sx={{
      position: 'absolute',
    }}>
      VIDEO
    </Text>
    <Box sx={{
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto',
    }}>
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
      <Box sx={{
        height: '100vh',
        position: 'relative',
      }}>
        <Image
          style={{
            position: 'absolute',
          }}
          src={launchSiteImage}
          loading={'eager'}
          placeholder={'blur'}
          layout={'fill'}
          objectFit={'cover'}
          objectPosition={'50% 50%'}
          alt={'Marauder I standing on the launch pad.'}
        />
        <Group p={64} align={'center'} sx={{
          height:'100%'
        }}>
          <Box sx={{
            padding: 32,
            width: 470,
            backgroundColor: theme.fn.rgba(theme.black, 0.1),
            backdropFilter: 'blur(32px)',
          }}>
            <Title order={1} sx={{
              fontWeight:500,
              fontSize:48,
              lineHeight:1,
            }}>
              <span className={classes.marauderFont}>
                Marauder I
              </span>
              &apos;s First Launch
            </Title>
            <Text size={'lg'} mt={24} sx={{
              display:'flex',
              alignItems:'center',
            }}>
              <IconMapPin/>
              <span style={{marginLeft:4}}>
                Launch Canada 2022, Cochrane, ON
              </span>
            </Text>
            <Text size={'lg'} mt={8}>
              After one and half year of preparation, Marauder I is finally standing on the launch pad, ready to launch.
            </Text>
            <Button
              component={'a'}
              href={'https://www.youtube.com/watch?v=SshrsCJrTgE'}
              target={'_blank'}
              rel={'noreferrer'}
              size={'lg'}
              mt={24}
              sx={{
                background: theme.white,
                color: theme.black,
                boxShadow: theme.shadows.xl,
                '&:hover': {
                  background: theme.colors.gray[1],
                },
              }}>
              <IconPlayerPlay/>
              <span style={{marginLeft: 12}}>
            Watch the Launch
          </span>
            </Button>
          </Box>
        </Group>

      </Box>

    </Box>


  </RightPanelContainer>
}

export const getStaticProps: GetStaticProps<Omit<TopLevelPageProps, 'prevHrefIndex'>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}