import {useRouter} from 'next/router'
import useFetch from 'react-fetch-hook'
import {useEffect} from 'react'
import {Loader, Stack, Text, Title} from '@mantine/core'

export default function PrepareAdminDialog() {
  const router = useRouter()
  const {error, data} = useFetch('/admin', {
    formatter: (response) => response.text(),
  })

  useEffect(() => {
    if (data) {
      router.replace('/admin')
    }
  }, [router, data])

  useEffect(() => {
    if (error) console.error(error)
  }, [error])

  if (error) {
    return <Stack align={'center'} justify={'center'} spacing={0}>
      <Title order={2} sx={{
        fontWeight: 500,
      }}>
        Failed to prepare admin panel.
      </Title>
    </Stack>
  }
  return <Stack align={'center'} justify={'center'} spacing={0}>
    <Loader size={48}/>
    <Title order={2} mt={16} sx={{
      fontWeight: 500,
    }}>
      Preparing Admin Panel.....
    </Title>
    <Text>
      This might take up to 1 minute.
    </Text>
  </Stack>
}