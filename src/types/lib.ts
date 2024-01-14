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

export type CheckDepItemType = {
  name: string;
  exists?: {
    fileName: string;
    fileSize: number;
    fileType: "file" | "dir";
  } | boolean;
  downloadUrl: any;
  children: CheckDepItemType[];
  version: string;
}

export type VersionItemType = {
  name: string;
  version: string;
  children?: VersionItemType[];
}

export type NeedUpdateDepType = {
  name: string;
  version: string;
  download_url: {
    origin: string;
    url: string;
    pwd: string;
  }[];
}