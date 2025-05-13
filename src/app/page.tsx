"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DATA_LIMITE = new Date("2025-05-29T23:59:59");

type Pratica = {
  id: string;
  nome: string;
  vagasRestantes: number;
};

type Inscricao = {
  nome: string;
  centro: string;
  telefone: string;
  email: string;
  observacao: string;
};


export default function Formulario() {
  const router = useRouter();
  const [permitido, setPermitido] = useState(true);
  const [praticas, setPraticas] = useState<Pratica[]>([]);
  const [inscricoesExistentes, setInscricoesExistentes] = useState<Inscricao[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    centro: "",
    vegetariano: "",
    pratica: "",
    praticaNome: "",
    email: "",
    telefone: "",
    observacao: "",
  });
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState("");

  useEffect(() => {
    const agora = new Date();
    if (agora > DATA_LIMITE) {
      setPermitido(false);
    } else {
      fetch("https://api-inscricao-liart.vercel.app/api/praticas")
        .then((res) => res.json())
        .then(setPraticas)
        .catch((err) => {
          console.error("Erro ao buscar práticas:", err);
          setErro("Erro ao carregar práticas. Por favor, tente novamente.");
        });

      fetch("https://api-inscricao-liart.vercel.app/api/inscricoes")
        .then((res) => res.json())
        .then(setInscricoesExistentes)
        .catch((err) => {
          console.error("Erro ao buscar inscrições existentes:", err);
        });
    }
  }, []);

  useEffect(() => {
    const atualizarTempo = () => {
      const agora = new Date();
      const diferenca = DATA_LIMITE.getTime() - agora.getTime();

      if (diferenca <= 0) {
        setPermitido(false);
        setTempoRestante("Inscrições encerradas");
      } else {
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
        const segundos = Math.floor((diferenca / 1000) % 60);

        setTempoRestante(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
      }
    };

    const intervalo = setInterval(atualizarTempo, 1000);
    atualizarTempo();

    return () => clearInterval(intervalo);
  }, []);

  const verificarDuplicidade = () => {
    const nomeNormalizado = form.nome.trim().toLowerCase();
    const centroNormalizado = form.centro.trim().toLowerCase();

    return inscricoesExistentes.some(
      (inscricao) =>
        inscricao.nome.trim().toLowerCase() === nomeNormalizado &&
        inscricao.centro.trim().toLowerCase() === centroNormalizado
    );
  };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (confirmado) {
      enviarFormulario();
      setConfirmado(false);
    }
  }, [confirmado]);

  const enviarFormulario = async () => {
    setSubmitting(true);

    try {
      const res = await fetch(
        "https://api-inscricao-liart.vercel.app/api/inscricoes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            vegetariano: form.vegetariano === "true",
            pratica: form.praticaNome,
          }),
        }
      );

      if (res.ok) {
        router.push("/obrigado");
      } else {
        const errorData = await res.json().catch(() => null);
        setErro(
          errorData?.message ||
            "Erro ao enviar inscrição. Por favor, tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro durante o envio:", error);
      setErro(
        "Erro de conexão. Por favor, verifique sua internet e tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Substitua o conteúdo do handleSubmit pelo seguinte:
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!form.pratica) {
      setErro("Por favor, escolha uma prática");
      return;
    }

    if (verificarDuplicidade()) {
      setErro(
        "Já existe uma inscrição com este nome e centro espírita. Por favor, verifique seus dados."
      );
      return;
    }

    // Exibir o modal antes de enviar
    setMostrarConfirmacao(true);
  };

  if (!permitido) return router.push("/encerrado");

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

        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Formulário de Inscrição
        </h1>

        {erro && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
            {erro}
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-red-600">
            Inscrições encerram em: {tempoRestante}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="nome"
              className="block font-semibold text-gray-700 mb-1"
            >
              Nome:
            </label>
            <input
              id="nome"
              required
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="centro"
              className="block font-semibold text-gray-700 mb-1"
            >
              Centro Espírita:
            </label>
            <input
              id="centro"
              required
              placeholder="Centro Espírita"
              value={form.centro}
              onChange={(e) => setForm({ ...form, centro: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <p className="font-semibold text-gray-700 mb-1">É vegetariano?</p>
            <div className="flex gap-4">
              <label htmlFor="veg-sim" className="inline-flex items-center">
                <input
                  id="veg-sim"
                  type="checkbox"
                  checked={form.vegetariano === "true"}
                  onChange={() =>
                    setForm({
                      ...form,
                      vegetariano: form.vegetariano === "true" ? "" : "true",
                    })
                  }
                  className="mr-2"
                />
                Sim
              </label>

              <label htmlFor="veg-nao" className="inline-flex items-center">
                <input
                  id="veg-nao"
                  type="checkbox"
                  checked={form.vegetariano === "false"}
                  onChange={() =>
                    setForm({
                      ...form,
                      vegetariano: form.vegetariano === "false" ? "" : "false",
                    })
                  }
                  className="mr-2"
                />
                Não
              </label>
            </div>
          </div>

          <fieldset className="space-y-2">
            <legend className="font-semibold text-gray-700">Práticas:</legend>
            {praticas.length === 0 ? (
              <p className="text-gray-500">Carregando práticas...</p>
            ) : (
              praticas.map((p, i) => (
                <label key={i} htmlFor={`pratica-${i}`} className="block">
                  <input
                    id={`pratica-${i}`}
                    type="checkbox"
                    disabled={p.vagasRestantes <= 0}
                    checked={form.pratica === p.id}
                    onChange={() =>
                      setForm({
                        ...form,
                        pratica: p.id,
                        praticaNome: p.nome,
                      })
                    }
                    className="mr-2"
                  />
                  <span
                    className={p.vagasRestantes <= 0 ? "text-gray-400" : ""}
                  >
                    {p.nome} —{" "}
                    {p.vagasRestantes <= 0
                      ? "Esgotado"
                      : `${p.vagasRestantes} vagas`}
                  </span>
                </label>
              ))
            )}
          </fieldset>

          <div>
            <label
              htmlFor="email"
              className="block font-semibold text-gray-700 mb-1"
            >
              Email (opcional):
            </label>
            <input
              id="email"
              placeholder="Email (opcional)"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="telefone"
              className="block font-semibold text-gray-700 mb-1"
            >
              Telefone (opcional):
            </label>
            <input
              id="telefone"
              placeholder="Telefone (opcional)"
              type="tel"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="observacao"
              className="block font-semibold text-gray-700 mb-1"
            >
              Observação (opcional):
            </label>
            <textarea
              id="observacao"
              placeholder="Observação (opcional)"
              value={form.observacao}
              onChange={(e) => setForm({ ...form, observacao: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full p-3 font-medium rounded-lg transition hover:cursor-pointer ${
              submitting
                ? "bg-gray-300 text-gray-700"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {submitting ? "Enviando..." : "Enviar Inscrição"}
          </button>
        </form>
        {mostrarConfirmacao && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-xl p-6 shadow-xl w-full max-w-md z-10">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Confirmar Inscrição
              </h2>
              <p className="mb-2">
                <strong>Nome:</strong> {form.nome}
              </p>
              <p className="mb-2">
                <strong>Centro:</strong> {form.centro}
              </p>
              <p className="mb-2">
                <strong>Vegetariano:</strong>{" "}
                {form.vegetariano === "true" ? "Sim" : "Não"}
              </p>
              <p className="mb-2">
                <strong>Prática:</strong> {form.praticaNome}
              </p>
              {form.email && (
                <p className="mb-2">
                  <strong>Email:</strong> {form.email}
                </p>
              )}
              {form.telefone && (
                <p className="mb-2">
                  <strong>Telefone:</strong> {form.telefone}
                </p>
              )}
              {form.observacao && (
                <p className="mb-4">
                  <strong>Observação:</strong> {form.observacao}
                </p>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setMostrarConfirmacao(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setMostrarConfirmacao(false);
                    setConfirmado(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
