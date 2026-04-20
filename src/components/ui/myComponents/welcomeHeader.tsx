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
    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 p-4 sm:p-5 rounded-xl bg-linear-to-r from-pink-50 to-orange-50 border border-pink-100 text-center sm:text-left">
      <div className="flex items-center justify-center rounded-lg ">
        <Image
          src="/ngl.svg"
          alt={`${appName} logo`}
          width={86}
          height={86}
          className="sm:w-[100px] sm:h-[100px]"
        />
      </div>

      <div >
        <h2 className="text-2xl sm:text-4xl lg:text-5xl my-1 sm:my-3 font-bold text-gray-800 leading-tight">
          Welcome to <span className="text-pink-600">{appName}</span>
        </h2>
        <p className="text-sm sm:text-lg font-semibold text-pink-600">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
