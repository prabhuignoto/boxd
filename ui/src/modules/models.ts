export enum NodeType {
  file = "file",
  folder = "folder",
}

export enum LockType {
  DELETE = "DELETE",
  MOVE = "MOVE",
  COPY = "COPY",
  DOWNLOAD = "DOWNLOAD",
}

export interface TreeNode {
  name: string;
  id: string;
  path: string;
  children: string[];
  size: number;
  serverModified: number;
  hash: string | null;
  type: NodeType;
  locked?: boolean;
  lockType?: LockType;
}

export interface TreeData {
  [key: string]: TreeNode;
}

export interface TreeState {
  refetch: boolean;
  createdAt: number;
  lastUpdated: number;
  trees: {
    [key: string]: TreeData;
  };
}
