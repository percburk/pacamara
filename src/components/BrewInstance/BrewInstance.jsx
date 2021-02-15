import { useSelector, useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
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
} from '@material-ui/core';
import {
  ExpandMore,
  Close,
  ThumbUp,
  ThumbDown,
  ThumbsUpDownOutlined,
} from '@material-ui/icons';

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
}));

function BrewInstance({ instance, id }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useSelector((store) => store.methods);

  const formattedDate = DateTime.fromISO(instance.date).toFormat('LLL d');

  const methodUsed = methods.reduce((method, entry) => {
    if (entry.id === instance.methods_id) {
      method = entry;
    }
    return method;
  }, {});

  return (
    <Accordion elevation={4}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            dispatch({
              type: 'LIKE_BREW',
              payload: {
                coffeeId: id,
                brewId: instance.id,
                status: instance.liked,
              },
            });
          }}
          onFocus={(event) => event.stopPropagation()}
        >
          {instance.liked === 'yes' ? (
            <ThumbUp color="primary" fontSize="small" />
          ) : instance.liked === 'no' ? (
            <ThumbDown fontSize="small" />
          ) : (
            <ThumbsUpDownOutlined fontSize="small" />
          )}
        </IconButton>
        <Typography className={classes.dateMethod}>
          {formattedDate} with {methodUsed.name}
        </Typography>
        <Typography className={classes.summary}>
          Water: {instance.water_dose}g
        </Typography>
        <Typography className={classes.summary}>
          Coffee: {instance.coffee_dose}g
        </Typography>
        <Typography className={classes.summary}>
          Grind Setting: {instance.grind}
        </Typography>
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
              <TableCell>{instance.ratio}</TableCell>
              <TableCell>{instance.time}</TableCell>
              <TableCell>{instance.tds}%</TableCell>
              <TableCell>{instance.ext}%</TableCell>
              <TableCell>{methodUsed.lrr}</TableCell>
              <TableCell>{instance.moisture}%</TableCell>
              <TableCell>{instance.co2}%</TableCell>
              <TableCell>{instance.water_temp}&deg;</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="right"
          paddingLeft={2}
        >
          <IconButton
            onClick={() => {
              dispatch({
                type: 'DELETE_BREW',
                payload: { coffeeId: id, brewId: instance.id },
              });
              dispatch({ type: 'SNACKBARS_DELETED_BREW' });
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default BrewInstance;
