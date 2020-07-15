import { Formik } from 'formik';
import * as Yup from 'yup';

import Router from 'next/router';

import Layout from '../components/Layout';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useContext, useState } from 'react';
import UserContext from '../components/UserContext';

import Api from '../helpers/api';

const schema = Yup.object().shape({
  email: Yup.string().email().required('A valid Email address is required'),
  password: Yup.string().required('A password is required'),
});

const Login = () => {
  const { login } = useContext(UserContext);
  const [message, setMessage] = useState('');

  const handleSubmit = async (values, actions) => {
    const result = await Api.userLogin(values);
    if(result.error){
      setMessage('Wrong Email/Password combination');
    } else {
      login(result);
    }

    actions.setSubmitting(false);
  }

  const initialValues = { email: '', password: '' };
  return (
    <Layout>
      <h2>Login</h2>

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
                value={values.email}
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
                value={values.password}
                isValid={touched.password && !errors.password} 
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>

            {message != '' && <div className="message">{message}</div>}

            <Button type="submit" variant="primary" disabled={isSubmitting}>Login</Button>
            <Button variant="secondary" onClick={() => Router.push('/signup')}>Create a new account</Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default Login;