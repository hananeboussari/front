import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '../../../icons/Search';
import Scrollbar from '../../Scrollbar';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAltIcon from '../../../icons/PencilAlt';
import Archive from '../../../icons/Archive';

const sortOptions = [
  {
    label: 'Last update (newest first)',
    value: 'updatedAt|desc'
  },
  {
    label: 'Last update (oldest first)',
    value: 'updatedAt|asc'
  },
  {
    label: 'Creation date (newest first)',
    value: 'createdAt|desc'
  },
  {
    label: 'Creation date (oldest first)',
    value: 'createdAt|asc'
  }
];

const applyFilters = (customerMineraDatas, query, filters) => customerMineraDatas
  .filter((customerMineraData) => {
    let matches = true;
    if (query) {
      const properties = ['quickbooksName'];
      let containsQuery = false;
      console.log(customerMineraData);

      properties.forEach((property) => {
        console.log(typeof customerMineraData);

        if (customerMineraData.quickbooksName) {
          if (customerMineraData[property].toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }
    return matches;
  });

const applyPagination = (customerMineraDatas, page, limit) => customerMineraDatas
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

  const applySort = (customerMineraDatas, sort) => {
    const [orderBy, order] = sort.split('|');
    const comparator = getComparator(order, orderBy);
    const stabilizedThis = customerMineraDatas.map((el, index) => [el, index]);
  
    stabilizedThis.sort((a, b) => {
      const newOrder = comparator(a[0], b[0]);
  
      if (newOrder !== 0) {
        return newOrder;
      }
  
      return a[1] - b[1];
    });
  
    return stabilizedThis.map((el) => el[0]);
  };

const CustomerMineraListTable = (props) => {
 
  const { customerMineraDatas, ...other } = props;
  console.log(customerMineraDatas[0]);
  const [selectedCustomerDatas, setSelectedCustomerDatas] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSelectAllCustomerMinera = (event) => {
    setSelectedCustomerDatas(event.target.checked
      ? customerMineraDatas.map((product) => product.id)
      : []);
  };

  const handleSelectOneCustomerMinera = (event, productId) => {
    if (!selectedCustomerDatas.includes(productId)) {
      setSelectedCustomerDatas((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedCustomerDatas((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredCustomerMineraDatas = applyFilters(customerMineraDatas, query);
  const sortedCustomerMineraDatas = applySort(filteredCustomerMineraDatas, sort);
  const paginatedCustomerMineraDatas = applyPagination(sortedCustomerMineraDatas, page, limit);
  const enableBulkActions = selectedCustomerDatas.length > 0;
  const selectedSomeCustomerDatas = setSelectedCustomerDatas.length > 0
    && selectedCustomerDatas.length < filteredCustomerMineraDatas.length;
  const selectedAllCustomerDatas = selectedCustomerDatas.length === customerMineraDatas.length;

  return (
    <Card {...other}>
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
            placeholder="Recherchez par nom client dans Quickbooks"
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
              pl: '4px',
              position: 'absolute',
              pr: '4px',
              width: '100%',
              zIndex: 2
            }}
          >
            <Checkbox
              checked={selectedAllCustomerDatas}
              color="primary"
              indeterminate={selectedSomeCustomerDatas}
              onChange={handleSelectAllCustomerMinera}
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
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Nom client dans Quickbooks
                </TableCell>
                <TableCell>
                  N° de Client
                </TableCell>
                <TableCell>
                  Description de client
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            {other.download && (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            )}
            {!other.download && (
              <TableBody>
                {paginatedCustomerMineraDatas.map((customerMinera) => {
                  const isselectedCustomerDatas = selectedCustomerDatas.includes(customerMinera.id);
                  return (
                    <TableRow
                      hover
                      key={customerMinera.id}
                      selected={isselectedCustomerDatas}
                    >
                      <TableCell>
                        {customerMinera.quickbooksName}
                      </TableCell>
                      <TableCell>
                        {customerMinera.customerId}
                      </TableCell>
                      <TableCell>
                        {customerMinera.customerDescription}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton href={`/dashboard/customerMinera/edit/${customerMinera?.customerId}`}>
                          <PencilAltIcon 
                            fontSize="small"
                          />
                        </IconButton>
                        <IconButton 
                          href={`/dashboard/customerMinera/delete/${customerMinera?.customerId}`} 
                        >
                          <Archive fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
          <TablePagination
            component="div"
            count={filteredCustomerMineraDatas.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </Scrollbar>
    </Card>
  );
};

CustomerMineraListTable.propTypes = {
  customerMineraDatas: PropTypes.array.isRequired
};

export default CustomerMineraListTable;
