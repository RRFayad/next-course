import Image from "next/image";
import homeImage from "../../public/images/home.jpg";

export default function HomePage() {
  return (
    <div className="absolute -z-10 inset-0">
      Home Page
      <Image src={homeImage} alt="car factory" fill style={{ objectFit: "cover" }} />
    </div>
  );
}
