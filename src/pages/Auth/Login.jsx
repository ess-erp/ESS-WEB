import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchLoginData, fetchGoogleLoginData } from '../../states/AuthState/Action';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { handleAuthRedirect } from "../../services/authRedirect";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
  console.log(clientId);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Login | ESS";
    handleAuthRedirect(navigate);
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Enter a valid email address.";
      }
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 3000);
      return;
    }

    setErrors({});
    console.log("Email:", email);
    console.log("Password:", password);

    const formData = {
      Email: email,
      Password: password
    }
    setLoading(true);
    const res = await dispatch(fetchLoginData(formData));

    if (res.ok) {
      handleAuthRedirect(navigate);
    }
    else {
      setLoading(false);
      setErrors({ form: res.error || "Invalid email or password." });
      setTimeout(() => setErrors({}), 5000);
    }
  };


  const handleGoogleResponse = async (response) => {
    const idToken = response.credential;

    console.log(idToken);

    const payload = {
      IdToken: idToken,
      Email: email,
    };
    setLoading(true);
    const res = await dispatch(fetchGoogleLoginData(payload));

    if (res.ok) {
      handleAuthRedirect(navigate);
    } else {
      setErrors({ form: "Google login failed." });
    }
  };

  useEffect(() => {
    const initGoogle = () => {
      if (!window.google || !clientId) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });
    };

    if (window.google) {
      initGoogle();
    } else {
      window.addEventListener("google-loaded", initGoogle);
    }
  }, []);

  // useEffect(() => {
  //   if (!window.google) return;

  //   if (!clientId) {
  //     console.error("Google CLIENT ID is missing");
  //     return;
  //   }

  //   google.accounts.id.initialize({
  //     client_id: clientId,
  //     callback: handleGoogleResponse,
  //     // hosted_domain: "ess.edu.ph",
  //   });
  // }, []);

  const handleGoogleSignin = () => {
    google.accounts.id.prompt();
  };



  return (


    <section className="bg-[url('/assets/img/White-Background.png')] bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center">
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
          <img
            src="/assets/img/ESS-Logo.png"
            alt="Loading..."
            className="mb-6"
          />

          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>

          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      )}
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">

          {/* Left Image */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <img
              src="/assets/img/seton-logo.png"
              alt="Login visual"
              className="max-w-[680px] max-h-[350px] object-cover rounded"
            />

            <div className="text-center mt-4 px-4">
              <h2 className="text-xl font-bold text-green-800 mb-2">This is the Elizabeth Seton School ERP System.</h2>
              <p className="text-gray-600">Join us and be part of our amazing community.</p>
              <p className="text-gray-600">Enroll your child by using this Online Application.</p>
            </div>
          </div>


          {/* Right Login Form */}
          <div className="w-full md:w-1/2 max-w-md">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-green-800">Welcome To Elizabeth Seton School</h2>
              <p className="text-gray-600 mt-2">Please enter your details to sign in</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="your@ess.edu.ph"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  {errors.form && (
                    <p className="mt-1 text-sm text-red-500">{String(errors.form)}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    {/* <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </a> */}
                  </div>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />

                    {password && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                  {errors.form && (
                    <p className="mt-1 text-sm text-red-500">{String(errors.form)}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >

                    Sign in
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            <div className="mt-6 gap-3">
              {/* <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={handleGoogleSignin}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button> */}
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={handleGoogleSignin}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>
            {loading ? "Signing in..." : ""}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;