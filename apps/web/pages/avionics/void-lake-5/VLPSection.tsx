import {useVoidLake5Styles} from './index.page'
import {Box, Group, Stack, Text, Title, useMantineTheme} from '@mantine/core'
import {PropsWithChildren} from 'react'
import {IconApiApp, IconArrowLoopLeft2, IconFeather, IconFileZip, IconLink, IconLock, TablerIcon} from '@tabler/icons'
import {VoidLake5Title} from './VoidLake5Title'

export function VLPSection() {
  const {classes} = useVoidLake5Styles()

  return <Stack p={64} align={'center'} justify={'center'} className={classes.blackSectionBackground}>
    <VoidLake5Title icon={'VLP'}>
      Void Lake Protocol
    </VoidLake5Title>
    <Text size={'xl'}>
      Our in-house communication protocol over bandwidth constrained mediums.
    </Text>
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 48,
      marginTop: 32,
    }}>
      <VLPCard title={'Handshake'} icon={IconApiApp}>
        Exchanges session key to defend against replay attacks.
      </VLPCard>
      <VLPCard title={'Encryption'} icon={IconLock}>
        Uses AES encryption for all control related packages to prevent malicious commands.
      </VLPCard>
      <VLPCard title={'Low Overhead'} icon={IconFeather}>
        Only adds 3 bytes on each package.
      </VLPCard>
      <VLPCard title={'Auto Reconnect'} icon={IconArrowLoopLeft2}>
        Ability to resume connection even after a power loss.
      </VLPCard>
      <VLPCard title={'Reliable'} icon={IconLink}>
        Employs ACK package and auto resend to maximize reliability.
      </VLPCard>
      <VLPCard title={'Compression'} icon={IconFileZip}>
        Utilizes delta compression and variable bit length to achieve around 80% compression ratio.
      </VLPCard>
    </Box>
  </Stack>
}

function VLPCard(props: PropsWithChildren<{ title: string, icon: TablerIcon }>) {
  const theme = useMantineTheme()
  return <Box sx={{
    backgroundColor: theme.colors.gray[8],
    padding: 24,
    maxWidth: 350,
    borderRadius: 8,
  }}>
    <Group spacing={8}>
      <props.icon size={30}/>
      <Title order={2} sx={{
        fontWeight: 500,
      }}>
        {props.title}
      </Title>
    </Group>
    <Text mt={8}>
      {props.children}
    </Text>
  </Box>
}