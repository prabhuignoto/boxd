import { ActionTree, MutationTree, GetterTree, Module } from "vuex";
import { RootState } from "@/store";
import Vue from "vue";
import _ from "lodash";

export enum NodeType {
  file = "file",
  folder = "folder",
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
}

interface TreeData {
  [key: string]: TreeNode;
}

interface TreeState {
  refetch: boolean;
  createdAt: number;
  lastUpdated: number;
  data: TreeData;
}

const actions: ActionTree<TreeState, RootState> = {
  repopulateTree({ commit }, path) {
    commit({
      type: "repopulateTree",
      path,
    });
  },
  repopulateTreeComplete({ commit }) {
    commit({
      type: "repopulateTreeComplete",
    });
  },
  deleteNode({ commit }, { id, fromPath }) {
    commit({
      type: "deleteNode",
      id,
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
  addNodes({ commit }, { nodes, toPath }) {
    commit({
      type: "addNodes",
      nodes,
      toPath,
    });
  },
};

const mutations: MutationTree<TreeState> = {
  repopulateTree(state) {
    state.refetch = true;
  },
  repopulateTreeComplete(state) {
    state.refetch = false;
  },
  addNodes(state, { nodes, toPath }: { nodes: TreeNode[]; toPath: string }) {
    const newNodes = nodes.reduce(
      (a, b) => Object.assign(a, { [b.id]: b }),
      {}
    );
    let newData: TreeData = {};
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
      newData = Object.assign({}, state.data, newNodes);
    }
    Vue.set(state, "data", newData);
    const ParentNode = _.find(state.data, item => item.path === toPath);

    if (ParentNode) {
      Vue.set(
        state.data,
        ParentNode.id,
        Object.assign({}, ParentNode, {
          children: ParentNode.children.concat(nodes.map(n => n.id)),
        })
      );
    }
  },
  addNode(state, { id, path, name, toPath }) {
    Vue.set(state.data, id, {
      id,
      name,
      path,
      children: [],
    });

    if (toPath) {
      const node = _.find(state.data, item => item.path === toPath);

      if (node) {
        Vue.set(
          state.data,
          node.id,
          Object.assign({}, node, {
            children: node.children.concat(id),
          })
        );
      }
    }
  },
  deleteNode(state, { id, fromPath }) {
    Vue.delete(state.data, id);
    const node = _.find(state.data, item => item.path === fromPath);

    if (node) {
      Vue.set(
        state.data,
        node.id,
        Object.assign({}, node, {
          children: _.reject(node.children, i => i === id),
        })
      );
    }
  },
  deleteNodes(
    state,
    { nodes, fromPath }: { nodes: string[]; fromPath: string }
  ) {
    Vue.set(
      state,
      "data",
      _.chain(state.data)
        .reject(item => nodes.indexOf(item.id) >= 0)
        .value()
    );

    const parentNode = _.find(state.data, item => item.path === fromPath);

    if (parentNode) {
      Vue.set(
        state.data,
        parentNode.id,
        Object.assign({}, parentNode, {
          children: _.intersection(nodes, parentNode.children),
        })
      );
    }
  },
};

const getters: GetterTree<TreeState, RootState> = {
  getRefetchTreeStatus: state => state.refetch,
  getNodesByPath: state => (path: string) => {
    const cNodes = _.chain(state.data)
      .filter(item => item.path === path)
      .flatMap(x => x.children)
      .value();
    return cNodes.map(cNode => state.data[cNode]);
  },
  getNodesById: state => (id: string) =>
    _.filter(state.data, item => item.id === id),
};

export default {
  state: {
    createdAt: 0,
    lastUpdated: 0,
    refetch: false,
    data: {},
  },
  mutations,
  actions,
  getters,
} as Module<TreeState, RootState>;
