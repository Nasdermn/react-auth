import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AxiosError } from 'axios';
import Api from '../../api';
import { IConfirmForm } from '../../types';

function Confirm() {
  const { register, handleSubmit, formState, reset } = useForm<IConfirmForm>({
    mode: 'onChange',
  });

  const codeError = formState.errors['code']?.message;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const onSubmit: SubmitHandler<IConfirmForm> = async (data) => {
    setLoading(true);
    setError(null);
    const { code } = data;

    try {
      const res = await Api.confirm(code);
      if (res.success) {
        navigate('/signin');
      }
    } catch (err) {
      err instanceof AxiosError && err.response
        ? err.response.status === 400
          ? setError(
              'Ошибка при подтверждении: введён неправильный код (или время подтверждения истекло).',
            )
          : setError(`Ошибка при подтверждении. ${err.response.data.message}`)
        : setError(`Ошибка при подтверждении. ${err}`);
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
      <h1 className='title'>Подтверждение почты</h1>
      <form className='form' onSubmit={handleSubmit(onSubmit)} onReset={handleReset}>
        <label className='label' htmlFor='code'>
          Код подтверждения
        </label>
        <input
          id='code'
          className={loading ? 'input disabled' : 'input'}
          type='text'
          {...register('code', {
            required: 'Поле обязательно для заполнения.',
            pattern: {
              value: /^[a-zA-Z0-9]{10}$/i,
              message:
                'Код должен состоять только из латиницы и цифр, а также быть длиной в 10 символов.',
            },
          })}
          required
          placeholder='Введите 10-значный код'
        />
        {codeError && <p className='error'>{codeError}</p>}
        <button
          className={
            !formState.isValid || loading || formState.isSubmitting
              ? 'button disabled'
              : 'button clickable'
          }
          type='submit'
          disabled={!formState.isValid || loading || formState.isSubmitting}>
          Отправить
        </button>
        <button
          className={loading || formState.isSubmitting ? 'button disabled' : 'button clickable'}
          type='reset'
          disabled={loading || formState.isSubmitting}>
          Сбросить
        </button>
        <p className='text text_streamed'>Введите код, отправленный на вашу почту {email}</p>
        <p className='text text_streamed'>Если вы не видите письма, проверьте папку со спамом.</p>
        {error && <p className='error error_big'>{error}</p>}
      </form>

      <p className='text'>Зарегистрировались не с той почты?</p>
      <Link className='link clickable' to='/signup'>
        {'-> Ввести другую почту <-'}
      </Link>
    </main>
  );
}

export default Confirm;
