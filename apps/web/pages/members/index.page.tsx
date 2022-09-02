import RightPanelContainer from '../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../contexts'
import {PropsWithChildren} from 'react'
import {Title} from '@mantine/core'

type PageProp = {}

export default function Members(props: PageProp) {
  return <RightPanelContainer hrefIndex={3}>
    <MemberGroupTitle>
      Leadership
    </MemberGroupTitle>
  </RightPanelContainer>
}

function MemberGroupTitle(props:PropsWithChildren<{}>){
  return <Title>
    {props.children}
  </Title>
}


export const getStaticProps: GetStaticProps<PropsWithSideBar<PageProp>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}