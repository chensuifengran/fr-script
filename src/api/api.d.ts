type AppVersionConfig = {
  app_version: string;
  desc: string;
  download_url: DownloadUrl[];
  force_update: boolean;
  update_time: string;
  history: HistoryVersion[];
}
type DownloadUrl = {
  origin: string;
  url: string;
  pwd: string;
}
type HistoryVersion = {
  version: string;
  desc: string;
  update_time: string;
}