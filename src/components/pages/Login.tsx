import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import Api from '../../api';
import { setLoggedIn, setUserEmail } from '../../store';
import { DecodedToken, ILoginForm } from '../../types';

function Login() {
  const { register, handleSubmit, formState, reset } = useForm<ILoginForm>({
    mode: 'onChange',
  });

  const emailError = formState.errors['email']?.message;
  const passwordError = formState.errors['password']?.message;
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
    setLoading(true);
    setError(null);
    const { email, password } = data;
    try {
      const res = await Api.login(email, password);
      if (res.auth_token) {
        localStorage.setItem('jwt', res.auth_token);
        const decodedToken: DecodedToken = jwtDecode(res.auth_token);
        dispatch(setUserEmail(decodedToken.user_info.email));
        dispatch(setLoggedIn(true));
        navigate('/');
      }
    } catch (err) {
      err instanceof AxiosError && err.response
        ? err.response.status === 403
          ? navigate('/confirm', { state: { email } })
          : err.response.status === 400
          ? setError(`Ошибка входа: неверный логин или пароль.`)
          : setError(`Ошибка входа. ${err.response.data.message}`)
        : setError(`Ошибка входа. ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setError(null);
  };

  return (
    <main className='main'>
      <h1 className='title'>Авторизация</h1>
      <form className='form' onSubmit={handleSubmit(onSubmit)} onReset={handleReset}>
        <label className='label' htmlFor='loginEmail'>
          Email
        </label>
        <input
          id='loginEmail'
          className={loading ? 'input disabled' : 'input'}
          type='email'
          {...register('email', {
            required: 'Поле обязательно для заполнения.',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
              message: 'Введите корректный адрес электронной почты.',
            },
          })}
          required
          placeholder='Введите вашу почту'
        />
        {emailError && <p className='error'>{emailError}</p>}
        <label className='label' htmlFor='loginPassword'>
          Пароль
        </label>
        <div className='password-wrapper'>
          <input
            id='loginPassword'
            className={loading ? 'input disabled' : 'input'}
            type={isPasswordShown ? 'input' : 'password'}
            {...register('password', {
              required: 'Поле обязательно для заполнения.',
              pattern: {
                value: /^[a-zA-Z0-9]{8,24}$/,
                message:
                  'Пароль может иметь от 8 до 24 символов и содержать только латиницу с цифрами.',
              },
            })}
            required
            placeholder='Введите ваш пароль'
          />
          {!loading && !formState.isSubmitting && (
            <button
              disabled={loading}
              type='button'
              className={
                isPasswordShown ? 'password-switch password-switch_active' : 'password-switch'
              }
              onClick={() => setIsPasswordShown(!isPasswordShown)}
            />
          )}
        </div>
        {passwordError && <p className='error'>{passwordError}</p>}
        <button
          className={
            !formState.isValid || loading || formState.isSubmitting
              ? 'button disabled'
              : 'button clickable'
          }
          type='submit'
          disabled={!formState.isValid || loading || formState.isSubmitting}>
          Войти
        </button>
        <button
          className={loading || formState.isSubmitting ? 'button disabled' : 'button clickable'}
          type='reset'
          disabled={loading || formState.isSubmitting}>
          Сбросить
        </button>
        {error && <p className='error error_big'>{error}</p>}
      </form>
      <p className='text'>Ещё не зарегистрировались?</p>
      <Link className='link clickable' to='/signup'>
        {'-> Регистрация <-'}
      </Link>
    </main>
  );
}

export default Login;
