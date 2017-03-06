import {Leaf, Node, BTree} from '../../lib/indexing/balance-tree-node';

const tree = new BTree();

// 5 nodes per leaf means 6 child nodes
// 5 * 6 = 30, there 31 should introduce a new root node
for (let i = 0; i < 31; i++) {
    tree.addNode(new Node(i));
}
