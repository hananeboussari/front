import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import getInitials from '../../../utils/getInitials';
import Scrollbar from '../../Scrollbar';

const formatDate = baseDate => {
  let date = new Date(baseDate);
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  if (dd < 10) {
      dd = `0${dd}`;
  }
  if (mm < 10) {
      mm = `0${mm}`;
  }
  date = `${dd}-${mm}-${yyyy}`;
  return date;
};

const sortOptions = [
  {
    label: 'N° client',
    value: 'noclient'
  },
  {
    label: 'Nom client',
    value: 'nomClient'
  },
  {
    label: 'Quantity',
    value: 'quantity'
  }
];

const applyFilters = (quicbookDatas, query, filters) => quicbookDatas
  .filter((quicbookData) => {
    let matches = true;
    if (query) {
      let containsQuery = false;
      const properties = ['customer'];
      properties.forEach((property) => {
        // console.log("Customer : ".concat(quicbookData.customer));
        // console.log("proprety : ".concat(query));
        if (quicbookData.customer) {
          if (quicbookData[property].toString().toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }
    // console.log(matches);
    return matches;
  });

const applyPagination = (quicbookDatas, page, limit) => quicbookDatas
  .slice(page * limit, page * limit + limit);

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order, orderBy) => (order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy));

const applySort = (quicbookDatas, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = quicbookDatas.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};

const QuicbookListTable = (props) => {
  const { quicbookDatas, ...other } = props;
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedquicbookDatas, setSelectedquicbookDatas] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null
  });

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleSelectAllquicbookDatas = (event) => {
    setSelectedquicbookDatas(event.target.checked
      ? quicbookDatas.map((quicbookData) => quicbookData.id)
      : []);
  };

  const handleSelectOnequicbookData = (event, quicbookDataId) => {
    if (!selectedquicbookDatas.includes(quicbookDataId)) {
      setSelectedquicbookDatas((prevSelected) => [...prevSelected, quicbookDataId]);
    } else {
      setSelectedquicbookDatas((prevSelected) => prevSelected.filter((id) => id !== quicbookDataId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };
 
  const filteredquicbookDatas = applyFilters(quicbookDatas, query, filters);
  const sortedquicbookDatas = applySort(filteredquicbookDatas, sort);
  const paginatedquicbookDatas = applyPagination(sortedquicbookDatas, page, limit);
  const enableBulkActions = selectedquicbookDatas.length > 0;
  const selectedSomequicbookDatas = selectedquicbookDatas.length > 0
    && selectedquicbookDatas.length < quicbookDatas.length;
  const selectedAllquicbookDatas = selectedquicbookDatas.length === quicbookDatas.length;

  return (
    <Card {...other}>
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          p: 2
        }}
      >
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 500
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder="Recherchez par nom client "
            value={query}
            variant="outlined"
          />
        </Box>
      </Box>
      {/* {enableBulkActions && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              mt: '6px',
              position: 'absolute',
              px: '4px',
              width: '100%',
              zIndex: 2
            }}
          >
            <Checkbox
              checked={selectedAllquicbookDatas}
              color="primary"
              indeterminate={selectedSomequicbookDatas}
              onChange={handleSelectAllquicbookDatas}
            />
            <Button
              color="primary"
              sx={{ ml: 2 }}
              variant="outlined"
            >
              Delete
            </Button>
            <Button
              color="primary"
              sx={{ ml: 2 }}
              variant="outlined"
            >
              Edit
            </Button>
          </Box>
        </Box>
      )} */}
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  N° de Facture
                </TableCell>
                <TableCell>
                  Nom de Client dans Quickbooks
                </TableCell>
                <TableCell>
                  UGS(unité de gestion de stock)
                </TableCell>
                <TableCell>
                  Mémo/description
                </TableCell>
                <TableCell>
                  Quantité
                </TableCell>
                <TableCell>
                  Montant
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
                {/* <TableCell>
                  Actions
                </TableCell> */}
              </TableRow>
            </TableHead>
            {other.download && (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            )}
            {!other.download && (
              <TableBody>
                {paginatedquicbookDatas.map((quicbookData) => {
                  const isquicbookDataselected = selectedquicbookDatas.includes(quicbookData.id);

                  return (
                    <TableRow
                      hover
                      key={quicbookData.id}
                      selected={isquicbookDataselected}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex'
                          }}
                        >
                          <Box sx={{ ml: 0 }}>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              {quicbookData.customerId}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {quicbookData.customer}
                      </TableCell>
                      <TableCell>
                        {quicbookData.stockUnit}
                      </TableCell>
                      <TableCell>
                        {quicbookData.description}
                      </TableCell>
                      <TableCell>
                        {quicbookData.quantity}
                      </TableCell>
                      <TableCell>
                        {quicbookData.amount}
                      </TableCell>
                      <TableCell>
                        {formatDate(quicbookData.date)}
                      </TableCell>
                      {/* <TableCell align="right">
                        <IconButton
                          component={RouterLink}
                          to="/dashboard/quicbookData/1/edit"
                        >
                          <PencilAltIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          component={RouterLink}
                          to="/dashboard/quicbookData/1"
                        >
                          <ArrowRightIcon fontSize="small" />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={filteredquicbookDatas.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25,30,50,60,100]}
      />
    </Card>
  );
};

QuicbookListTable.propTypes = {
  quicbookDatas: PropTypes.array.isRequired
};

export default QuicbookListTable;
