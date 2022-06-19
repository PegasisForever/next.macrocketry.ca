import {Button, Loader, Stack, Text, Title, useMantineTheme} from '@mantine/core'
import {useEffect} from 'react'
import {useRouter} from 'next/router'
import {useModals} from '@mantine/modals'
import useFetch from 'react-fetch-hook'

export default function PrepareAdmin() {
  const {error, data} = useFetch('/admin', {
    formatter: (response) => response.text(),
  })
  const router = useRouter()
  const theme = useMantineTheme()
  const modals = useModals()

  useEffect(() => {
    if (data) {
      router.replace('/admin')
    }
  }, [router, data])

  useEffect(() => {
    if (error) {
      console.error(error)
      modals.openModal({
        centered: true,
        overlayBlur: 10,
        overlayColor: theme.fn.rgba(theme.black, 0.4),
        withCloseButton: false,
        padding: 'xl',
        children: <Stack align={'center'}>
          <Title order={2} sx={{
            fontWeight: 500,
            textAlign: 'center',
          }}>
            Failed to prepare admin panel
          </Title>
          <Button size={'md'} onClick={() => router.reload()}>
            Retry
          </Button>
        </Stack>,
      })
    }
  }, [error])

  return <Stack align={'center'} justify={'center'} sx={{
    width: '100vw',
    height: '100vh',
  }}>
    <Loader size={75}/>
    <Text size={'xl'}>
      Preparing admin panel..... This might take up to 1 minute.
    </Text>
  </Stack>
}