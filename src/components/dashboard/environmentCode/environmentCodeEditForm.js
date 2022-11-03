import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  TextField,
} from '@material-ui/core';

const EnvironmentCodeEditForm = (props) => {
  const navigate = useNavigate();
  const { environmentCode, ...other } = props;
  
  return (
    <Formik
      initialValues={{
        longCode: environmentCode.longCode,
        environmentNumber: environmentCode.environmentCode,
        productNumber: environmentCode.productNumber,
        environmentDescription: environmentCode.environmentDescription,
        format: environmentCode.format,
        customerId: environmentCode.customerId,
        customerName: environmentCode.customerName
      }}
      validationSchema={Yup
        .object()
        .shape({
            longCode: Yup.string().min(1).required(),
            environmentNumber: Yup.number().required(),
            productNumber: Yup.string().min(1).required(),
            environmentDescription: Yup.string().min(1).required(),
            format: Yup.string().min(1).required(),
            customerId: Yup.number().min(1).required(),
            customerName: Yup.string().min(1).required(),
          
        })}
      
    >
      {({
        errors,
        handleBlur,
        handleChange,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          onSubmit={async event => {
            event.preventDefault();
            try {
                await fetch(`https://ghislainhamel.herokuapp.com/environmentCode/update/${environmentCode.longCode}`, {
                    method: 'put',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',               
                    },
                    body: JSON.stringify(values)
                }).then(response => { 
                  if (response.status === 200 || response.status === 201) {
                    toast.success('En code est créé');
                    navigate('/dashboard/environmentCode');
                  } else {
                    toast.error('Un erreur a suervenue lors de la création du en code ');
                  }
                }).catch(err => console.log(err));
            } catch (error) {
                console.log(error);
            }
        }}
          {...props}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={8}
              md={6}
              xs={12}
            >
              <Card>
                <CardContent>
                  <TextField
                    error={Boolean(touched.longCode && errors.longCode)}
                    fullWidth
                    helperText={touched.longCode && errors.longCode}
                    label="Code longe"
                    name="longCode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.longCode}
                    variant="outlined"
                  />
          
                </CardContent>
                <CardContent>
                  <TextField
                    error={Boolean(touched.environmentNumber && errors.environmentNumber)}
                    fullWidth
                    helperText={touched.environmentNumber && errors.environmentNumber}
                    label="Environnement number"
                    name="environmentNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.environmentNumber}
                    variant="outlined"
                  />
          
                </CardContent>
                <CardContent>
                  <TextField
                    error={Boolean(touched.productNumber && errors.productNumber)}
                    fullWidth
                    helperText={touched.productNumber && errors.productNumber}
                    label="product Number"
                    name="productNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.productNumber}
                    variant="outlined"
                  />
          
                </CardContent>
                <CardContent>
                  <TextField
                    error={Boolean(touched.environmentDescription && errors.environmentDescription)}
                    fullWidth
                    helperText={touched.environmentDescription && errors.environmentDescription}
                    label="Description environnement"
                    name="environmentDescription"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.environmentDescription}
                    variant="outlined"
                  />
          
                </CardContent>
                <CardContent>
                  <TextField
                    error={Boolean(touched.format && errors.format)}
                    fullWidth
                    helperText={touched.format && errors.format}
                    label="Format"
                    name="format"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.format}
                    variant="outlined"
                  />
          
                </CardContent>
                <CardContent>
                  <TextField
                    error={Boolean(touched.customerId && errors.customerId)}
                    fullWidth
                    helperText={touched.customerId && errors.customerId}
                    label="N° client"
                    name="customerId"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.customerId}
                    variant="outlined"
                  />
          
                </CardContent>
                <CardContent>
                  <TextField
                    error={Boolean(touched.customerName && errors.customerName)}
                    fullWidth
                    helperText={touched.customerName && errors.customerName}
                    label="Nom client"
                    name="customerName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.customerName}
                    variant="outlined"
                  />
          
                </CardContent>
              </Card>
             
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xs={12}
            >
              
              {errors.submit && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.submit}
                  </FormHelperText>
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-basis',
                  mt: 1
                }}
              >
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Modifier environnement codes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};
EnvironmentCodeEditForm.propTypes = {
    environmentCode: PropTypes.object.isRequired
  };
export default EnvironmentCodeEditForm;
