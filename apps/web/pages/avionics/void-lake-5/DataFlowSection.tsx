import {Box, Center, Stack, Title, useMantineTheme} from '@mantine/core'
import {useVoidLake5Styles} from './index.page'
import {Sx} from '@mantine/styles/lib/theme/types/DefaultProps'

export function DataFlowSection() {
  const {classes} = useVoidLake5Styles()

  return <Stack p={64} align={'center'} justify={'center'} className={classes.blackSectionBackground}>
    <Title sx={{
      textAlign: 'center',
      fontWeight: 500,
      fontSize: 48,
    }}>
      Data Flow
    </Title>
    <Box className={classes.blackSectionBackground} sx={{
      marginTop: 32,
      width: '100%',
      maxWidth: 1000,
      display: 'grid',
      gridTemplateColumns: `${FlowChartBox.width}px 1fr ${FlowChartBox.width}px 1fr ${FlowChartBox.width}px 1fr ${FlowChartBox.width}px`,
      gridTemplateRows: `${FlowChartBox.height}px ${FlowChartArrow.height}px ` +
        `${FlowChartBox.height}px ${FlowChartArrow.height}px ` +
        `${FlowChartBox.height}px ${FlowChartArrow.height}px ` +
        `${FlowChartBox.height}px ${FlowChartArrow.height}px ` +
        `${FlowChartBox.height}px ${FlowChartArrow.height}px ${FlowChartBox.height}px`,
    }}>
      <FlowChartBox row={1} column={1} color={'#12B886'}/>
      <FlowChartBox row={1} column={3} color={'#12B886'}/>
      <FlowChartBox row={1} column={5} color={'#12B886'}/>
      <FlowChartBox row={1} column={7} color={'#12B886'}/>
      <FlowChartArrow row={2} column={1} start={'top'} end={'bottom'} arrow/>
      <FlowChartArrow row={2} column={3} start={'top'} end={'bottom'} arrow/>
      <FlowChartArrow row={2} column={5} start={'top'} end={'bottom'}/>
      <FlowChartArrow row={2} column={7} start={'top'} end={'bottom'} arrow/>
      <FlowChartBox row={3} column={1} color={'#15AABF'}/>
      <FlowChartBox row={3} column={3} color={'#15AABF'}/>
      <FlowChartArrow row={3} column={5} start={'top'} end={'bottom'}/>
      <FlowChartBox row={3} column={7} color={'#15AABF'}/>
      <FlowChartArrow row={3} column={2} start={'left'} end={'right'} arrow/>
      <FlowChartArrow row={4} column={3} start={'top'} end={'bottom'} arrow/>
      <FlowChartArrow row={4} column={5} start={'top'} end={'bottom'}/>
      <FlowChartArrow row={4} column={7} start={'top'} end={'bottom'}/>
      <FlowChartBox row={5} column={3} color={'#228BE6'}/>
      <FlowChartArrow row={5} column={5} start={'top'} end={'bottom'}/>
      <FlowChartArrow row={5} column={7} start={'top'} end={'bottom'}/>
      <FlowChartArrow row={6} column={3} start={'top'} end={'right'}/>
      <FlowChartArrow row={6} column={4} start={'left'} end={'bottom'} arrow/>
      <FlowChartArrow row={6} column={4} start={'right'} end={'left'}/>
      <FlowChartArrow row={6} column={5} start={'top'} end={'left'}/>
      <FlowChartArrow row={6} column={5} start={'right'} end={'left'}/>
      <FlowChartArrow row={6} column={6} start={'right'} end={'left'}/>
      <FlowChartArrow row={6} column={7} start={'top'} end={'left'}/>
      <FlowChartBox row={7} column={3} span={3} color={'#4C6EF5'}/>
      <FlowChartArrow row={8} column={3} start={'right'} end={'bottom'} arrow/>
      <FlowChartArrow row={8} column={4} start={'top'} end={'left'}/>
      <FlowChartArrow row={8} column={4} start={'top'} end={'right'}/>
      <FlowChartArrow row={8} column={5} start={'left'} end={'bottom'} arrow/>
      <FlowChartBox row={9} column={3} color={'#7950F2'}/>
      <FlowChartBox row={9} column={5} color={'#7950F2'}/>
      <FlowChartArrow row={9} column={6} start={'left'} end={'right'} arrow/>
      <FlowChartBox row={9} column={7} color={'#7950F2'}/>
      <FlowChartArrow row={10} column={7} start={'top'} end={'bottom'} arrow/>
      <FlowChartBox row={11} column={7} color={'#BE4BDB'}/>
    </Box>
  </Stack>
}

function FlowChartBox(props: { row: number, column: number, color: string, span?: number }) {
  const theme = useMantineTheme()
  const gridChildSx: Sx = {
    gridColumnStart: props.column,
    gridColumnEnd: props.span ? `span ${props.span}` : undefined,
    gridRowStart: props.row,
  }
  const color = theme.fn.lighten(theme.fn.darken(props.color, 0.3), 0.2)
  const containerSx: Sx = {
    backgroundColor: 'gray',
    width: FlowChartBox.width,
    height: FlowChartBox.height,
    borderRadius: 8,
    backgroundImage: theme.fn.gradient({from: color, to: theme.fn.lighten(color, 0.3), deg: 45}),
  }

  if (props.span) {
    return <Center sx={gridChildSx}>
      <Box sx={containerSx}>
        awa
      </Box>
    </Center>
  } else {
    return <Box sx={[gridChildSx, containerSx]}>
      awa
    </Box>
  }
}

FlowChartBox.width = 150
FlowChartBox.height = 100

type FlowChartArrowEntryPoint = 'top' | 'bottom' | 'left' | 'right'

function FlowChartArrow(props: { arrow?: boolean, row: number, column: number, start: FlowChartArrowEntryPoint, end: FlowChartArrowEntryPoint }) {
  const theme = useMantineTheme()
  const strokeWidth = 3
  const stroke = theme.colors.gray[3]

  const x1 = {
    top: '50%',
    bottom: '50%',
    left: '0%',
    right: '100%',
  }[props.start]
  const y1 = {
    top: '0%',
    bottom: '100%',
    left: '50%',
    right: '50%',
  }[props.start]
  let x2, y2
  if (props.arrow) {
    x2 = {
      top: '50%',
      bottom: '50%',
      left: '5px',
      right: `calc(100% - ${strokeWidth + 1}px)`,
    }[props.end]
    y2 = {
      top: '5px',
      bottom: `calc(100% - ${strokeWidth + 1}px)`,
      left: '50%',
      right: '50%',
    }[props.end]
  } else {
    x2 = {
      top: '50%',
      bottom: '50%',
      left: '0%',
      right: '100%',
    }[props.end]
    y2 = {
      top: '0%',
      bottom: '100%',
      left: '50%',
      right: '50%',
    }[props.end]
  }

  const arrowWidth = 10
  const arrowHeight = 10
  const arrowPoints = {
    top: `${-arrowWidth},${arrowHeight} 0,0 ${arrowWidth},${arrowHeight}`,
    bottom: `${-arrowWidth},${-arrowHeight} 0,0 ${arrowWidth},${-arrowHeight}`,
    left: `${arrowWidth},${-arrowHeight} 0,0 ${arrowWidth},${arrowHeight}`,
    right: `${-arrowWidth},${-arrowHeight} 0,0 ${-arrowWidth},${arrowHeight}`,
  }[props.end]
  const arrowTransformation = {
    top: `translate(50%,${strokeWidth}px)`,
    bottom: `translate(50%,calc(100% - ${strokeWidth}px))`,
    left: `translate(${strokeWidth}px,50%)`,
    right: `translate(calc(100% - ${strokeWidth}px),50%)`,
  }[props.end]

  return <Box component={'svg'} width={'100%'} height={'100%'} sx={{
    gridColumnStart: props.column,
    gridRowStart: props.row,
  }}>
    <Box component={'line'} x1={x1} y1={y1} x2={'50%'} y2={'50%'} sx={{
      stroke,
      strokeWidth,
      strokeLinecap: 'square',
      shapeRendering: 'crispEdges',
    }}/>
    <Box component={'line'} x1={'50%'} y1={'50%'} x2={x2} y2={y2} sx={{
      stroke,
      strokeWidth,
      strokeLinecap: 'square',
      shapeRendering: 'crispEdges',
    }}/>
    {props.arrow && <Box component={'polyline'} points={arrowPoints} sx={{
      stroke,
      strokeWidth: strokeWidth + 1,
      fill: 'transparent',
      transform: arrowTransformation,
    }}/>}
  </Box>
}

FlowChartArrow.height = 75