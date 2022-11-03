import { useState } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import Label from '../../Label';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Select,
  MenuItem,
  InputLabel
} from '@material-ui/core';

import Scrollbar from '../../Scrollbar';

const monthsOptions = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Janvier',
    value: 1
  },
  {
    label: 'Février',
    value: 2
  },
  {
    label: 'Mars',
    value: 3
  },
  {
    label: 'Avril',
    value: 4
  },
  {
    label: 'Mai',
    value: 5
  },
  {
    label: 'Juin',
    value: 6
  },
  {
    label: 'Juillet',
    value: 7
  },
  {
    label: 'Août',
    value: 8
  },
  {
    label: 'Septembre',
    value: 9
  },
  {
    label: 'Octobre',
    value: 10
  },
  {
    label: 'Novembre',
    value: 11
  },
  {
    label: 'Décembre',
    value: 12
  }
];

const applyFilters = (customerRecoveryDatas, filters) => customerRecoveryDatas
  .filter((customerRecovery) => {
    let matches = true;
    
    if (filters.month && customerRecovery.object.month) {
      if (filters.month !== customerRecovery.object.month.toString()) {
        matches = false;
      }
    }

    return matches;
  });

const applyPagination = (totalSalesByYears, page, limit) => totalSalesByYears
  .slice(page * limit, page * limit + limit);

const TotalSalesByYearsListTable = (props) => {
  const { totalSalesByYears, ...other } = props;
  const [selectedtotalSalesByYears, setSelectedtotalSalesByYears] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    year: null,
    month: null
  });

  const getYears = () => {
    const years = [];
    totalSalesByYears.map(year => {
        if (years.indexOf(year.object.year) === -1) {
            years.push(year.object.year);
        }
        return years;
    });

    return years.sort().reverse();
    };
  const getDatas = () => {
      const datas = [];
      const products = [];
      let row = {};
      totalSalesByYears.map(productRaw => {
        if (products.indexOf(productRaw.object.product) === -1) {
          products.push(productRaw.object.product);
          row = { product: productRaw.object.product, years: [{ year: productRaw.object.year, months: [{ month: productRaw.object.month, total: productRaw.total }], refMonth: [productRaw.object.month] }], refYear: [productRaw.object.year] };
          datas.push(row);
      } else {
        datas.map(productMod => {
          if (productRaw.object.product === productMod.product) {
           if (productMod.refYear.indexOf(productRaw.object.year) === -1) {
              productMod.years.push({ year: productRaw.object.year, months: [{ month: productRaw.object.month, total: productRaw.total }], refMonth: [productRaw.object.month] });
              productMod.refYear.push(productRaw.object.year);
           } else {
              productMod.years.map(productYear => {
                if (productYear.year === productRaw.object.year) {
                  if (productYear.refMonth.indexOf(productRaw.object.month) === -1) {
                    productYear.months.push({ month: productRaw.object.month, total: productRaw.total });
                    productYear.refMonth.push(productRaw.object.month);
                  }
                }
              return productYear;
            });
           }
         }
         return productMod;
        });
      }
       return datas;
      });
      datas.map(product => {
        const yearTotal = getYears();
        if (product.refYear.length < yearTotal.length) {
          yearTotal.map((m) => {
            if (product.refYear.indexOf(m) === -1 && m) {
              product.years.push({ year: m, months: [{ month: 1, total: 0 }], refMonth: [1] });
            }
            return product.years;
          });
        } else {
          yearTotal.map((m) => {
            if (!m) {
              product.years.splice(product.refYear.indexOf(m),1);
            }
            return product.years;
          });
        }
        product.years.sort((a,b) => {
          console.log();
          return a.year > b.year ? 1 : -1;
        });
        product.refYear.sort();
        product.years.map(year => {
          if (year.refMonth.length < 12) {
            const refMonth2 = [1,2,3,4,5,6,7,8,9,10,11,12];
            refMonth2.map((m) => {
              if (year.refMonth.indexOf(m) === -1) {
                year.months.push({ month: m , total: 0 });
                year.refMonth.push(m);
              }
              return year.months;
            });
          }
          year.months.sort((a,b) => {
            console.log();
            return a.month > b.month ? 1 : -1;
          });
          year.refMonth.sort();
          
          return datas;
        });
        return datas;
      });
      datas.sort((a,b) => {
        console.log();
        return a.product > b.product ? 1 : -1;
      });
      datas.shift();
      return datas;
    };

  const handleMonthChange = (event) => {
    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      month: value
    }));
  };

  const handleYearChange = (event) => {
    let value = null;
  
    if (event.target.value !== 'all') {
      value = event.target.value;
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      year: value
    }));
  };
 
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredtotalSalesByYears = applyFilters(totalSalesByYears, filters);
  const organisedtotalSalesByYears = getDatas(filteredtotalSalesByYears);
  // const paginatedtotalSalesByYears = applyPagination(filteredtotalSalesByYears, page, limit);

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
            width: 240
          }}
        >
          <InputLabel id="testLabel">Année</InputLabel>
          <Select
            fullWidth
            labelId="testLabel"
            label="Année"
            onChange={handleYearChange}
            value={filters.year || 2021}
          >
            {getYears().map((year) => {
              console.log();
              return (
                <MenuItem value={year}>{year}</MenuItem>
              );
            })}
          </Select>
        </Box>
      </Box>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  N° Produit
                </TableCell>
                {monthsOptions.slice(1).map(m => {
                  console.log();
                  return (
                    <TableCell align="right">
                      {m.value}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            {other.download && (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            )}
            {!other.download && (
              <TableBody>
                {organisedtotalSalesByYears.map((totalSales) => {
                  // const istotalSalesByYearselected = selectedtotalSalesByYears.includes(totalSales.id);
                  console.log();
                  return (
                    <TableRow
                      hover
                      key={totalSales.product}
                    >
                      <TableCell>
                        {totalSales.product}
                      </TableCell>
                      {totalSales.years[((filters.year || 2021) - 2014)].months.map(month => {
                        console.log();
                        return (
                          <TableCell align="right">
                            {numeral(month.total).format(`0.00`)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
                
                <TableRow>
                  <TableCell>
                    Total
                  </TableCell>
                  {monthsOptions.slice(1).map((month) => {
                    let sum = 0;
                    organisedtotalSalesByYears.map(totalSales => {
                      console.log(sum);
                      sum += totalSales.years[((filters.year || 2021) - 2014)].months[month.value - 1].total;
                      return sum; 
                    });
                    return (
                      <TableCell align="right">
                        {numeral(sum).format(`0.00`)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            )}
          </Table>
          {/* <TablePagination
            component="div"
            count={organisedtotalSalesByYears.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25,50]}
          /> */}
        </Box>
      </Scrollbar>
    </Card>
  );
};

TotalSalesByYearsListTable.propTypes = {
    totalSalesByYears: PropTypes.array.isRequired
};

export default TotalSalesByYearsListTable;
