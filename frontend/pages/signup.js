import { Formik } from 'formik';
import * as Yup from 'yup';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Api from '../helpers/api';
import { useContext } from 'react';
import UserContext from '../components/UserContext';
import Layout from '../components/Layout';

const schema = Yup.object().shape({
  email: Yup.string().email().required('A valid Email address is required'),
  password: Yup.string().required('A password is required'),
  password2: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const Signup = () => {
  const { signup } = useContext(UserContext);

  const handleSubmit = async (values, actions) => {
    const result = await Api.userSignup(values);
    if(result.error){
      actions.setErrors(Api.apiErrorsToFormik(result.error));
    } else {
      signup(result);
    }

    actions.setSubmitting(false);
  }

  const initialValues = { email: '', password: '' };

  return (
    <Layout>
      <h2>Signup</h2>

      <Formik onSubmit={handleSubmit} 
        validationSchema={schema} 
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={initialValues}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>           
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                onChange={handleChange} 
                isValid={touched.email && !errors.email} 
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                onChange={handleChange} 
                isValid={touched.password && !errors.password} 
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password2">
              <Form.Label>Password confirmation</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Repeat Password" 
                onChange={handleChange} 
                isValid={touched.password2 && !errors.password2} 
                isInvalid={!!errors.password2}
              />
              <Form.Control.Feedback type="invalid">{errors.password2}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" disabled={isSubmitting}>Signup</Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default Signup;