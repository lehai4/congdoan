import { Image } from "antd";
import logo from "../assets/logo.png";
const Logo = () => {
  return <Image src={`${logo}`} preview={false} width="70px" height="70px" />;
};

export default Logo;
