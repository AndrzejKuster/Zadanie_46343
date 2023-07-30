import { Link, Navigate } from "react-router-dom";
import './SignUp.css';
import { useState } from "react";
import axios from "axios";

const SignUp = (props) => {


    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [signUpMessage, setSignUpMessage] = useState('');
    const [signUpDone, setSignUpDone] = useState(false);

    const validate = () => {
        let validationsErrors = {
            username: false,
            email: false,
            password: false,
            confirmPassword: false
        }

        /*username*/ 
        if(formData.username.trim().length < 4){
            validationsErrors.username = true;
            setErrors((prevErrors) => {
                return {...prevErrors, username: "Username should have at least 4 characters!"};
            });
        } else if(!/^[^\s]*$/.test(formData.username.trim())) {
            validationsErrors.username = true;
            setErrors((prevErrors) => {
                return {...prevErrors, username: "Username shouldn't have empty characters!"};
            });
        } else {
            validationsErrors.username = false;
            setErrors((prevErrors) => {
                return {...prevErrors, username: ""}
            });
        };
        // email 
        if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())) {
            validationsErrors.email = true;
            setErrors((prevErrors) => {
                return {...prevErrors, email: "Address email is not valid!"}
            });
        } else {
            validationsErrors.email = false;
            setErrors((prevErrors) => {
                return {...prevErrors, email: ""}
            });
        }
        /* password */
        if (formData.password.trim().length < 6) {
            validationsErrors.password = true;
            setErrors((prevErrors) => {
                return {...prevErrors, password: "Password should have at least 6 characters!"};
            });
        } else if(!/^[^\s]*$/.test(formData.password.trim())) {
            validationsErrors.password = true;
            setErrors((prevErrors) => {
                return {...prevErrors, password: "Password should have at least 6 characters!"};
            });
        } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(formData.password.trim())) {
            validationsErrors.password = true;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                     password: "Password must contain special character like ! # @ $ %",
                    };
            });
        } else {
            validationsErrors.password = false;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                     password: "",
                    };
            });
        }

        /* confirm password */
        if (formData.password.trim() !== formData.confirmPassword.trim()) {
            validationsErrors.confirmPassword = true;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                     confirmPassword: "Password must be the same!",
                    };
            });
        } else {
            validationsErrors.confirmPassword = false;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                     confirmPassword: "",
                    };
            });
        }

        return (
            !validationsErrors.username &&
            !validationsErrors.email &&
            !validationsErrors.password &&
            !validationsErrors.confirmPassword
            );
    };

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;


        setFormData({
            ...formData,
            [name]: target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!validate()) {
            return
        }

        axios.post('https://akademia108.pl/api/social-app/user/signup', {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        })
        .then((res) => {
            console.log(res.data);
            
            let resData = res.data;

            if (resData.signedup) {
                setSignUpMessage("Account created!");
                setSignUpDone(true);
            } else {
                if (resData.message.username) {
                    setSignUpMessage(resData.message.username[0])
                } else if (resData.message.email) {
                    setSignUpMessage(resData.message.email[0])
                }
            }
        })
        .catch((error) => {
            console.error(error);
        })
    }

    return (
        <div className="signUp">
            {props.user && <Navigate to="/" />}
            <form onSubmit={handleSubmit}>
                {signUpMessage && <h2>{signUpMessage}</h2>}
                <input type="text" name="username" placeholder="User name" onChange={handleInputChange} />
                {errors.username && <p>{errors.username}</p>}

                <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                {errors.email && <p>{errors.email}</p>}

                <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                {errors.password && <p>{errors.password}</p>}

                <input type="password" name="confirmPassword" placeholder="Confirm password" onChange={handleInputChange} />
                {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                <button className="btn" disabled={signUpDone}>SignUp</button>

                {signUpDone && (<div>
                    <Link to='/login' className="btn">Go to login</Link>
                    </div>)}
            </form>
        </div>
    )
}

export default SignUp;