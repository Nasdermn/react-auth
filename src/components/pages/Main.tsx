import { useDispatch, useSelector } from 'react-redux';
import { RootState, setUserEmail, setLoggedIn } from '../../store';
import userPhoto from '../../images/user.png';

function Main() {
  const dispatch = useDispatch();
  const userEmail = useSelector((state: RootState) => state.userEmail);

  function handleLogout() {
    localStorage.removeItem('jwt');
    dispatch(setLoggedIn(false));
    dispatch(setUserEmail(''));
  }

  return (
    <main className='main'>
      <h1 className='email'>{userEmail}</h1>
      <img className='img' src={userPhoto} alt='Фотография пользователя' />
      <button className='button clickable' type='button' onClick={handleLogout}>
        Выход
      </button>
    </main>
  );
}

export default Main;
