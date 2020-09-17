import React, { useRef } from 'react';
import { useRouter } from 'next/router'
import useSWR from 'swr' 
import { Form } from '@unform/web';
import { Scope } from '@unform/core';
import * as Yup from 'yup';
import styles from '../../styles.module.css'

import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import Selecao from '../../components/Form/Selecao';
import SeletorData from '../../components/Form/SeletorData';




const initialData = {
    name: '', 
    email: 'email@email.com',
    password: 'Digite sua senha',
    address:{
        city: '',
    }
}


function formulario(){
    const formRef = useRef(null);


    async function handleSubmit(data, {reset}){
        /*if(data.name == ""){
            formRef.current.setFieldError('name','O nome é obrigatório!');           
        }*/
        try{

            const schema = Yup.object().shape({
                name: Yup.string().required('O nome é obrigatório!'),
                email: Yup.string().email('Digite um e-mail válido').required('O e-mail é obrigatório'),
                address: Yup.object().shape({
                    city: Yup.string().min(3,'No mínimo 3 caracteres').required('A cidade é obrigatória!')
                })
            });

            await schema.validate(data, {
                abortEarly: false,
            })
            
            formRef.current.setErrors({});

            console.log(data);
            reset();
        } catch(err){
            if(err instanceof Yup.ValidationError){
                const errorMessages = {};

                err.inner.forEach(error =>{
                    errorMessages[error.path] = error.message;
                })

                formRef.current.setErrors(errorMessages);
            }
        }
    }

    return(
        <div>
            <h1 className={styles.h1}>Formulário</h1> 
            <Form ref={formRef} initialData={initialData} onSubmit={handleSubmit} className={styles.form}>
                
                Nome: <Input name="name" />
                Email: <Input name="email" />
            
                <Scope path="address">
                    Rua: <Input name="street"></Input>
                    Bairro: <Input name="neighborhood" />
                    Cidade: <Input name="city" />
                    <Selecao name="state"/>                                  
                </Scope>
                <br/>
                <SeletorData/>

                <Button />

            </Form>
           
        </div>
        
    );

    
}

export default formulario;