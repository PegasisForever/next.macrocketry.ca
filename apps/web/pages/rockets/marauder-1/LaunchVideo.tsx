import Image from 'next/image'
import launchSiteImage from './images/launch_site.jpg'
import {Box, Button, Group, Text, Title} from '@mantine/core'
import {IconMapPin, IconPlayerPlay} from '@tabler/icons'
import {useMarauder1Styles} from './index.page'

export default function LaunchVideo(){
  const {classes, theme} = useMarauder1Styles()

  return <Box sx={{
    height: '100vh',
    position: 'relative',
    color: theme.white,
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
    <Group align={'center'} sx={{
      height: '100%',
    }}>
      <Box sx={theme => ({
        padding: 32,
        width: 470,
        marginLeft: 64,

        [`@media (min-width: 1700px)`]:{
          padding: 64,
          width: 700,
          marginLeft: 96,
        },

        backgroundColor: theme.fn.rgba(theme.black, 0.1),
        backdropFilter: 'blur(32px)',
      })}>
        <Title order={1} sx={{
          fontWeight: 500,
          fontSize: 48,
          lineHeight: 1,
        }}>
          <span className={classes.marauderFont}>
            Marauder I
          </span>
          &apos;s First Launch
        </Title>
        <Text size={'lg'} mt={24} sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <IconMapPin/>
          <span style={{marginLeft: 4}}>
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
}