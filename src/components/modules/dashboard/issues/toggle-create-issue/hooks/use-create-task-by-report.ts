'use client'
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { brynhildrAPI } from "@/lib/fetch/brynhildr-api";
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { EnviarMaterialAoCliente } from "@/shared/enums/rnc-enums/rnc-enviar-material-ao-cliente";
import { RegistrarPedidoEmGarantia } from "@/shared/enums/rnc-enums/rnc-registrar-pedido-em-garantia";
import { buildIssueStructure } from "@/shared/builds/build-structure-actions";
import { filterFieldsValues } from "@/shared/functions/filter-fields-values";
import { generateEpicName } from "@/shared/functions/generate-epic-name";
import { RequestBodys } from "@/shared/functions/requests-body";
import { NextResponse } from "next/server";
import { parseCookies } from "nookies";

export function useCreateTaskByReport() {
    const { '@valkyrie:auth-token': token } = parseCookies();
    const { useSendAttachments } = useBrynhildrData()
    async function createQualityReport(fields: Record<string, any>) {
        const { epicBody, sendMaterialToCustomerBody, registrarPedidoEmGarantia } = RequestBodys;
        try {
            const _epicName = await generateEpicName();
            if (_epicName) Object.assign(fields, { epicName: _epicName })
            const filteredBody = filterFieldsValues(await epicBody(fields))
            const response = await brynhildrAPI('/issue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`,
                },
                body: JSON.stringify(filteredBody)
            })

            const result: Record<string, any> = await response.json();

            if (response.status === HttpStatus.CREATED) {
                // FUNÇÃO QUE CONSTRÓI A ESTRUTURA DAS SUBTAREFAS
                const _issues = buildIssueStructure({ parentKey: result.key, subtasks: fields.subtasks })
                // ENVIO DOS ATTACHMENTS
                if (fields.attachments?.length > 0) {
                    useSendAttachments(result.key, fields.attachments)
                }
                // CRIAÇÃO DAS SUBTAREFAS
                if (_issues?.length > 0) {
                    await brynhildrAPI('/issue/bulk', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`,
                        },
                        body: JSON.stringify(_issues)
                    })
                }
                // CASO O CAMPO ENVIAR MATERIAL PRO CLIENTE SEJA MARCADO CRIA UMA TAREFA PARA O PCP DEFINIR A DATA DE ENTREGA.
                if (fields[CustomFields.ENVIA_MATERIAL_CLIENTE.id]?.id === EnviarMaterialAoCliente.SIM) {
                    const sendMaterialBody = await sendMaterialToCustomerBody(result.key);
                    await brynhildrAPI('/issue', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`,
                        },
                        body: JSON.stringify(sendMaterialBody)
                    })
                }
                // CASO O CAMPO REGISTRAR PEDIDO EM GARANTIA SEJA MARCADO CRIA UMA TAREFA PARA O SAC CRIAR O MESMO.
                if (fields[CustomFields.REG_PED_GARANTIA.id]?.id === RegistrarPedidoEmGarantia.SIM) {
                    const registrarPedidoEmGarantiaBody = await registrarPedidoEmGarantia(result.key);
                    await brynhildrAPI('/issue', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Basic ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(registrarPedidoEmGarantiaBody)
                    })
                }
            }

            return NextResponse.json({
                message: "Tarefa criada com sucesso",
                content: result
            }, { status: HttpStatus.CREATED })
        }
        catch (error) {
            return NextResponse.json({
                message: "Erro ao criar tarefa",
                content: error
            }, { status: HttpStatus.BAD_REQUEST })
        }
    }

    async function editQualityReport(issueKey: string, fields: Record<string, any>) {
        try {
            const body = { args: { ...fields } }
            await brynhildrAPI(`/issue/${issueKey}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`,
                },
                body: JSON.stringify(body)
            })
            return new NextResponse(null, { status: HttpStatus.NO_CONTENT })
        } catch (error) {
            return NextResponse.json({
                message: "Erro ao alterar os campos selecionados",
                content: error
            }, { status: HttpStatus.BAD_REQUEST })
        }
    }

    return {
        createQualityReport,
        editQualityReport,
    }
}