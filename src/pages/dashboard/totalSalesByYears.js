import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import DownloadIcon from '../../icons/Download';
import UploadIcon from '../../icons/Upload';
import PlusIcon from '../../icons/Plus';
import gtm from '../../lib/gtm';
import { Table,Popconfirm, Row, Col, Icon, Upload } from "antd";
import TotalSalesByYearsListTable from '../../components/dashboard/totalSalesByYears/totalSalesByYearsList';
import NoData from '../NoData';

const TotalSalesByYearsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [totalSalesByYearDatas, settotalSalesByYearDatas] = useState([]);
  const [download, setDownload] = useState(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const gettotalSalesByYearDatas = useCallback(async () => {
    try {
      //  const data = await campaignApi.getCampaigns();
      const result = await fetch(`https://ghislainhamel.herokuapp.com/totalSalesByYears/all`, {
        method: 'Get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',  
             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhib3Vzc2FyaUBhbmdlbHNvZnR3YXJlcy5jYSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQyMzgzNjQ1LCJleHAiOjE2NDI5ODg0NDV9.d4EHhvR_U4mcVbdjG55y6QHjYVu6sKSRwdYaet810IY'          
        },
        // redirect: 'follow',
        // referrerPolicy: 'no-referrer'
        // body: JSON.stringify(result)
      
    });
      const data = await result.json(); // .json().catch((error) => { console.log(error); });
      // console.log(result);
      if (mounted.current) {
        settotalSalesByYearDatas(data);
      }
    } catch (err) {
      console.error(err);
    }
    setDownload(false);
  }, [mounted]);

  useEffect(() => {
    gettotalSalesByYearDatas();
  }, [gettotalSalesByYearDatas]);

    return (
      <>
        <Helmet>
          <title>Tableau de bord: Total des ventes par année | Minera</title>
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
                  Total des ventes par année 
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
                    Analyses
                  </Link>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    Total des ventes par année 
                  </Typography>
                </Breadcrumbs>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <TotalSalesByYearsListTable 
                totalSalesByYears={totalSalesByYearDatas} 
                download={download} 
              />
            </Box>
          </Container>
        </Box>
      </>
  ); 
};

export default TotalSalesByYearsList;
