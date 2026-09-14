export type Contact = {
  id: string;
  call: string;
  freq: string;
  mode: string;
  rstSent: string;
  rstRcvd: string;
  qsoDate: string;
  timeOn?: string;
  qslRcvd?: string;
  qslRdate?: string | null;
  qslSent?: string;
  qslSdate?: string | null;
};

export type ContactDetails = Contact & {
  band: string;
  gridsquare: string | null;
  dxcc: number | null;
  name: string | null;
  qth: string | null;
  propMode: string | null;
  submode: string | null;
  comment: string | null;
  stationCallsign: string;
  operator: string;
  qslRcvd: string;
  qslSent: string;
  qslRcvdVia: string | null;
  qslSentVia: string | null;
  qslRdate: string | null;
  qslSdate: string | null;
  timeOn: string;
};

export type LogsResponse = {
  data: Contact[];
};
