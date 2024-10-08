declare type DependenceItemType = {
  name: string;
  version: string;
  desc: string;
  download_url: {
    origin: string;
    url: string;
    pwd: string;
  }[];
  decompression: boolean;
  child_files: string[];
  root_path?: string;
  dependence: DependenceItemType[];
};
declare type DepPkgItemType = {
  name: string;
  download_url: {
    origin: string;
    url: string;
    pwd: string;
  }[];
  version: string;
  desc: string;
  decompression: boolean;
  child_files: string[];
};

declare type CheckDepItemType = {
  name: string;
  exists?:
    | {
        fileName: string;
        fileSize: number;
        fileType: "file" | "dir";
      }
    | boolean;
  downloadUrl: {
    origin: string;
    url: string;
    pwd: string;
  }[];
  children: LibNameItemType[];
  version: string;
  child_files: string[];
};

declare type LibNameItemType = CheckDepItemType & {
  child_files?: string[];
  root_path?: string;
};

declare type VersionItemType = {
  name: string;
  version: string;
  children?: VersionItemType[];
};

declare type NeedUpdateDepType = {
  name: string;
  version: string;
  currentVersion?: string;
  download_url: {
    origin: string;
    url: string;
    pwd: string;
  }[];
};

