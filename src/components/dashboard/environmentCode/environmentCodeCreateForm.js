import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  TextField,
} from '@material-ui/core';

const EnvironmentCodeCreateForm = (props) => {
  const navigate = useNavigate();
  const AddEnCodes = useCallback(async () => {
    
  });
  return (
    <Formik
      initialValues={{
        longCode: '',
        environmentNumber: '',
        productNumber: '',
        environmentDescription: '',
        format: '',
        customerId: '',
        customerName: '',
        isSubmitting: true
      }}
      validationSchema={Yup
        .object()
        .shape({
            longCode: Yup.string().min(1).required("Le code long est requis"),
            environmentNumber: Yup.number().required("Le numéro d'environnement est requis"),
            productNumber: Yup.string().min(1).required("Le type de produits est requis"),
            environmentDescription: Yup.string().min(1).required("La description d'environnement est requis"),
            format: Yup.string().min(1).required("Le format est requis"),
            customerId: Yup.number().min(1).required("Le numéro de client est requis"),
            customerName: Yup.string().min(1).required("Le nom du client est requis"),
          
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
            if (values.longCode && values.environmentNumber && values.productNumber && values.customerId && values.environmentDescription && values.customerName && values.format) {
            try {
                await fetch("https://ghislainhamel.herokuapp.com/environmentCode/create", {
                    method: 'post',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',               
                    },
                    body: JSON.stringify(values)
                }).then(response => { 
                  if (response.status === 200 || response.status === 201) {
                    toast.success('Le client est créé');
                    navigate('/dashboard/environmentCode');
                  } else {
                    toast.error('Un erreur a suervenue lors de la création de client ');
                  }
                }).catch(err => console.log(err));
            } catch (error) {
                console.log(error);
            }
          } else {
            toast.error('tous les champs sont requis');
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
                    label="Code long"
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
                    label="N° d'environnement"
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
                    label="N° produit"
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
                    label="Description d'environnement"
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
                  Ajouter environnement codes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default EnvironmentCodeCreateForm;
