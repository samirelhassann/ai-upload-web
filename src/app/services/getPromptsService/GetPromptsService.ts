import { axiosInstance } from "@/app/lib/axiosInstance";

import { GetPromptsResponse } from "./model/GetPromptsResponse";

export async function GetPromptsService() {
  return axiosInstance<GetPromptsResponse>(
    "http://localhost:3334/prompts/list",
  ).then((response) => {
    return response.data.prompts;
  });
}
