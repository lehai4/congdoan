import { Button, Input, Space } from "antd";
import { Controller } from "react-hook-form";
const Form = (props) => {
  const { onSubmit, handleSubmit, control, errors } = props;
  return (
    <div className="py-4">
      <div className="flex flex-row items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)} type="submit">
          <Space direction="vertical">
            <div className="flex flex-col items-start gap-1">
              <Controller
                name="username"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input {...field} placeholder="username..." />
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
            <div className="mt-5 flex flex-row justify-center items-center">
              <Button type="primary" htmlType="submit">
                Đăng nhập
              </Button>
            </div>
          </Space>
        </form>
      </div>
    </div>
  );
};

export default Form;
