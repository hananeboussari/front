import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import ImageIcon from '../../../icons/Image';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import Label from '../../Label';
import Scrollbar from '../../Scrollbar';
import { date } from 'yup/lib/locale';
import { breakpoints } from '@material-ui/system';

const formatDate = baseDate => {
  let d = new Date(baseDate);
  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  const yyyy = d.getFullYear();
  if (dd < 10) {
      dd = `0${dd}`;
  }
  if (mm < 10) {
      mm = `0${mm}`;
  }
  d = `${dd}-${mm}-${yyyy}`;
  return d;
};
const categoryOptions = [
  {
    label: 'Tous',
    value: 'all'
  },
  {
    label: "Magotteaux (TM)",
    value: "Magotteaux (TM)"
  },
  {
    label: "Cuivre granulé (LB)",
    value: "Cuivre granulé (LB)"
  },
  {
    label: "Réfractaires (LB)",
    value: "Réfractaires (LB)"
  },
  {
    label: "Acier (TN)",
    value: "Acier (TN)"
  },
  {
    label: "Anodes concassés (TM)",
    value: "Anodes concassés (TM)"
  },
  {
    label: "Transport",
    value: "Transport"
  },
  {
    label: "Balance",
    value: "Balance"
  },
  {
    label: "Autres",
    value: "Autres"
  },
  {
    label: "Environnement",
    value: "Environnement"
  },
  {
    label: "Sables revalorisés (TM)",
    value: "Sables revalorisés (TM)"
  },
  {
    label: "Location",
    value: "Location"
  },
  {
    label: "Additifs (TN)",
    value: "Additifs (TN)"
  },
  {
    label: "Sables usés (TM)",
    value: "Sables usés (TM)"
  },
  {
    label: "Sables neufs (TN)",
    value: "Sables neufs (TN)"
  }
];
const availabilityOptions = [
  {
    label: 'Tous',
    value: 'all'
  },
  {
    label: "Aujourd'hui",
    value: 'today'
  },
  {
    label: 'Cette semaine',
    value: 'week'
  },
  {
    label: 'Ce mois-ci',
    value: 'month'
  },
  {
    label: 'Cette année',
    value: 'year'
  }
];

const sortOptions = [
  {
    label: 'Date (Plus récent premier)',
    value: 'date|desc'
  },
  {
    label: 'Date (Plus vieux premier)',
    value: 'date|asc'
  },
  {
    label: '# Client court (Croissant)',
    value: 'CustomerIdShort|asc'
  },
  {
    label: '# Client court (Décroissant)',
    value: 'CustomerIdShort|desc'
  }
];

// const getInventoryLabel = (inventoryType) => {
//   const map = {
//     in_stock: {
//       text: 'In Stock',
//       color: 'success'
//     },
//     limited: {
//       text: 'Limited',
//       color: 'warning'
//     },
//     out_of_stock: {
//       text: 'Out of Stock',
//       color: 'error'
//     }
//   };

//   const { text, color } = map[inventoryType];

//   return (
//     <Label color={color}>
//       {text}
//     </Label>
//   );
// };

const applyFilters = (mainDatabases, query, filters) => mainDatabases
  .filter((mainDatabase) => {
    let matches = true;
    
    if (query && !mainDatabase.productDescription.toLowerCase().includes(query.toLowerCase()) && !mainDatabase.customerName.toLowerCase().includes(query.toLowerCase())) {
      matches = false;
    }

    if (filters.category && mainDatabase.productType !== filters.category) {
      matches = false;
    }

    if (filters.availability) {
      const now = new Date();

      if (filters.availability === 'today' && (mainDatabase.day !== now.getDate() || mainDatabase.month !== (now.getMonth() + 1) || mainDatabase.year !== now.getFullYear())) {
        matches = false;
      }

      if (filters.availability === 'week' && (mainDatabase.day < (now.getDate() - 7) || mainDatabase.month !== now.getMonth() + 1 || mainDatabase.year !== now.getFullYear())) {
        matches = false;
      }
      if (filters.availability === 'month' && (mainDatabase.month !== now.getMonth() + 1 || mainDatabase.year !== now.getFullYear())) {
        matches = false;
      }
      if (filters.availability === 'year' && mainDatabase.year !== now.getFullYear()) {
        matches = false;
      }
    }

    if (filters.inStock && ![
      'USD'
    ].includes(mainDatabase.devise)) {
      matches = false;
    }
    return matches;
  });
  const applySort = (mainDatabases, sort, valueToSort) => mainDatabases
  .sort((a,b) => {
    let order = 1;
    if (valueToSort.order !== 'asc') {
      order = -1;
    }
    let itemA = null;
    let itemB = null;
    if (sort.slice(0,4) === 'date') {
    //  itemA = new Date(a.year,a.month,a.day).getTime();
      itemA = a.year * 366 + a.month * 31 + a.day;
      // if (a.year === 2022 && a.month > 2) {
      //   console.log('|||||||||||||||||||||||||||||||||');
      //   console.log(a.year);
      //   console.log(a.month);
      //   console.log(a.day);
      //   console.log(itemA);
      // }
    //  itemB = new Date(b.year,b.month,b.day).getTime();
      itemB = b.year * 366 + b.month * 31 + b.day;
      // if (b.year === 2022 && b.month > 2) {
      //   console.log('##############################');
      //   console.log(b.year);
      //   console.log(b.month);
      //   console.log(b.day);
      //   console.log(itemB);
      //   console.log('|||||||||||||||||||||||||||||||||');
      // }
    } else {
      itemA = a.customerIdShort;
      itemB = b.customerIdShort;

    } 
    return itemA > itemB ? 1 * order : -1 * order;
  });  
const applyPagination = (mainDatabases, page, limit) => mainDatabases
  .slice(page * limit, page * limit + limit);
const MainDatabaseListTable = (props) => {
  const { mainDatabases, ...other } = props;
  const [selectedMainDatabases, setSelectedMainDatabases] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [valueToSort, setValueToSort] = useState({
    order: 'desc',
    value: []
  });
  // console.log(valueToSort);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    category: null,
    availability: null, 
    inStock: null
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
  
  const handleAvailabilityChange = (event) => {
    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      availability: value
    }));
  };

  const handleStockChange = (event) => {
    let value = null;

    if (event.target.checked) {
      value = true;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      inStock: value
    }));
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    const newValue = event.target.value.slice(0,4);
    const newOrder = event.target.value.slice(-3);
    if (newValue === 'date') {
      setValueToSort({
        order: newOrder,
        value: mainDatabases.map(p => new Date(p.year,p.month,p.day).getTime())
      });
    } else {
      setValueToSort({
        order: newOrder,
        value: mainDatabases.map(p => p.customerIdShort)
      });
    }
    // sortAscending();
  };
  const handleSelectAllMainDatabases = (event, mainDatabaseId) => {
    setSelectedMainDatabases(event.target.checked
      ? mainDatabases.map((mainDatabase) => mainDatabaseId)
      : []);
  };

  const handleSelectOneMainDatabase = (event, mainDatabaseId) => {
    if (!selectedMainDatabases.includes(mainDatabaseId)) {
      setSelectedMainDatabases((prevSelected) => [...prevSelected, mainDatabaseId]);
    } else {
      setSelectedMainDatabases((prevSelected) => prevSelected.filter((id) => id !== mainDatabaseId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredMainDatabases = applyFilters(mainDatabases, query, filters);
  const sortedMainDatabase = applySort(filteredMainDatabases, sort, valueToSort);
  const paginatedMainDatabases = applyPagination(filteredMainDatabases, page, limit);
  const enableBulkActions = selectedMainDatabases.length > 0;
  const selectedSomeMainDatabases = selectedMainDatabases.length > 0
    && selectedMainDatabases.length < mainDatabases.length;
  const selectedAllMainDatabases = selectedMainDatabases.length === mainDatabases.length;

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
            placeholder="Recherche dans la base de données"
            value={query}
            variant="outlined"
          />
        </Box>
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 240
          }}
        >
          <TextField
            label="Trier par"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 240
          }}
        >
          <TextField
            fullWidth
            label="Categories"
            name="category"
            onChange={handleCategoryChange}
            select
            SelectProps={{ native: true }}
            value={filters.category || 'all'}
            variant="outlined"
          >
            {categoryOptions.map((categoryOption) => (
              <option
                key={categoryOption.value}
                value={categoryOption.value}
              >
                {categoryOption.label}
              </option>
            ))}
          </TextField>
        </Box>
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 240
          }}
        >
          <TextField
            fullWidth
            label="Filtrer par date"
            name="availability"
            onChange={handleAvailabilityChange}
            select
            SelectProps={{ native: true }}
            value={filters.availability || 'all'}
            variant="outlined"
          >
            {availabilityOptions.map((availabilityOption) => (
              <option
                key={availabilityOption.value}
                value={availabilityOption.value}
              >
                {availabilityOption.label}
              </option>
            ))}
          </TextField>
        </Box>
        <Box sx={{ m: 2 }}>
          <FormControlLabel
            control={(
              <Switch
                checked={!!filters.inStock}
                color="primary"
                name="inStock"
                onChange={handleStockChange}
              />
            )}
            label="Client en USD"
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
              checked={selectedAllMainDatabases}
              color="primary"
              indeterminate={selectedSomeMainDatabases}
              onChange={handleSelectAllMainDatabases}
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
              Modifier
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
                  N° de Client
                </TableCell>
                <TableCell>
                  N°  Client court
                </TableCell>
                <TableCell>
                  Devise
                </TableCell>
                <TableCell>
                  Nom du client
                </TableCell>
                <TableCell>
                  N° de produit
                </TableCell>
                <TableCell>
                  Description produits
                </TableCell>
                <TableCell>
                  Quantité
                </TableCell>
                <TableCell>
                  Quantité convertie KG
                </TableCell>
                <TableCell>
                  Valeur
                </TableCell>
                <TableCell nowrap="nowrap">
                  Date
                </TableCell>
                <TableCell>
                  Offre
                </TableCell>
                <TableCell>
                  Valeur convertie
                </TableCell>
                <TableCell>
                  Année financière
                </TableCell>
                <TableCell>
                  Période financière
                </TableCell>
                <TableCell>
                  Année
                </TableCell>
                <TableCell>
                  Mois
                </TableCell>
                <TableCell>
                  Semestre
                </TableCell>
                <TableCell>
                  Jour
                </TableCell>
                <TableCell>
                  Code long
                </TableCell>
                <TableCell>
                  N° Environnement
                </TableCell>
                <TableCell>
                  Format
                </TableCell>
                {/* <TableCell align="right">
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
                {paginatedMainDatabases.map((mainDatabase) => {
                  const isMainDatabaseSelected = selectedMainDatabases.includes(Object.values(mainDatabase)[0]);
                  return (
                    <TableRow
                      hover
                      key={Object.values(mainDatabase)[0]}
                      selected={isMainDatabaseSelected}
                    >
                      <TableCell>
                        {mainDatabase.customerId}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.customerIdShort}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.devise}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.customerName}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.productNumber}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.productDescription}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.quantity}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.quantityInKg}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.price}
                      </TableCell>
                      <TableCell nowrap="nowrap">
                        {formatDate(mainDatabase.date)}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.productType}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.priceConverted}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.financialYear}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.financialPeriod}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.year}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.month}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.semester}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.day}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.longCode}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.environnmentNumber}
                      </TableCell>
                      <TableCell>
                        {mainDatabase.format}
                      </TableCell>
                      {/* <TableCell align="right">
                        <IconButton>
                          <PencilAltIcon fontSize="small" />
                        </IconButton>
                        <IconButton>
                          <ArrowRightIcon fontSize="small" />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
            
          </Table>
          <TablePagination
            component="div"
            count={filteredMainDatabases.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25, 50, 100,1000]}
          />
        </Box>
      </Scrollbar>
    </Card>
  );
};

MainDatabaseListTable.propTypes = {
  mainDatabases: PropTypes.array.isRequired
};

export default MainDatabaseListTable;
