import { UserDTO } from "@/dtos/responses/user-dto";
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { RNCEpicTransitionsId } from "@/shared/enums/rnc-enums/rnc-epic-transitions-id";
import { NextResponse } from "next/server";
import { toast } from "sonner";
import { handleAcionarDiretoria } from './handlers/handle-acionar-diretoria';
import { handleAcionarQualidade } from "./handlers/handle-acionar-qualidade";
import { handleAcionarSetorDeOrigem } from "./handlers/handle-acionar-setor-de-origem";
import { handleCancelarRelatorio } from './handlers/handle-cancelar-relatorio';
import { handleDevolverParaAprovada } from './handlers/handle-devolver-para-aprovada';
import { handleDiretoriaAprovaRelatorio } from './handlers/handle-diretoria-aprova-relatorio';
import { handleDiretoriaRejeitaRelatorio } from './handlers/handle-diretoria-rejeita-relatorio';
import { handleFinalizarTarefa } from './handlers/handle-finalizar-relatorio';
import { handleInvalidarRelatorio } from "./handlers/handle-invalidar-relatorio";
import { handleValidarRelatorio } from './handlers/handle-validar-relatorio';
import { handleVoltarSetorEmitente } from "./handlers/handle-voltar-setor-emitente";
import { handleReanalisarRelatorio } from "./handlers/handle-revisar-relatorio";

interface HandleTransitionProps {
      user: UserDTO;
      userAuthorization: string;
      epicKey: string;
      transitionId: string;
}

export async function epicTransitions({ epicKey, transitionId, user, userAuthorization }: HandleTransitionProps) {
      try {
            // AÇÃO DE CANCELAMENTO DO RELATORIO
            if (transitionId === RNCEpicTransitionsId.CANCELAR_RELATORIO) {
                  await handleCancelarRelatorio(userAuthorization, user, epicKey, transitionId, itWorkedOut);
            }

            //AÇÃO DE RETORNAR AO SETOR EMITENTE
            if (transitionId === RNCEpicTransitionsId.VOLTAR_SETOR_EMITENTE) {
                  await handleVoltarSetorEmitente(userAuthorization, epicKey, transitionId, itWorkedOut,);
            }

            // AÇÃO DE ACIONAR A QUALIDADE
            if (transitionId === RNCEpicTransitionsId.ACIONAR_QUALIDADE) {
                  await handleAcionarQualidade(userAuthorization, epicKey, transitionId, itWorkedOut);
            }

            // AÇÃO DE ACIONAR SETOR DE ORIGEM
            if (transitionId === RNCEpicTransitionsId.ACIONAR_SETOR_DE_ORIGEM) {
                  await handleAcionarSetorDeOrigem(userAuthorization, user, epicKey, transitionId, itWorkedOut);
            }

            // AÇÃO DE INVALIDAR RELATÓRIO RETORNANDO AO SETOR DE ORIGEM
            if (transitionId === RNCEpicTransitionsId.INVALIDAR_RELATORIO) {
                  await handleInvalidarRelatorio(userAuthorization, epicKey, transitionId, itWorkedOut);
            }

            // AÇÃO DE VALIDAR O RELATÓRIO
            if (transitionId === RNCEpicTransitionsId.VALIDAR_RELATORIO) {
                  await handleValidarRelatorio(userAuthorization, epicKey, transitionId, itWorkedOut);
            }

            // AÇÃO DE REVISAR O RELATÓRIO
            if (transitionId === RNCEpicTransitionsId.REANALISAR) {
                  await handleReanalisarRelatorio(userAuthorization, epicKey, transitionId, itWorkedOut);
            }

            // AÇÃO DE ACIONAR A DIRETORIA
            if (transitionId === RNCEpicTransitionsId.ACIONAR_DIRETORIA) {
                  await handleAcionarDiretoria(user, userAuthorization, epicKey, transitionId, itWorkedOut);
            }

            // AÇÃO DE APROVAR O RELATÓRIO EM SEGUNDA INSTÂNCIA
            if (transitionId === RNCEpicTransitionsId.APROVAR_RELATORIO_EM_SEGUNDA_INSTANCIA) {
                  await handleDiretoriaAprovaRelatorio(user, userAuthorization, epicKey, transitionId, itWorkedOut);
            }

            // AÇÃO DE DEVOLVER O RELATÓRIO PARA APROVAÇÃO
            if (transitionId === RNCEpicTransitionsId.DEVOLVER_PARA_APROVADA) {
                  await handleDevolverParaAprovada(userAuthorization, user, epicKey, transitionId, itWorkedOut);
            }

            // AÇÃO DE REJEITAR O RELATÓRIO EM SEGUNDA INSTÂNCIA
            if (transitionId === RNCEpicTransitionsId.DIRETORIA_REJEITA) {
                  await handleDiretoriaRejeitaRelatorio(user, userAuthorization, epicKey, transitionId, itWorkedOut);
            }

            // AÇÃO DE FINALIZAR A TAREFA
            if (transitionId === RNCEpicTransitionsId.FINALIZAR_TAREFA) {
                  await handleFinalizarTarefa(user, userAuthorization, epicKey, transitionId, itWorkedOut);
            }

            return NextResponse.json({ message: "Transição feita com sucesso" }, { status: HttpStatus.OK });
      } catch (error) {
            return NextResponse.json({
                  message: "Erro ao realizar transição",
                  content: error,
            }, { status: HttpStatus.BAD_REQUEST });
      }
}

export function itWorkedOut(requestStatus: string | number, statusId: string | number, action: () => void) {
      if (requestStatus === statusId) {
            action();
            toast.success("Transição realizada com sucesso");
            return true;
      } else {
            toast.error("Erro ao realizar transição");
            return false;
      }
}