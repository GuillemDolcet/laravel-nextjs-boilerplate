import Image from "next/image";

const Logo = ({ width = 100, height = 100, ...props }) => (
    <Image src="/images/logo.png" width={width} height={height} alt="logo" {...props} />
);

export default Logo;