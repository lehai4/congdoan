import Form from "../../components/Form";
import { useForm } from "react-hook-form";
import Logo from "../../components/Logo";
import { http } from "../../api";
import { AuthContext } from "../../hooks/context";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await http.login(data);
    if (res.status === 200) {
      toast(res.data.message);
      localStorage.setItem("token", res.data.token);
      login(res.data.user);
      navigate("/");
    } else if (res.status === 400) {
      toast.error(res.data.message);
    }
  };

  const retryProps = {
    onSubmit,
    handleSubmit,
    register,
    control,
    errors,
  };
  return (
    <div className="flex flex-col items-center border rounded-md p-10 shadow-lg">
      <Logo />
      <Form {...retryProps} />
    </div>
  );
};

export default Login;
