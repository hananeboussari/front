import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  IconButton,
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@material-ui/core';
import SearchIcon from '../../../icons/Search';
import Scrollbar from '../../Scrollbar';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAltIcon from '../../../icons/PencilAlt';
import Archive from '../../../icons/Archive';
import CircularProgress from '@material-ui/core/CircularProgress';

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

const applyFilters = (environmentCodeDatas, query, filters) => environmentCodeDatas
  .filter((environmentCodeData) => {
    let matches = true;
    if (query) {
      const properties = ['productNumber'];
      let containsQuery = false;
      console.log(environmentCodeData);

      properties.forEach((property) => {
        console.log(typeof environmentCodeData);

        if (environmentCodeData.customerName && environmentCodeData.productNumber && environmentCodeData.environmentNumber) {
          if (environmentCodeData[property].toString().toLowerCase().includes(query.toLowerCase())) {
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

const applyPagination = (environmentCodeDatas, page, limit) => environmentCodeDatas
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

  const applySort = (environmentCodeDatas, sort) => {
    const [orderBy, order] = sort.split('|');
    const comparator = getComparator(order, orderBy);
    const stabilizedThis = environmentCodeDatas.map((el, index) => [el, index]);
  
    stabilizedThis.sort((a, b) => {
      const newOrder = comparator(a[0], b[0]);
  
      if (newOrder !== 0) {
        return newOrder;
      }
  
      return a[1] - b[1];
    });
  
    return stabilizedThis.map((el) => el[0]);
  };

const EnvironmentCodeListTable = (props) => {
 
  const { environmentCodeDatas, ...other } = props;
  console.log(environmentCodeDatas);
  const [selectedEnvironmentCodeDatas, setSelectedEnvironmentCodeDatas] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    category: null,
    availability: null,
    inStock: null,
    isShippable: null
  });

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      category: value
    }));
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleSelectAllProducts = (event) => {
    setSelectedEnvironmentCodeDatas(event.target.checked
      ? environmentCodeDatas.map((product) => product.id)
      : []);
  };

  const handleSelectOneProduct = (event, productId) => {
    if (!selectedEnvironmentCodeDatas.includes(productId)) {
      setSelectedEnvironmentCodeDatas((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedEnvironmentCodeDatas((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredEnvironmentCodeDatas = applyFilters(environmentCodeDatas, query, filters);
  const sortedEnvironmentCodeDatas = applySort(filteredEnvironmentCodeDatas, sort);
  const paginatedEnvironmentCodeDatas = applyPagination(sortedEnvironmentCodeDatas, page, limit);
  const enableBulkActions = selectedEnvironmentCodeDatas.length > 0;
  const selectedSomeEnvironmentCodeDatas = setSelectedEnvironmentCodeDatas.length > 0
    && selectedEnvironmentCodeDatas.length < environmentCodeDatas.length;
  const selectedAllEnvironmentCodeDatas = selectedEnvironmentCodeDatas.length === environmentCodeDatas.length;

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
            placeholder="Recherchez par numéro de produit"
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
              checked={selectedAllEnvironmentCodeDatas}
              color="primary"
              indeterminate={selectedSomeEnvironmentCodeDatas}
              onChange={handleSelectAllProducts}
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
                  Code long
                </TableCell>
                <TableCell>
                  Numéro de Produit
                </TableCell>
                <TableCell>
                  Numéro Environnement
                </TableCell>
                <TableCell>
                  Nom de Client
                </TableCell>
                <TableCell>
                  Description Environnement
                </TableCell>
                <TableCell>
                  Format
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
                {paginatedEnvironmentCodeDatas.map((environmentCode) => {
                  const isSelectedEnvironmentCodeDatas = selectedEnvironmentCodeDatas.includes(environmentCode.id);

                  return (
                    <TableRow
                      hover
                      key={environmentCode.id}
                      selected={isSelectedEnvironmentCodeDatas}
                    >
                      <TableCell>
                        {environmentCode.longCode}
                      </TableCell>
                      <TableCell>
                        {environmentCode.productNumber}
                      </TableCell>
                      <TableCell>
                        {environmentCode.environmentNumber}
                      </TableCell>
                      <TableCell>
                        {environmentCode.customerName}
                      </TableCell>
                      <TableCell>
                        {environmentCode.environmentDescription}
                      </TableCell>
                      <TableCell>
                        {environmentCode.format}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton href={"/dashboard/environmentCode/edit/".concat(environmentCode.longCode)}>
                          <PencilAltIcon 
                            fontSize="small"
                          />
                        </IconButton>
                        <IconButton href={"/dashboard/environmentCode/delete/".concat(environmentCode.longCode)}>
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
            count={filteredEnvironmentCodeDatas.length}
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

EnvironmentCodeListTable.propTypes = {
  environmentCodeDatas: PropTypes.array.isRequired
};

export default EnvironmentCodeListTable;
