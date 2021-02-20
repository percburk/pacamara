import { useState } from 'react';
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

function BrewInstance({ coffeeId, instance, open }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useSelector((store) => store.methods);
  const [expanded, setExpanded] = useState(open || false);
  const {
    id,
    methods_id,
    liked,
    date,
    water_dose,
    coffee_dose,
    grind,
    moisture,
    co2,
    ratio,
    tds,
    ext,
    water_temp,
    time,
    lrr,
  } = instance;

  const formattedDate = DateTime.fromISO(date).toFormat('LLL d');
  const methodUsed = methods.find((item) => item.id === methods_id)?.name;

  const likeBrew = (event) => {
    event.stopPropagation();
    dispatch({
      type: 'LIKE_BREW',
      payload: { coffeeId, brewId: id, status: liked },
    });
  };

  const deleteBrew = () => {
    dispatch({
      type: 'DELETE_BREW',
      payload: { coffeeId, brewId: id },
    });
    dispatch({ type: 'SNACKBARS_DELETED_BREW' });
  };

  return (
    <Accordion
      elevation={4}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <IconButton
          onClick={likeBrew}
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
        <Typography className={classes.summary}>
          Water: {water_dose}g
        </Typography>
        <Typography className={classes.summary}>
          Coffee: {coffee_dose}g
        </Typography>
        <Typography className={classes.summary}>
          Grind Setting: {grind}
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
              <TableCell>{ratio}</TableCell>
              <TableCell>{time}</TableCell>
              <TableCell>{tds}%</TableCell>
              <TableCell>{ext}%</TableCell>
              <TableCell>{lrr}</TableCell>
              <TableCell>{moisture}%</TableCell>
              <TableCell>{co2}%</TableCell>
              <TableCell>{water_temp}&deg;</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="right"
          paddingLeft={2}
        >
          <IconButton onClick={deleteBrew}>
            <Close />
          </IconButton>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default BrewInstance;
