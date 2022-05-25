import {TopLevelPageProps} from './TopLevelPageProps'
import RightPanelContainer from './RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from './nav/sideBarDataHelper'
import PageTitle from './components/PageTItle'
import {Box, Button, Group, Stack, Textarea, TextInput} from '@mantine/core'
import {Send} from 'tabler-icons-react'
import {useForm} from '@mantine/form'
import {useState} from 'react'
import {getRecaptcha} from './recaptcha'

type PageProp = TopLevelPageProps

export default function Teams(props: PageProp) {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },

    validate: {
      email: v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(v) ? null : 'Email is invalid.',
    },
  })
  const [isSending, setIsSending] = useState(false)


  return <RightPanelContainer hrefIndex={6} prevHrefIndex={props.prevHrefIndex} sideBarData={props.sideBarData}>
    <Stack p={64} justify={'center'} align={'center'} sx={{
      height: '100%',
      overflowY: 'auto',
    }}>
      <Box component={'form'} sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 24,
        width: '100%',
        maxWidth: 700,
      }} onSubmit={form.onSubmit(async v => {
        try {
          setIsSending(true)
          const recaptcha = getRecaptcha()
          const recaptchaToken = await recaptcha?.execute('send_message')
          const res = await fetch('/api/send_message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recaptchaToken,
              ...v,
            }),
          })
          if (res.status >= 500) {
            throw new Error(`Server responded with code ${res.status}: ${await res.text()}`)
          }
        } catch (e) {
          console.error(e)
        } finally {
          setIsSending(false)
        }
      })}>
        <PageTitle size={60}>
          Contact Us
        </PageTitle>
        <Group spacing={24} align={'start'}>
          <TextInput required size={'md'} label={'Name'} sx={{flexGrow: 1}} {...form.getInputProps('name')}/>
          <TextInput required size={'md'} label={'Email'} sx={{flexGrow: 1}} {...form.getInputProps('email')}/>
        </Group>
        <Textarea required size={'md'} label={'Message'} {...form.getInputProps('message')}/>
        <Button type={'submit'} loading={isSending} sx={{alignSelf: 'flex-end'}} size={'md'} leftIcon={<Send size={20}/>} pl={16}>
          Send
        </Button>
      </Box>
    </Stack>
  </RightPanelContainer>
}

export const getStaticProps: GetStaticProps<Omit<PageProp, 'prevHrefIndex'>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}