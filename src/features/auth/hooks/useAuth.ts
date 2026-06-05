import { useMutation } from '@apollo/client';
import { useAuthStore } from '../store/authStore';

// These will be replaced with codegen-generated hooks after running `npm run codegen`
import { gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
        avatarUrl
        bio
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        username
        email
        avatarUrl
        bio
      }
    }
  }
`;

export function useAuth() {
  const { isAuthenticated, user, setAuth, logout } = useAuthStore();
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({ variables: { input: { email, password } } });
    if (data?.login) {
      await setAuth(data.login.token, data.login.user);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const { data } = await registerMutation({
      variables: { input: { username, email, password } },
    });
    if (data?.register) {
      await setAuth(data.register.token, data.register.user);
    }
  };

  return { isAuthenticated, user, login, register, logout, loginLoading, registerLoading };
}
