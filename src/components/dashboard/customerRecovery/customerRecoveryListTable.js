import { useState } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
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
    const matches = true;

    return matches;
  });

const applyPagination = (customerRecoveryDatas, page, limit) => customerRecoveryDatas
  .slice(page * limit, page * limit + limit);

const CustomerRecoveryListTable = (props) => {
  const { customerRecoveryDatas, ...other } = props;
  const [selectedcustomerRecoveryDatas, setSelectedcustomerRecoveryDatas] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    year: null,
    month: null
  });
  const getYears = () => {
    const years = [];
    customerRecoveryDatas.map(year => {
        if (years.indexOf(year.object.year) === -1 && year.object.year) {
            years.push(year.object.year);
        }
        return years;
    });

    return years.sort().reverse();
    };
    const getDatas = () => {
      const datas = [];
      const customers = [];
      let row = {};
      customerRecoveryDatas.map(customerRaw => {
        if (customers.indexOf(customerRaw.object.customerName) === -1) {
          customers.push(customerRaw.object.customerName);
          row = { 
            customer: customerRaw.object.customerName,
            products: [{
              product: customerRaw.object.product,
              years: [{
                year: customerRaw.object.year, 
                months: [{ month: customerRaw.object.month, total: customerRaw.total }], 
                refMonth: [customerRaw.object.month] 
              }], 
              refYear: [customerRaw.object.year] 
            }],
            refProduct: [customerRaw.object.product] 
          };
          datas.push(row);
        } else {
          datas.map(customerMod => {
            if (customerRaw.object.customerName === customerMod.customer) {
              if (customerMod.refProduct.indexOf(customerRaw.object.product) === -1) {
                customerMod.products.push({
                  product: customerRaw.object.product,
                  years: [{ year: customerRaw.object.year,months: [{ month: customerRaw.object.month, total: customerRaw.total }],refMonth: [customerRaw.object.month] }], 
                  refYear: [customerRaw.object.year] 
                });
                customerMod.refProduct.push(customerRaw.object.product);
              } else {
                customerMod.products.map(product => {
                  if (product.product === customerRaw.object.product) {
                    if (product.refYear.indexOf(customerRaw.object.year) === -1 && customerRaw.object.year) {
                      product.years.push({ year: customerRaw.object.year, months: [{ month: customerRaw.object.month, total: customerRaw.total }], refMonth: [customerRaw.object.month] });
                      product.refYear.push(customerRaw.object.year);
                    } else {
                      product.years.map(productYear => {
                        if (productYear.year === customerRaw.object.year) {
                          if (productYear.refMonth.indexOf(customerRaw.object.month) === -1) {
                            productYear.months.push({ month: customerRaw.object.month, total: customerRaw.total });
                            productYear.refMonth.push(customerRaw.object.month);
                          }
                        }
                      return productYear;
                      });
                    }
                  }
                  return product;
                });
              }
              
            }
            return customerMod;
          });
        }
        return datas;
      });
      datas.map(customer => {
        customer.products.map(product => {
          const yearTotal = getYears();
          if (product.refYear.length < yearTotal.length) {
            yearTotal.map((m) => {
              if (product.refYear.indexOf(m) === -1 && m) {
                product.years.push({ year: m, months: [{ month: 1, total: 0 }], refMonth: [1] });
                product.refYear.push(m);
              }
              return product.years;
            });
          } else {
            yearTotal.map((m) => {
              if (!m) {
                product.years.splice(product.refYear.indexOf(m),1);
              }
              return m;
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
                return year;
              });
            }
            year.months.sort((a,b) => {
              console.log();
              return a.month > b.month ? 1 : -1;
            });
            year.refMonth.sort();
            
            return year;
          });
          return product;
        });
        customer.products.sort((a,b) => {
          console.log();
          return a.product > b.product ? 1 : -1;
        });
        return customer;
      });
      datas.sort((a,b) => {
        console.log();
        return a.customer > b.customer ? 1 : -1;
      });
      return datas;
    };

  const handleYearChange = (event) => {
    let value = null;
  
    if (event.target.value !== 2021) {
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
  const filteredcustomerRecoveryDatas = applyFilters(customerRecoveryDatas, filters);
  const organisedcustomerRecoveryDatas = getDatas(filteredcustomerRecoveryDatas);
  
  const getTotal = () => {
    let sum = 0;
    organisedcustomerRecoveryDatas.map(client => {
      client.products.map(product => {
        product.years[((filters.year || 2021) - getYears().at(-1))].months.map(month => {
          sum += month.total;
          return sum;
        });
        return sum;
      });
      return sum;
    });
    return sum;
  };
  const getValues = (product) => {
    const values = [];
    let sumProduct = 0;
    values.push(product.product);
    product.years[((filters.year || 2021) - getYears().at(-1))].months.map(month => {
      sumProduct += month.total;
      values.push(month.total);
      return month.total;
    });
    values.push(sumProduct);
    return values;
  };
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
                <TableCell width="250">
                  Nom du client
                </TableCell>
                <TableRow>
                  <TableCell width="100">
                    Nom du produit
                  </TableCell>
                  {monthsOptions.slice(1).map(m => {
                    console.log();
                    return (
                      <TableCell 
                        width="80"
                        align="right" 
                      >
                        {m.value}
                      </TableCell>
                    );
                  })}
                  <TableCell 
                    width="100"
                    align="right" 
                  >
                    Total en Tonnes
                  </TableCell>
                </TableRow>
              </TableRow>
            </TableHead>
            {other.download && (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            )}
            {!other.download && (
              <TableBody>
                {organisedcustomerRecoveryDatas.map((customerTravelInfo) => {
                  let haveProduct = false;
                  customerTravelInfo.products.map(product => {
                    if (getValues(product)[13] > 0) {
                      haveProduct = true;
                    }
                    return haveProduct;
                  });
                  if (haveProduct) {
                    return (
                      <TableRow>
                        <TableCell width="250">
                          {customerTravelInfo.customer}
                        </TableCell>
                        {customerTravelInfo.products.map(product => {
                          let rowValue = [];
                          rowValue = getValues(product);
                          if (rowValue[13] > 0) {
                            return (
                              <TableRow>
                                <TableCell 
                                  width="100"
                                  align="center"
                                >
                                  {rowValue.shift()}
                                </TableCell>
                                {rowValue.map(value => {
                                  console.log();
                                  return (
                                    <TableCell 
                                      width="80"
                                      align="right"
                                    >
                                      {numeral(value).format(`0`)}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          }
                          return <></>;
                        })}
                      </TableRow>
                    );
                  }
                  return <></>;
                })}
                
                <TableRow>
                  <TableCell 
                    width="250"
                  >
                    Total général
                  </TableCell>
                  <TableRow>
                    <TableCell width="150">
                      {}
                    </TableCell>
                    {monthsOptions.slice(1).map((month) => {
                      let sum = 0;
                      organisedcustomerRecoveryDatas.map(customerTravelInfo => {
                        customerTravelInfo.products.map(product => {
                          sum += product.years[((filters.year || 2021) - getYears().at(-1))].months[month.value - 1].total;
                          return sum; 
                        });
                        return sum;
                      });
                      return (
                        <TableCell 
                          width="80"
                          align="right"
                        >
                          {numeral(sum).format(`0`)}
                        </TableCell>
                      );
                    })}
                    <TableCell 
                      width="80"
                      align="right"
                    >
                      {numeral(getTotal()).format(`0`)}
                    </TableCell>
                  </TableRow>
                </TableRow>
              </TableBody>
            )}
          </Table>
          {/* <TablePagination
            component="div"
            count={filteredcustomerRecoveryDatas.length}
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

CustomerRecoveryListTable.propTypes = {
    customerRecoveryDatas: PropTypes.array.isRequired
};

export default CustomerRecoveryListTable;
