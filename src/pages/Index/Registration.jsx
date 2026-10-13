import React, { useEffect } from 'react';
import RegistrationFormComponent from '../../components/RegistrationComponents/RegistrationFormComponent';

const Registration = () => {
  useEffect(() => {
    document.title = 'Parent Portal Registration | Elizabeth Seton School';
  }, []);

  return (
    <section className="bg-[url('/assets/img/White-Background.png')] bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center">
      <RegistrationFormComponent />
    </section>
  );
};

export default Registration;
