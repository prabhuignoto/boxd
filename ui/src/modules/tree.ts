import { ActionTree, MutationTree, GetterTree, Module } from "vuex";
import { RootState } from "@/store";
import Vue from "vue";
import _ from "lodash";

export enum NodeType {
  file = "file",
  folder = "folder",
}

export enum LockType {
  DELETE = "DELETE",
  MOVE = "MOVE",
  COPY = "COPY",
}

export interface TreeNode {
  name: string;
  id: string;
  path: string;
  children: string[];
  size: number;
  serverModified: number;
  hash: string | null;
  type?: NodeType;
  locked?: boolean;
  lockType?: LockType;
}

interface TreeData {
  [key: string]: TreeNode;
}

interface TreeState {
  refetch: boolean;
  createdAt: number;
  lastUpdated: number;
  trees: {
    [key: string]: TreeData;
  };
}

const actions: ActionTree<TreeState, RootState> = {
  deleteNode({ commit }, { id, fromPath }) {
    commit({
      type: "deleteNode",
      id,
      fromPath,
    });
  },
  deleteNodes({ commit }, { nodes, fromPath }) {
    commit({
      type: "deleteNode",
      nodes,
      fromPath,
    });
  },
  addNode({ commit }, { id, path, name, toPath }) {
    commit({
      type: "addNode",
      id,
      path,
      name,
      toPath,
    });
  },
  addNodes({ commit }, { treeId, nodes, toPath }) {
    commit({
      type: "addNodes",
      treeId,
      nodes,
      toPath,
    });
  },
  removeChildrenNodes({ commit }, { treeId, nodes, fromPath }) {
    commit({
      type: "removeChildrenNodes",
      treeId,
      nodes,
      fromPath,
    });
  },
};

const mutations: MutationTree<TreeState> = {
  addNodes(
    state,
    {
      treeId,
      nodes,
      toPath,
    }: { treeId: string; nodes: TreeNode[]; toPath: string }
  ) {
    // merge all nodes into one single object
    const newNodes = nodes.reduce(
      (a, b) => Object.assign(a, { [b.id]: b }),
      {}
    );
    let newData: TreeData = {};

    // if path is root (blank) create a root entry
    if (!toPath) {
      newData = Object.assign({}, newNodes, {
        ["$root"]: {
          id: "$root",
          name: "",
          path: "/",
          children: nodes.map(n => n.id),
          size: 0,
          hash: null,
          serverModified: 0,
        },
      });
    } else {
      // for other paths just directly merge the new nodes
      newData = Object.assign({}, state.trees[treeId], newNodes);
    }

    // update the reactive data
    Vue.set(state.trees, treeId, newData);

    // update the parent node and append the new children
    const ParentNode = _.find(
      state.trees[treeId],
      item => item.path === toPath
    );
    if (ParentNode) {
      const newNodes = nodes.map(n => n.id);
      const parentNodeData = Object.assign({}, ParentNode, {
        children: _.reject(
          ParentNode.children,
          item => newNodes.indexOf(item) >= 0
        ).concat(newNodes),
      });
      Vue.set(state.trees[treeId], ParentNode.id, parentNodeData);
    }
  },
  addNode(state, { treeId, id, path, name, toPath }) {
    Vue.set(state.trees[treeId], id, {
      id,
      name,
      path,
      children: [],
    });

    if (toPath) {
      const node = _.find(state.trees[treeId], item => item.path === toPath);

      if (node) {
        Vue.set(
          state.trees[treeId],
          node.id,
          Object.assign({}, node, {
            children: node.children.concat(id),
          })
        );
      }
    }
  },
  deleteNode(state, { treeId, id, fromPath }) {
    Vue.delete(state.trees[treeId], id);
    const node = _.find(state.trees[treeId], item => item.path === fromPath);

    if (node) {
      Vue.set(
        state.trees[treeId],
        node.id,
        Object.assign({}, node, {
          children: _.reject(node.children, i => i === id),
        })
      );
    }
  },
  deleteNodes(
    state,
    {
      treeId,
      nodes,
      fromPath,
    }: { treeId: string; nodes: string[]; fromPath: string }
  ) {
    Vue.set(
      state.trees,
      treeId,
      _.reject(item => nodes.indexOf(item.id) >= 0)
    );

    const parentNode = _.find(
      state.trees[treeId],
      item => item.path === fromPath
    );

    if (parentNode) {
      Vue.set(
        state.trees[treeId],
        parentNode.id,
        Object.assign({}, parentNode, {
          children: _.intersection(nodes, parentNode.children),
        })
      );
    }
  },
  removeChildrenNodes(
    state,
    {
      treeId,
      nodes,
      fromPath,
    }: { treeId: string; nodes: string[]; fromPath: string }
  ) {
    debugger;
    const parentNode = _.find(
      state.trees[treeId],
      item => item.path === fromPath
    );
    if (parentNode) {
      Vue.set(
        state.trees[treeId],
        parentNode.id,
        Object.assign({}, parentNode, {
          children: _.difference(parentNode.children, nodes),
        })
      );
    }
  },
};

const getters: GetterTree<TreeState, RootState> = {
  getRefetchTreeStatus: state => state.refetch,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNodesByPath: (state, getters, rootState, rootStateGetters) => (
    treeId: string,
    path: string
  ) => {
    const tree = state.trees[treeId];
    const activeBulkOps = rootState.list.bulkOps;

    if (tree) {
      const cNodes = _.chain(tree)
        .filter(item => item.path === path)
        .flatMap(x => x.children)
        .value();
      return cNodes.map(cNode =>
        Object.assign({}, tree[cNode], {
          locked: activeBulkOps.some(x => x.id === cNode && !!x.lockType),
        })
      );
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getChildNodesById: (state, getters, rootState, rootStateGetters) => (
    treeId: string,
    id: string
  ) => {
    const tree = state.trees[treeId];
    const activeBulkOps = rootState.list.bulkOps;

    if (tree) {
      const parentNode = _.find(tree, item => item.id === id);

      if (parentNode && parentNode.children.length) {
        return parentNode.children.map(child =>
          Object.assign({}, tree[child], {
            children: tree[child].children.map(c => tree[c]),
            locked: activeBulkOps.some(x => x.id === child),
          })
        );
      } else {
        return null;
      }
    }
  },
};

export default {
  state: {
    createdAt: 0,
    lastUpdated: 0,
    refetch: false,
    trees: {},
  },
  mutations,
  actions,
  getters,
} as Module<TreeState, RootState>;
