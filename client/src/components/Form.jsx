import { Button, Input, Space } from "antd";
import { Controller } from "react-hook-form";
const Form = (props) => {
  const { onSubmit, handleSubmit, control, errors } = props;
  return (
    <div className="py-4 w-full">
      <form onSubmit={handleSubmit(onSubmit)} type="submit">
        <div className="w-full flex flex-col justify-center gap-5">
          <div className="flex flex-col items-start gap-1">
            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input {...field} size="large" placeholder="username..." />
              )}
            />
            {errors.username?.type === "required" && (
              <p role="alert" className="text-red-500">
                *Username is required
              </p>
            )}
          </div>
          <div className="flex flex-col items-start gap-1">
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  size="large"
                  type="password"
                  placeholder="password..."
                />
              )}
            />
            {errors.password?.type === "required" && (
              <p role="alert" className="text-red-500">
                *Password is required
              </p>
            )}
          </div>
          <div className="mt-5 flex flex-row justify-end items-center">
            <Button size="large" type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
