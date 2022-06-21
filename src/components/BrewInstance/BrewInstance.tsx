import { ChangeEvent } from 'react'
import { DateTime } from 'luxon'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import {
  ExpandMore,
  ThumbUp,
  ThumbDown,
  ThumbsUpDownOutlined,
} from '@material-ui/icons'
// Hooks
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatchSelector'
// Models
import { Brew } from '../../models/modelResource'
import { SagaActions } from '../../models/redux/sagaResource'
// Components
import EditDeleteBrewMenu from '../EditDeleteBrewMenu/EditDeleteBrewMenu'

// Styling
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  dateMethod: {
    flexBasis: '35%',
    flexShrink: 0,
    alignSelf: 'center',
    paddingInlineStart: 10,
  },
  summary: {
    flexBasis: '20%',
    flexShrink: 0,
    alignSelf: 'center',
  },
}))

interface Props {
  coffeeId: number
  instance: Brew
  accordionOpen: number | boolean
  handleAccordion: (id: number) => (event: ChangeEvent<{}>, expanded: boolean) => void
}

// BrewInstance is the accordion that is displayed on CoffeeDetails for each
// entry on the 'brews' table
export default function BrewInstance({
  coffeeId,
  instance,
  accordionOpen,
  handleAccordion,
}: Props) {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const methods = useAppSelector((store) => store.methods)
  const {
    id,
    methodsId,
    liked,
    date,
    waterDose,
    coffeeDose,
    grind,
    moisture,
    co2,
    ratio,
    tds,
    ext,
    waterTemp,
    time,
    lrr,
  } = instance
  const formattedDate = DateTime.fromISO(date).toFormat('LLL d')
  // Finds the name of the brew method used, searching by ID
  const methodUsed = methods.find((method) => method.id === methodsId)?.name

  return (
    <Accordion
      elevation={4}
      expanded={accordionOpen === id}
      onChange={handleAccordion(id)}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <IconButton
          onClick={(event) => {
            event.stopPropagation()
            dispatch({
              type: SagaActions.LIKE_BREW,
              payload: { coffeeId, brewId: id, change: liked },
            })
          }}
          onFocus={(event) => event.stopPropagation()}
        >
          {liked === 'yes' ? (
            <ThumbUp color="primary" fontSize="small" />
          ) : liked === 'no' ? (
            <ThumbDown fontSize="small" />
          ) : (
            <ThumbsUpDownOutlined fontSize="small" />
          )}
        </IconButton>
        <Typography className={classes.dateMethod}>
          {formattedDate} with {methodUsed}
        </Typography>
        <Typography className={classes.summary}>Water: {waterDose}g</Typography>
        <Typography className={classes.summary}>Coffee: {coffeeDose}g</Typography>
        <Typography className={classes.summary}>Grind: #{grind}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ratio</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>TDS</TableCell>
              <TableCell>EXT</TableCell>
              <TableCell>LRR</TableCell>
              <TableCell>Moisture</TableCell>
              <TableCell>Co2</TableCell>
              <TableCell>Temp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{ratio}</TableCell>
              <TableCell>{time}</TableCell>
              <TableCell>{tds}%</TableCell>
              <TableCell>{ext}%</TableCell>
              <TableCell>{lrr}</TableCell>
              <TableCell>{moisture}%</TableCell>
              <TableCell>{co2}%</TableCell>
              <TableCell>{waterTemp}&deg;</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box display="flex" alignItems="center" justifyContent="right" paddingLeft={2}>
          <EditDeleteBrewMenu instance={instance} />
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
