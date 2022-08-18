import RightPanelContainer from '../../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../../contexts'

export default function VoidLake5Page() {
  return <RightPanelContainer hrefIndex={3}>
    awa
  </RightPanelContainer>
}

export const getStaticProps: GetStaticProps<PropsWithSideBar<{}>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}