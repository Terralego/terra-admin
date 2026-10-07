import LoginForm from './LoginForm';
import { connectAuthProvider } from '../context';

export { default as SSOLoginFormRenderer } from './SSOLoginFormRenderer';

export default connectAuthProvider('authAction')(LoginForm);
