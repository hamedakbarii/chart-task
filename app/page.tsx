import BitcoinChart from "./components/BitcoinChart";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-between items-center h-screen py-20 bg-black">
      <div className="w-[60%]">
        <BitcoinChart />
      </div>

      <div className="mt-10 text-gray-500">
        <a href="https://hamedakbari.vercel.app">
          Made with ❤️ ( Hamed Akbari )
        </a>
      </div>
    </div>
  );
}
