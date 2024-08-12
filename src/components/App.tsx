import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { setUserEmail, setLoggedIn, RootState } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import Preloader from 'react-js-loader';
import Register from './pages/Register';
import Confirm from './pages/Confirm';
import Login from './pages/Login';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import { DecodedToken } from '../types';
import { jwtDecode } from 'jwt-decode';

function App() {
  const jwt = localStorage.getItem('jwt');
  const loggedIn = useSelector((state: RootState) => state.loggedIn);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (jwt) {
      const decodedToken: DecodedToken = jwtDecode(jwt);
      dispatch(setUserEmail(decodedToken.user_info.email));
      setIsLoading(false);
    } else {
      dispatch(setLoggedIn(false));
      setIsLoading(false);
    }
  }, [jwt, dispatch]);

  return isLoading ? (
    <div className='body'>
      <Preloader size={150} bgColor='#db1168' color='#db1168' type='spinner-cub' />
    </div>
  ) : (
    <Routes>
      <Route path='/' element={!loggedIn ? <Navigate to='/signin' replace /> : <Main />} />
      <Route path='/signin' element={loggedIn ? <Navigate to='/' replace /> : <Login />} />
      <Route path='/signup' element={loggedIn ? <Navigate to='/' replace /> : <Register />} />
      <Route path='/confirm' element={loggedIn ? <Navigate to='/' replace /> : <Confirm />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
