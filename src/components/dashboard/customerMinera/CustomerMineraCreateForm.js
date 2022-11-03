import { useNavigate } from 'react-router-dom';
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

const CustomerMineraCreateForm = (props) => {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        quickbooksName: '',
        customerId: '',
        customerDescription: '',
        isSubmitting: true
      }}
      validationSchema={Yup
        .object()
        .shape({
            quickbooksName: Yup.string().max(63).min(1).required("Le nom du client est requis"),
            customerId: Yup.string().max(256).min(1).required("Le numéro de client est requis"),
            customerDescription: Yup.string(200).min(1).required("La description du client est requis")
          
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
            if (values.quickbooksName && values.customerDescription && values.customerId) {
            try {
                console.log(values);
                await fetch("https://ghislainhamel.herokuapp.com/customer/create", {
                    method: 'post',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',               
                    },
                    body: JSON.stringify(values)
                }).then(response => { 
                  if (response.status === 200 || response.status === 201) {
                    toast.success('Le client est créé');
                    navigate('/dashboard/customerMinera');
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
                    error={Boolean(touched.quickbooksName && errors.quickbooksName)}
                    fullWidth
                    helperText={touched.quickbooksName && errors.quickbooksName}
                    label="Nom dans Quickbooks"
                    name="quickbooksName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quickbooksName}
                    variant="outlined"
                  />
          
                </CardContent>
                <CardContent>
                  <TextField
                    error={Boolean(touched.customerId && errors.customerId)}
                    fullWidth
                    helperText={touched.customerId && errors.customerId}
                    label="N° de Client"
                    name="customerId"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.customerId}
                    variant="outlined"
                  />
          
                </CardContent>
                <CardContent>
                  <TextField
                    error={Boolean(touched.customerDescription && errors.customerDescription)}
                    fullWidth
                    helperText={touched.customerDescription && errors.customerDescription}
                    label="Description de client"
                    name="customerDescription"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.customerDescription}
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
                  Ajouter Client
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default CustomerMineraCreateForm;
