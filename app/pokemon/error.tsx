"use client";

import { useEffect } from "react";

interface PokemonErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function PokemonError({
  error,
  unstable_retry,
}: PokemonErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-12">
      <div className="max-w-md rounded-xl bg-white p-8 text-center text-gray-700 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900">
          No se pudo cargar la lista de Pokemon
        </h2>
        <p className="mt-4 text-sm text-gray-600">
          Ocurrio un problema al obtener los datos. Puedes intentar cargar la
          pagina otra vez.
        </p>
        <button
          type="button"
          onClick={unstable_retry}
          className="mt-6 rounded-lg bg-purple-700 px-5 py-2.5 font-semibold text-white transition hover:bg-purple-800"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
