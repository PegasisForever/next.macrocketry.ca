import {SideBarData} from './common'
import DesktopSideBar from './DesktopSideBar'

export default function SideBar(props: { data: SideBarData }) {
  return <>
    {/*<MobileSideBar data={props.data}/>*/}
    <DesktopSideBar data={props.data}/>
  </>
}