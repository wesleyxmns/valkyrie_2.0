import { NextResponse } from "next/server";
import { handleToUnderReview } from "./handlers/handle-to-under-review";
import { handleAprovarAcao } from "./handlers/handle-aprovar-acao";
import { handleReprovarAcao } from "./handlers/handle-reprovar-acao";
import { handleCancelarAcao } from "./handlers/handle-cancela-acao";
import { ActionsTransitionsId } from "@/shared/enums/rnc-enums/rnc-actions-transitions-id";
import { UserDTO } from "@/dtos/responses/user-dto";
import { HttpStatus } from "@/lib/fetch/constants/http-status";

interface HandleTransitionProps {
  user?: UserDTO;
  userAuthorization: string;
  epicKey: string;
  transitionId: string;
}

export async function actionsTransitions({ epicKey, user, transitionId, userAuthorization }: HandleTransitionProps) {
  try {

    if (transitionId === ActionsTransitionsId.CANCELAR_ACAO) {
      await handleCancelarAcao(user as UserDTO, userAuthorization, epicKey, transitionId);
    }

    if (transitionId === ActionsTransitionsId.ENVIAR_PARA_REVISAO) {
      await handleToUnderReview(userAuthorization, epicKey, transitionId);
    }

    if (transitionId === ActionsTransitionsId.APROVAR_ACAO) {
      await handleAprovarAcao(user as UserDTO, userAuthorization, epicKey, transitionId);
    }

    if (transitionId === ActionsTransitionsId.REPROVAR_ACAO) {
      await handleReprovarAcao(user as UserDTO, userAuthorization, epicKey, transitionId);
    }

    return NextResponse.json({ message: "Transição feita com sucesso" }, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json({
      message: "Erro ao realizar transição",
      content: error,
    }, { status: HttpStatus.BAD_REQUEST });
  }
}