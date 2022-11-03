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

const applyFilters = (customerRecoveryDatas, filters) => customerRecoveryDatas
  .filter((customerRecovery) => {
    let matches = true;
    if (filters.year && customerRecovery.object.year) {
      if (filters.year !== customerRecovery.object.year.toString()) {
        matches = false;
      }
    }
    if (filters.semester && customerRecovery.object.semester) {
      if (filters.semester !== customerRecovery.object.semester.toString()) {
        matches = false;
      }
    }

    return matches;
  });

const applyPagination = (recoveryRevaluationDatas, page, limit) => recoveryRevaluationDatas
  .slice(page * limit, page * limit + limit);

const RecoveryRevaluationListTable = (props) => {
  const { recoveryRevaluationDatas, ...other } = props;
  const [selectedrecoveryRevaluationDatas, setSelectedrecoveryRevaluationDatas] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    year: null,
    semester: null
  });
  const getYears = () => {
    const years = [];
    recoveryRevaluationDatas.map(year => {
        if (years.indexOf(year.object.year) === -1) {
            years.push(year.object.year);
        }
        return years;
    });
    return years.sort().reverse();
    };
  const getDatas = () => {
    const data = [];
    const clients = [];
    let row = {};
    recoveryRevaluationDatas.map(d => {
      if (clients.indexOf(d.object.customerName) === -1) {
        clients.push(d.object.customerName);
        if (d.object.semester === 1) {
          row = { client: d.object.customerName, productNumber: [{ productKey: d.object.product, envCode: d.object.environmentCode, descProd: d.object.productDescription, years: [{ year: d.object.year, semester1: d.total, semester2: null }], refYear: [d.object.year] }], ref: [d.object.product] };
        } else {
          row = { client: d.object.customerName, productNumber: [{ productKey: d.object.product, envCode: d.object.environmentCode, descProd: d.object.productDescription, years: [{ year: d.object.year, semester1: null, semester2: d.total }], refYear: [d.object.year] }],ref: [d.object.product] };
        }
        
        data.push(row);
    } else {
      data.map(c => {
        if (d.object.customerName === c.client) {
          if (c.ref.indexOf(d.object.product) === -1 && d.object.product) {
            c.ref.push(d.object.product);
            if (d.object.semester === 1) {
              c.productNumber.push({ productKey: d.object.product, envCode: d.object.environmentCode, descProd: d.object.productDescription, years: [{ year: d.object.year, semester1: d.total, semester2: null }], refYear: [d.object.year] });
            } else {
              c.productNumber.push({ productKey: d.object.product, envCode: d.object.environmentCode, descProd: d.object.productDescription, years: [{ year: d.object.year, semester1: null, semester2: d.total }], refYear: [d.object.year] });
            }
          } else {
            c.productNumber.map(product => {
              if (d.object.product === product.productKey) {
                if (product.refYear.indexOf(d.object.year) === -1) {
                  product.refYear.push(d.object.year);
                  if (d.object.semester === 1) {
                    product.years.push({ year: d.object.year, semester1: d.total, semester2: null });
                  } else {
                    product.years.push({ year: d.object.year, semester1: null, semester2: d.total });
                  }
                } else {
                  product.years.map(year => {
                    if (d.object.year === year.year) {
                      if (d.object.semester === 1) {
                        year.semester1 = d.total;
                      } else {
                        year.semester2 = d.total;
                      }
                    }
                    return year;
                  });
                }
              }
              return product;
            });
          }
        }
        return c;
      });
    }
     return data;
    });
    data.map(customer => {
      customer.productNumber.map(product => {
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
            return m;
          });
        }
        product.years.sort((a,b) => {
          console.log();
          return a.year > b.year ? 1 : -1;
        });
        product.refYear.sort();
        
        return product;
      });
      customer.productNumber.sort((a,b) => {
        console.log();
        return a.envCode > b.envCode ? 1 : -1;
      });
      return customer;
    });
    data.sort((a,b) => {
      console.log();
      return a.client > b.client ? 1 : -1;
    });
    return data;
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
  const organisedrecoveryRevaluationDatas = getDatas(recoveryRevaluationDatas);
  // const filteredrecoveryRevaluationDatas = applyFilters(recoveryRevaluationDatas, filters);
  const paginatedrecoveryRevaluationDatas = applyPagination(organisedrecoveryRevaluationDatas, page, limit);

  const getTotal = () => {
    const sum = [0,0,0];
    organisedrecoveryRevaluationDatas.map(client => {
      client.productNumber.map(product => {
        if (product.years[((filters.year || 2021) - getYears().at(-1))].semester1) {
          sum[0] += product.years[((filters.year || 2021) - getYears().at(-1))].semester1;
          sum[2] += product.years[((filters.year || 2021) - getYears().at(-1))].semester1;
        }
        if (product.years[((filters.year || 2021) - getYears().at(-1))].semester2) {
          sum[1] += product.years[((filters.year || 2021) - getYears().at(-1))].semester2;
          sum[2] += product.years[((filters.year || 2021) - getYears().at(-1))].semester2;
        }
        return sum;
      });
      return sum;
    });
    return sum;
  };
  const getValues = (product) => {
    const rowValues = [];
    rowValues.push(product.years[((filters.year || 2021) - getYears().at(-1))].semester1);
    rowValues.push(product.years[((filters.year || 2021) - getYears().at(-1))].semester2);
    rowValues.push(rowValues[0] + rowValues[1]);
    return rowValues;
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
        <Box>
          &emsp;&emsp;&emsp;&ensp;
          Total du semestre 1:&ensp;
          {numeral(getTotal()[0]).format(`0.00`)}
        </Box>
        <Box>
          &emsp;&emsp;&emsp;&ensp;
          Total du semestre 2:&ensp;
          {numeral(getTotal()[1]).format(`0.00`)}
        </Box>
        <Box>
          &emsp;&emsp;&emsp;&ensp;
          Grand total:&ensp;
          {numeral(getTotal()[2]).format(`0.00`)}
        </Box>
      </Box>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Nom du client
                </TableCell>
                <TableRow>
                  <TableCell width="150">
                    Code Environnement
                  </TableCell>
                  <TableCell width="150">
                    Code du produit
                  </TableCell>
                  <TableCell width="150">
                    Description du produit
                  </TableCell>
                  <TableCell width="120">
                    Semestre 1 &ensp;
                  </TableCell>
                  <TableCell width="120">
                    Semestre 2
                  </TableCell>
                  <TableCell width="120">
                    Total 
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
                {organisedrecoveryRevaluationDatas.map((recoveryRevaluation) => {
                  let haveProduct = false;
                  recoveryRevaluation.productNumber.map(product => {
                    if (getValues(product)[2] > 0) {
                      haveProduct = true;
                    }
                    return haveProduct;
                  });
                  if (haveProduct) {
                    return (
                      <TableRow key={recoveryRevaluation.client}>
                        <TableCell>
                          {recoveryRevaluation.client}
                        </TableCell>
                        {recoveryRevaluation.productNumber.map((product) => {
                          const rowValue = getValues(product);
                          if (rowValue[2] > 0) {
                            return (
                              <TableRow>
                                <TableCell width="150">
                                  {product.envCode}
                                </TableCell>
                                <TableCell width="150">
                                  {product.productKey}
                                </TableCell>
                                <TableCell width="150">
                                  {product.descProd}
                                </TableCell>
                                <TableCell 
                                  width="120"
                                  align="right"
                                >
                                  {numeral(rowValue[0]).format(`0.00`)}
                                </TableCell>
                                <TableCell 
                                  width="120"
                                  align="right"
                                >
                                  {numeral(rowValue[1]).format(`0.00`)}
                                </TableCell>
                                <TableCell 
                                  width="120"
                                  align="right"
                                >
                                  {numeral(rowValue[2]).format(`0.00`)}
                                </TableCell>
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
              </TableBody>
            )}
          </Table>
          {/* <TablePagination
            component="div"
            count={organisedrecoveryRevaluationDatas.length}
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

RecoveryRevaluationListTable.propTypes = {
    recoveryRevaluationDatas: PropTypes.array.isRequired
};

export default RecoveryRevaluationListTable;
