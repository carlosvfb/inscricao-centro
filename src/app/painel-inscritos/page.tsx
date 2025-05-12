"use client";
import { useEffect, useState } from "react";

type Inscricao = {
  id: number;
  nome: string;
  pratica: Pratica;
  centro: string;
  vegetariano: boolean;
  email?: string;
  telefone?: string;
  observacao?: string;
};

type Pratica = {
  id: number;
  nome: string;
  vagasTotais: number;
  vagasRestantes: number;
};

export default function Painel() {
  const [inscritos, setInscritos] = useState<Inscricao[]>([]);
  const [praticas, setPraticas] = useState<Pratica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const inscritosRes = await fetch("https://api-inscricao-liart.vercel.app/api/inscricoes");
        const inscritosData = await inscritosRes.json();
        
        if (Array.isArray(inscritosData)) {
          setInscritos(inscritosData);
        } else {
          console.error("Formato inesperado de dados de inscrições:", inscritosData);
          setInscritos([]);
        }

        const praticasRes = await fetch("https://api-inscricao-liart.vercel.app/api/praticas");
        const rawData = await praticasRes.json();
        
        let praticasArray: Pratica[] = [];
        
        if (Array.isArray(rawData)) {
          praticasArray = rawData;
        } else if (rawData && typeof rawData === 'object') {
          praticasArray = Object.keys(rawData).map(key => {
            const item = rawData[key];
            if (item && typeof item === 'object' && 'id' in item && 'nome' in item) {
              return {
                id: Number(item.id),
                nome: String(item.nome),
                vagasTotais: Number(item.vagasTotais || 0),
                vagasRestantes: Number(item.vagasRestantes || 0)
              };
            }
            return null;
          }).filter((item): item is Pratica => item !== null);
        }
        
        setPraticas(praticasArray);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Falha ao carregar dados. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const contarInscritos = (praticaId: number): number => {
    return inscritos.filter(inscricao => 
      inscricao && inscricao.pratica && inscricao.pratica.id === praticaId
    ).length;
  };

  const totalInscritos = inscritos.length;

  if (loading) {
    return <div className="p-6 text-center">Carregando dados...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Painel de Inscrições</h1>
      
      {/* Card com total de inscritos */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-700 dark:border-blue-500">
        <h2 className="text-xl font-semibold">Total de Inscrições</h2>
        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalInscritos}</p>
      </div>

      <h2 className="text-xl mb-2">Inscrições por Prática</h2>
      
      {praticas.length === 0 ? (
        <p>Nenhuma prática encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {praticas.map(pratica => {
            const id = Number(pratica.id);
            const nome = String(pratica.nome || "");
            const vagasTotais = Number(pratica.vagasTotais || 0);
            const vagasRestantes = Number(pratica.vagasRestantes || 0);
            const inscritosPratica = contarInscritos(id);
            
            return (
              <div key={id} className="p-4 border rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                <h3 className="font-semibold text-lg">{nome}</h3>
                <p>
                  {inscritosPratica} inscritos de{" "}
                  {vagasTotais} vagas (restam {vagasRestantes})
                </p>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="text-xl mt-8 mb-2">Inscritos Detalhados</h2>
      
      {inscritos.length === 0 ? (
        <p>Nenhuma inscrição encontrada.</p>
      ) : (
        inscritos.map(inscricao => {
          if (!inscricao || !inscricao.pratica) {
            return null;
          }
          
          const id = Number(inscricao.id);
          const nome = String(inscricao.nome || "");
          const praticaNome = inscricao.pratica && inscricao.pratica.nome 
            ? String(inscricao.pratica.nome)
            : "Não definida";
          const centroEspirita = String(inscricao.centro || "");
          const vegetariano = Boolean(inscricao.vegetariano);
          const email = inscricao.email ? String(inscricao.email) : undefined;
          const telefone = inscricao.telefone ? String(inscricao.telefone) : undefined;
          const observacao = inscricao.observacao ? String(inscricao.observacao) : undefined;
          
          return (
            <div key={id} className="p-4 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600">
              <p>
                <strong>Nome:</strong> {nome}
              </p>
              <p>
                <strong>Prática:</strong> {praticaNome}
              </p>
              <p>
                <strong>Centro Espírita:</strong> {centroEspirita}
              </p>
              <p>
                <strong>Vegetariano:</strong>{" "}
                {vegetariano ? "Sim" : "Não"}
              </p>
              {email && (
                <p>
                  <strong>Email:</strong> {email}
                </p>
              )}
              {telefone && (
                <p>
                  <strong>Telefone:</strong> {telefone}
                </p>
              )}
              {observacao && (
                <p>
                  <strong>Observação:</strong> {observacao}
                </p>
              )}
            </div>
          );
        }).filter(Boolean)
      )}
    </div>
  );
}
