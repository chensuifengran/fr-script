export type DependenceItemType = {
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
export type DepPkgItemType = {
  name: string;
  download_url: {
    origin: string;
    url: string;
    pwd: string;
  }[];
  version: string;
  desc: string;
  decompression: boolean;
  child_files:string[];
}

export type CheckDepItemType = {
  name: string;
  exists?: {
    fileName: string;
    fileSize: number;
    fileType: "file" | "dir";
  } | boolean;
  downloadUrl: {
    origin: string;
    url: string;
    pwd: string;
  }[];
  children: LibNameItemType[];
  version: string;
}

export type LibNameItemType = CheckDepItemType & {
  child_files?: string[];
  root_path?: string;
}

export type VersionItemType = {
  name: string;
  version: string;
  children?: VersionItemType[];
}

export type NeedUpdateDepType = {
  name: string;
  version: string;
  currentVersion?: string;
  download_url: {
    origin: string;
    url: string;
    pwd: string;
  }[];
}