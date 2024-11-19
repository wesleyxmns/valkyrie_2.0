import { brynhildrAPI } from "@/lib/fetch/brynhildr-api";
import { buildJiraAuthorization } from "../builds/build-jira-authorization";
import { CustomFields } from "../constants/jira/jira-custom-fields";

export async function generateEpicName() {
  const jql = `project = "WORK FLOW TESTE QUALIDADE" AND issuetype = Epic ORDER BY created DESC`
  const result = await brynhildrAPI(`/search?jql=${jql}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application',
      'Authorization': buildJiraAuthorization()
    }
  })

  const response = await result.json();
  const lastestEpicName: string = response?.issues?.[0]?.fields[CustomFields.EPIC_NAME.id] || null;

  if (lastestEpicName) {
    const letters = [
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "N",
      "O",
      "P",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    let oldKeyRNC = lastestEpicName.split("-");
    let idxNewLetter = 0;
    let letterRNC = oldKeyRNC![0];
    let number = parseInt(oldKeyRNC![1]);

    const maximuNumber = 999;
    if (number < maximuNumber) {
      number = number + 1;

      return `${letterRNC}-${String(number).padStart(3, "0")}`;
    } else {
      letters.find((letter, index) => {
        if (letter === letterRNC) {

          idxNewLetter = index + 1;
        }
      });

      return `${letters[idxNewLetter]}-001`;
    }
  }

  throw new Error("Erro ao gerar o nome do épico");
} 