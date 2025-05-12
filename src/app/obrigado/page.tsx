import Image from "next/image";

export default function Obrigado() {
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

        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
          Obrigado pela sua inscrição!
        </h1>

        <p className="text-xl mb-6 text-center">
          Estamos felizes em contar com a sua participação.
        </p>

        <div className="flex justify-center mb-6">
          <Image width={500} height={500} src="/obrigado.gif" alt="obrigado gif" className="rounded-2xl" priority={true}/>        
          </div>

        <p className="text-lg mb-6 text-center">
          A sua inscrição foi registrada com sucesso. Nos vemos em breve! 🙂
        </p>
      </div>
    </div>
  );
}
