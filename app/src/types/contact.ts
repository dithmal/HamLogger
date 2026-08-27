export type Contact = {
  id: string;
  call: string;
  freq: string;
  mode: string;
  rstSent: string;
  rstRcvd: string;
  qsoDate: string;
};

export type LogsResponse = {
  data: Contact[];
};
