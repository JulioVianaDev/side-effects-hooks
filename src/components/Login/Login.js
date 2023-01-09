import React, { useState,useEffect,useReducer,useContext,useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';



const emailReducer = (state,action)=>{
  if (action.type === 'USER_INPUT'){
    return {value: action.val, isValid: action.val.includes('@')}
  }
  if (action.type === 'INPUT_BLUR'){
    return {value: state.value,isValid: state.value.includes('@')}
  }
  return {value: '',isValid: false};
}

const passwordReducer = (state,action)=>{
  if (action.type === 'USER_INPUT'){
    return {value: action.val, isValid: action.val.trim().length > 6}
  }
  if (action.type === 'INPUT_BLUR'){
    return {value: state.value,isValid: state.value.trim().length > 6}
  }
  return {value: '',isValid: false};
}

const Login = () => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);


  const initialStateEmailReducer = {value: '',isValid: undefined}
  const [emailState,dispatchEmail] = useReducer(emailReducer,initialStateEmailReducer);
  const initialStatePasswordReducer = {value: '',isValid: undefined}
  const [passwordState,dispatchPassword] = useReducer(passwordReducer,initialStatePasswordReducer);	

  const authCtx = useContext(AuthContext)
  // useEffect(()=>{
  //   // este use effect só funciona quando o projeto carrega uma vez, e a sua função de 
  //   //limpeza só vai funcionar ao encerrar o componente
  //   console.log("effect running")

  //   return ()=>{
  //     console.log("effect cleanupp")
  //   }
  // },[enteredPassword])
  const  {isValid: emailIsValid} = emailState
  const  {isValid: passwordIsValid} = passwordState
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  
  useEffect(()=>{
      //para poder fazer uma unica validação é criado um temporizador com a condicional
      //e com isto nós temos uma função que limpa ao clique
      //e isto é muito util em chamadas de api, pois assim não precisamos fazer muitas
      // requisições em api sobrecarregando o servidor  
      const identifier = setTimeout(()=>{
      console.log("digitando")
      setFormIsValid(
        emailIsValid && passwordIsValid
      )
    },500)
    return ()=>{
      console.log("limpando")
      clearTimeout(identifier);
    }
  },[emailIsValid,passwordIsValid])
 
  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT',val:event.target.value})

    setFormIsValid(
      event.target.value.includes('@') && passwordState.isValid
    );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({type: 'USER_INPUT', val: event.target.value})
    setFormIsValid(
      event.target.value.trim().length > 6 && emailState.isValid
    );
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.isValid); 
    dispatchEmail({type: 'INPUT_BLUR',})
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({type: 'INPUT_BLUR'})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid){
      authCtx.onLogin(emailState.value, passwordState.value);
    }else if(!emailIsValid){
      emailInputRef.current.activate();
    } else{
      passwordInputRef.current.activate();  
    }
  };  

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
          ref={emailInputRef}
          id="email" 
          label="email" 
          type="email" 
          isValid={emailIsValid} 
          value={emailState.value }
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <Input 
            ref={passwordInputRef}
            id="password" 
            label="password" 
            type="password" 
            isValid={passwordIsValid} 
            value={passwordState.value }
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
