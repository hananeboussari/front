import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ExcelRenderer } from "react-excel-renderer";
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import useMounted from '../../../hooks/useMounted';
import useSettings from '../../../hooks/useSettings';
import ChevronRightIcon from '../../../icons/ChevronRight';
import PlusIcon from '../../../icons/Plus';
import toast from 'react-hot-toast';
import gtm from '../../../lib/gtm';
import QuicbookListTable from './QuicbookListTable';
import { Icon, Upload } from "antd";

const applyPagination = (quicbookDatas, page, limit) => quicbookDatas
  .slice(page * limit, page * limit + limit);

const QuicbookCreateForm = () => {
  const [quicbookDatas,setQuicbookDatas] = useState([]);
  const { settings } = useSettings();
  const [selectedQuicbookDatas, setSelectedQuicbookDtas] = useState([]);
  const [isSubmitting,setisSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const AddToMainDatabase = event => {
    console.log('debut add');
    try {
        fetch("https://ghislainhamel.herokuapp.com/mainDatabase/createTest", {
            method: 'post',
            mode: 'cors',
            headers: {
              // 'X-Requested-With': XMLHttpRequest,
              'Content-Type': 'application/json',  
               Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhib3Vzc2FyaUBhbmdlbHNvZnR3YXJlcy5jYSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQzMjA3MDc5LCJleHAiOjE2NDM4MTE4Nzl9.ziuwnehrJD4IYlipYQj3X-MIKFLect6GlbNnLunN59A'          
            }
          
        }).then(response => { 
          console.log(response);
          if (response.status === 200 || response.status === 201) {
            toast.success('Mise à jour main database');
          } else {
            toast.error('Un probléme  est survenue');
          }
        }).catch(err => console.log(err));
    } catch (error) {
        console.log(error);
    }
};
    const handleSubmit = async event => {
      setisSubmitting(true);
      event.preventDefault();
      try {
        // console.log('Load to QB');
          fetch("https://ghislainhamel.herokuapp.com/quicbookData/create", {
              method: 'post',
              mode: 'cors',
              headers: {
                // 'X-Requested-With': XMLHttpRequest,  revoir heroku aussi
                'Content-Type': 'application/json',  
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhib3Vzc2FyaUBhbmdlbHNvZnR3YXJlcy5jYSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQzMjA3MDc5LCJleHAiOjE2NDM4MTE4Nzl9.ziuwnehrJD4IYlipYQj3X-MIKFLect6GlbNnLunN59A'          
              },
              body: JSON.stringify(quicbookDatas),
          }).then(response => { 
            if (response.status === 200 || response.status === 201) {
              // toast.success('Les données sont ajoutées');
              AddToMainDatabase();
              // AddToMainDatabase();
            } else {
              toast.error('Un probléme  est survenue');
            }
          }).catch(err => console.log(err));
      } catch (error) {
          console.log(error);
      }
  };
  
  const ajustDate = dateQB => {
    let newDate;
    if (typeof dateQB === 'string') {
      const year = Number(dateQB.slice(-4));
      const month = Number(dateQB.slice(3, -5)) - 1;
      const day = Number(dateQB.slice(0, 2));
      newDate = new Date(year, month, day);
      
    }
     return newDate;
     
  };
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

 const fileHandler = fileList => {
    const fileObj = fileList;
    // just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        const newRows = [];
        resp.rows.slice(4,-2).map((row, index) => {
            if (row && row !== "undefined") {
                newRows.push({
                  customerId: row[2],
                  customer: row[3],
                  stockUnit: row[4],
                  description: row[5],
                  quantity: row[6],
                  amount: row[7],
                  date: ajustDate(row[8])
                });
              }
        return newRows;
        });
        if (newRows.length !== 0) {
          setQuicbookDatas(newRows.slice(1,-2));
          setisSubmitting(false);
        }
        }
        
    });
    return false;
    
  };
if (quicbookDatas.length !== 0) {
  return (
    <>
      <Helmet>
        <title>Tableau de bord: Quicbooks datas | Minera</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                Quicbooks
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  Tableau de bord
                </Link>
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  Détails
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Quicbooks 
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={<PlusIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Ajouter à la BD
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <QuicbookListTable quicbookDatas={quicbookDatas} />
          </Box>
        </Container>
      </Box>
    </>
  );
} 
  return (
    <>
      <div>
        <Upload
          name="file"
          beforeUpload={fileHandler}
          multiple={false}
        >
          <Button>
            <Icon type="upload" />
            Importer
          </Button>
          <h4>Vous pouvez importer des données</h4>
        </Upload>
      </div>
      <div />
    </>
  );
};
  
export default QuicbookCreateForm;
