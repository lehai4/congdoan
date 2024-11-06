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
    <div className="w-[400px] h-[600px] flex flex-col justify-center items-center border rounded-lg p-10 shadow-lg gap-5">
      <Logo />
      <h1 className="font-[500] text-[30px]">Đăng nhập</h1>
      <Form {...retryProps} />
    </div>
  );
};

export default Login;
