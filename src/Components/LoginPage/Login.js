import { useState } from 'react';
import './Login.css';

import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const [errors, setErrors] = useState({})
    const [isvalid, setIsValid] = useState(true)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        let isvalid = true;
        let validationErorrs = {}

        if (formData.username === "" || formData.username === null) {
            isvalid = false;
            validationErorrs.username = "*Username is required"
        }
        if (formData.password === "" || formData.password === null) {
            isvalid = false;
            validationErorrs.password = "*Password is required"
        }


        if (!isvalid) {
            setErrors(validationErorrs);
            setIsValid(false);
            return; // Exit the function if there are validation errors
        }
       


        fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({

                username: formData.username,
                password: formData.password,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    alert("Login successfully");
                    localStorage.setItem('authToken', data.token);
                    navigate('/homepage*/')
                    setErrors({});
                    setIsValid(true);
                } else {
                    isvalid = false;
                    if (data.error === 'user_not_found') {

                        validationErorrs.username = "Username not found";

                    } else {
                        validationErorrs.password = "Invalid username or password";
                    }
                    setErrors(validationErorrs);
                    setIsValid(false);
                }
            }).catch(error => {
                console.error("Error fetching data:", error);
            });


    }

    const handleUsernameChange = (event) => {
        setFormData({ ...formData, username: event.target.value });
        // Clear the username error when the user starts typing
        setErrors({ ...errors, username: '' });
        setIsValid(true);
    };

    const handlePasswordChange = (event) => {
        setFormData({ ...formData, password: event.target.value });
        // Clear the password error when the user starts typing
        setErrors({ ...errors, password: '' });
        setIsValid(true);
    };




    return (
        <div className='container-fluid' id='login'>
            <div className='row' >
                <div className='col-lg-12 col-mb-12 col-sm-12 col-12'>


                    {/* ---------form---------  */}
                    <div>
                        <form className='p-5 bg-light shadow  login-form' onSubmit={handleSubmit}>
                            <div>
                                <h1>Welcome Back!</h1>
                            </div>
                            {/* -------User Name------- */}
                            <div className='username'>
                                <label htmlFor="username">Username</label><br />
                                <input type="text" name="username" id="username" placeholder='enter your username' autoComplete='off' onChange={handleUsernameChange} />
                                <div>
                                    {!isvalid && (
                                        <span className='text-required'>
                                            {errors.username}

                                        </span>
                                    )
                                    }

                                </div>
                            </div>

                            {/* -----------Password------------ */}
                            <div className='password'>
                                <label htmlFor="password">Password</label><br />
                                <input type="password" name="password" id="password" placeholder='enter your password' onChange={handlePasswordChange} /><br />
                                {!isvalid && (
                                    <span className='text-required'>
                                        {errors.password}
                                        {/* {setErrors} */}
                                    </span>
                                )}
                            </div>

                            <button className=' shadow'>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
