import { useContext } from 'react';
import UserContext from '../components/UserContext';

import Layout from '../components/Layout';

const Index = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <Layout>
      {user && <div className="user-info">
        <p>
          Hello, <strong>{user.user.email}</strong>
        </p>
        <p>Welcome to the app</p>
        <button className="btn" onClick={() => logout()}>
          Logout
        </button>
      </div>
      }
    </Layout>
  );
};

export default Index;