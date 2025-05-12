import Image from "next/image";

export default function Encerrado() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 shadow-lg rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.jpg" // Substitua com sua logo real
            width={150}
            height={150}
            alt="Logo"
          />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-center text-red-600">
          Inscrições Encerradas
        </h1>

        <p className="text-xl mb-6 text-center">
          O prazo para inscrições já passou.
        </p>

        <div className="flex justify-center mb-6">
          <Image
            width={500}
            height={500}
            src="/choro.gif"
            alt="choro gif"
            className="rounded-2xl"
            priority={true}
          />
        </div>

        <p className="text-lg mb-6 text-center">
          Infelizmente, o período de inscrições para este evento já terminou.
        </p>
      </div>
    </div>
  );
}
