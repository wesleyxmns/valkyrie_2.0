import Link from "next/link";
import { ROUTES_VARIABLES } from "@/config/constants/route-variables";

export default function ExpiresLink() {
    return (
        <div className="flex h-screen w-full items-center justify-center  relative bg-LoginBackground">
            <div className="mx-4 w-full max-w-md space-y-4 rounded-md bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Oops, este link expirou</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        O link que você tentou acessar expirou. Para continuar com o processo, por favor, solicite um novo link de acesso.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Link
                        className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        href={`${ROUTES_VARIABLES.HOME}`}
                    >
                        Voltar ao Login
                    </Link>
                </div>
            </div>
        </div>

    )
}