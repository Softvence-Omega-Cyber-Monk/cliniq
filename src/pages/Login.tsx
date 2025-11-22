import { useState } from 'react';
import { Role } from '@/components/Authentications/types';
import AuthLayout from '@/components/Authentications/AuthLayout';
import RoleSelection from '@/components/Authentications/RoleSelection';
import SignUpForm from '@/components/Authentications/SignUpForm';
import LoginForm from '@/components/Authentications/LoginForm';

type View = 'ROLE_SELECTION' | 'SIGN_UP' | 'LOGIN';

function Login() {
  const [currentView, setCurrentView] = useState<View>('ROLE_SELECTION');
  const [initialRole, setInitialRole] = useState<Role>(Role.INDIVIDUAL);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.PRIVATE_PRACTICE);

  const startSignUp = (role: Role) => {
    setInitialRole(role);
    setCurrentView('SIGN_UP');
  };

  const showLogin = () => {
    setCurrentView('LOGIN');
  };

  const showRoleSelection = () => {
    setCurrentView('ROLE_SELECTION');
  };

  const renderView = () => {
    switch (currentView) {
      case 'SIGN_UP':
        return <SignUpForm 
                    initialRole={initialRole} 
                    onSwitchToLogin={showLogin}
                />;
      case 'LOGIN':
        return <LoginForm onSwitchToSignUp={showRoleSelection} />;
      case 'ROLE_SELECTION':
      default:
        return <RoleSelection 
                    onContinue={startSignUp}
                    onSwitchToLogin={showLogin}
                    selectedRole={selectedRole}
                    onRoleChange={setSelectedRole}
                />;
    }
  };

  return (
    <main className=" font-sans">
      <div className="">
        <AuthLayout role={selectedRole}>
            {renderView()}
        </AuthLayout>
      </div>
    </main>
  );
}

export default Login;