import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AxiosError } from 'axios';
import Api from '../../api';
import { IRegisterForm } from '../../types';

function Register() {
  const { register, handleSubmit, formState, reset, watch } = useForm<IRegisterForm>({
    mode: 'onChange',
  });

  const emailError = formState.errors['email']?.message;
  const passwordError = formState.errors['password']?.message;
  const confirmPasswordError = formState.errors['confirmPassword']?.message;
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmShown, setIsConfirmShown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit: SubmitHandler<IRegisterForm> = async (data) => {
    const { email, password, confirmPassword } = data;
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await Api.register(email, password, confirmPassword);
      navigate('/confirm', { state: { email } });
    } catch (err) {
      err instanceof AxiosError && err.response
        ? err.response.status === 400
          ? setError(`Ошибка регистрации: пользователь с данной почтой уже зарегистрирован.`)
          : setError(`Ошибка регистрации. ${err.response.data.message}`)
        : setError(`Ошибка регистрации. ${err}`);
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
      <h1 className='title'>Регистрация</h1>
      <form className='form' onSubmit={handleSubmit(onSubmit)} onReset={handleReset}>
        <label className='label' htmlFor='registerEmail'>
          Email
        </label>
        <input
          id='registerEmail'
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
        <label className='label' htmlFor='registerPassword'>
          Пароль
        </label>
        <div className='password-wrapper'>
          <input
            id='registerPassword'
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

        <label className='label' htmlFor='confirmPassword'>
          Подтверждение пароля
        </label>
        <div className='password-wrapper'>
          <input
            id='confirmPassword'
            className={loading ? 'input disabled' : 'input'}
            type={isConfirmShown ? 'input' : 'password'}
            {...register('confirmPassword', {
              required: 'Поле обязательно для заполнения.',
              validate: (value) => value === password || 'Пароли не совпадают.',
              pattern: {
                value: /^[a-zA-Z0-9]{8,24}$/,
                message:
                  'Пароль может иметь от 8 до 24 символов и содержать только латиницу с цифрами.',
              },
            })}
            required
            placeholder='Введите пароль ещё раз'
          />
          {!loading && !formState.isSubmitting && (
            <button
              disabled={loading}
              type='button'
              className={
                isConfirmShown ? 'password-switch password-switch_active' : 'password-switch'
              }
              onClick={() => setIsConfirmShown(!isConfirmShown)}
            />
          )}
        </div>
        {confirmPasswordError && <p className='error'>{confirmPasswordError}</p>}

        <button
          className={
            !formState.isValid || loading || formState.isSubmitting
              ? 'button disabled'
              : 'button clickable'
          }
          type='submit'
          disabled={!formState.isValid || loading || formState.isSubmitting}>
          Зарегистрироваться
        </button>
        <button
          className={loading || formState.isSubmitting ? 'button disabled' : 'button clickable'}
          type='reset'
          disabled={loading || formState.isSubmitting}>
          Сбросить
        </button>
        {error && <p className='error error_big'>{error}</p>}
      </form>
      <p className='text'>Уже регистрировались?</p>
      <Link className='link clickable' to='/signin'>
        {'-> Авторизация <-'}
      </Link>
    </main>
  );
}

export default Register;
