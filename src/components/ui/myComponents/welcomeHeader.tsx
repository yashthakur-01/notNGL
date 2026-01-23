import Image from "next/image";

type WelcomeHeaderProps = {
  appName: string;
  subtitle?: string;
};

export default function WelcomeHeader({
  appName,
  subtitle = "Send and receive messages anonymously",
}: WelcomeHeaderProps) {
  return (
    <div className="flex justify-center items-center gap-4 p-5 rounded-xl bg-linear-to-r from-pink-50 to-orange-50 border border-pink-100">
      
      <div className="flex items-center justify-center rounded-lg ">
        <Image
          src="/ngl.svg"
          alt={`${appName} logo`}
          width={100}
          height={100}
        />
      </div>

      <div >
        <h2 className="text-5xl my-3 font-bold text-gray-800">
          Welcome to <span className="text-pink-600">{appName}</span>
        </h2>
        <p className="text-lg font-semibold text-pink-600">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
