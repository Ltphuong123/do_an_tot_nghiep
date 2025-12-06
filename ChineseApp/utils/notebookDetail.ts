import {
  getNotBookDetailFromTemplate,
  getNoteBookDeatail,
} from "@/services/notebook";
import { IResponseSuccess } from "@/types/common.type";
import {
  INotebookDetailFromTempResponse,
  INotebookVocabResponse,
} from "@/types/notebook.type";

export const getNotebookDetailCommon = async (
  notebookId: string,
  page: number = 1,
  limit: number = 20,
  isFromAdminBool: boolean,
  status?: string
): Promise<
  IResponseSuccess<INotebookVocabResponse | INotebookDetailFromTempResponse>
> => {
  if (isFromAdminBool) {
    const response = await getNotBookDetailFromTemplate(
      notebookId,
      page,
      limit
    );
    return response;
  } else {
    const response = await getNoteBookDeatail(notebookId, page, limit, status);
    return response;
  }
};
