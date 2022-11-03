import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import numeral from 'numeral';
import PropTypes from 'prop-types';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowRightIcon from '../../../icons/ArrowRight';
import ImageIcon from '../../../icons/Image';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import Label from '../../Label';
import Scrollbar from '../../Scrollbar';
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

const applyFilters = (products, query, filters) => products
  .filter((product) => {
      let matches = true;
    if (query) {
      const properties = ['productNumber'];
      let containsQuery = false;
      console.log(product);

      properties.forEach((property) => {
        console.log(typeof product);

        if (product.productNumber) {
          if (product[property].toLowerCase().includes(query.toLowerCase())) {
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

const applyPagination = (products, page, limit) => products
  .slice(page * limit, page * limit + limit);

const ProductListTable = (props) => {
  const { products, ...other } = props;
  const [selectedProducts, setSelectedProducts] = useState([]);
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

  const handleSelectAllProducts = (event) => {
    setSelectedProducts(event.target.checked
      ? products.map((product) => product.id)
      : []);
  };

  const handleSelectOneProduct = (event, productId) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredProducts = applyFilters(products, query, filters);
  const paginatedProducts = applyPagination(filteredProducts, page, limit);
  const enableBulkActions = selectedProducts.length > 0;
  const selectedSomeProducts = selectedProducts.length > 0
    && selectedProducts.length < products.length;
  const selectedAllProducts = selectedProducts.length === products.length;

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
            placeholder="Recherchez par numéro produit"
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
              checked={selectedAllProducts}
              color="primary"
              indeterminate={selectedSomeProducts}
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
                  N° de produit
                </TableCell>
                <TableCell>
                  Description de Produit
                </TableCell>
                <TableCell>
                  Type de Produit
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
                {paginatedProducts.map((product) => {
                  const isProductSelected = selectedProducts.includes(product.productNumber);

                  return (
                    <TableRow
                      hover
                      key={product.productNumber}
                      selected={isProductSelected}
                    >
                      <TableCell>
                        {product.productNumber}
                      </TableCell>
                      <TableCell>
                        {product.productDescription}
                      </TableCell>
                      <TableCell>
                        {product.productType}
                      </TableCell>
                      <TableCell>
                        {product.format}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton href={"/dashboard/products/edit/".concat(product.productNumber)}>
                          <PencilAltIcon 
                            fontSize="small"
                          />
                        </IconButton>
                        <IconButton href={"/dashboard/products/delete/".concat(product.productNumber)}>
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
            count={filteredProducts.length}
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

ProductListTable.propTypes = {
  products: PropTypes.array.isRequired
};

export default ProductListTable;
