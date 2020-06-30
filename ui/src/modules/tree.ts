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
    // merge all nodes into one single object
    const newNodes = nodes.reduce(
      (a, b) => Object.assign(a, { [b.id]: b }),
      {}
    );
    let newData: TreeData = {};

    // if path is root (blank) create a root entry
    if (!toPath && !Object.prototype.hasOwnProperty.call(state.data, "$root")) {
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
      newData = Object.assign({}, state.data, newNodes);
    }

    // update the reactive data
    Vue.set(state, "data", newData);

    // update the parent node and append the new children
    const ParentNode = _.find(state.data, item => item.path === toPath);
    if (ParentNode) {
      const newNodes = nodes.map(n => n.id);
      const parentNodeData = Object.assign({}, ParentNode, {
        children: _.reject(
          ParentNode.children,
          item => newNodes.indexOf(item) >= 0
        ).concat(newNodes),
      });
      Vue.set(state.data, ParentNode.id, parentNodeData);
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
  getChildNodesById: state => (id: string) => {
    const parentNode = _.find(state.data, item => item.id === id);
    if (parentNode && parentNode.children.length) {
      return parentNode.children.map(child =>
        Object.assign({}, state.data[child], {
          children: state.data[child].children.map(c => state.data[c]),
        })
      );
    } else {
      return null;
    }
  },
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
