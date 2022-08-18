import RightPanelContainer from './RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from './nav/sideBarDataHelper'
import PageTitle from './components/PageTItle'
import {Box, Button, Group, Stack, Textarea, TextInput, Title, useMantineTheme} from '@mantine/core'
import {IconSend} from '@tabler/icons'
import {useForm} from '@mantine/form'
import {useState} from 'react'
import {getRecaptcha} from './recaptcha'
import {useModals} from '@mantine/modals'
import {PropsWithSideBar} from './contexts'

export default function ContactPage() {
  const theme = useMantineTheme()
  const modals = useModals()
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

  const showModal = (message: string) => {
    const id = modals.openModal({
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
          {message}
        </Title>
        <Button size={'md'} onClick={() => modals.closeModal(id)}>
          OK
        </Button>
      </Stack>,
    })
  }

  return <RightPanelContainer hrefIndex={7}>
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

          showModal('Message sent! We will get back to you as soon as possible.')
          form.reset()
        } catch (e) {
          console.error(e)
          showModal('Failed to send message, please check your network.')
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
        <Textarea autosize minRows={5} required size={'md'} label={'Message'}  {...form.getInputProps('message')}/>
        <Button type={'submit'} loading={isSending} sx={{alignSelf: 'flex-end'}} size={'md'} leftIcon={<IconSend size={22}/>} pl={16}>
          Send
        </Button>
      </Box>
    </Stack>
  </RightPanelContainer>
}

export const getStaticProps: GetStaticProps<PropsWithSideBar<{}>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}