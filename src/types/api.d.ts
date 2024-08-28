declare type AppVersionConfig = {
  app_version: string;
  desc: string;
  download_url: DownloadUrl[];
  force_update: boolean;
  update_time: string;
  history: HistoryVersion[];
}
declare type DownloadUrl = {
  origin: string;
  url: string;
  pwd: string;
}
declare type HistoryVersion = {
  version: string;
  desc: string;
  update_time: string;
}