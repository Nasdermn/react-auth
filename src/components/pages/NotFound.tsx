import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  return (
    <main className='main'>
      <h1 className='title'>404</h1>
      <h2 className='subtitle subtitle_separated'>Страница не найдена</h2>
      <button
        className='button clickable'
        onClick={() => {
          navigate('/');
        }}
        type='button'>
        {'-> Вернуться назад <-'}
      </button>
    </main>
  );
}

export default NotFound;
