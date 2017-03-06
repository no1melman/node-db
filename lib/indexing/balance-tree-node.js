export const MAXIMUM_NODES = 5;

export class BTree {
    constructor() {
        this.root = null;
        this.newRootCallback = node => {
            this.root = node; // this is just a simple way to set a new root node
        };
    }

    /**
     * 
     * @param {Leaf} node - The node that needs to be added to the tree 
     */
    addNode(node) {
        debugger;
        if (this.root === null) {
            this.root = new Leaf();
            this.root.addNode(node, this.newRootCallback);
            return true;
        }

        this.root.tryAddNode(node, this.newRootCallback);
    }

    toJsonString() {

        const mapLeaf = leaf => {
            let nodes = leaf.nodes.map(n => {
                return {
                    index: n.index,
                    nodes: childNodes
                };
            });

            let childNodes = [];
            if (leaf.children.length > 0) {
                leaf.children.forEach(child => {
                    childNodes.push(mapLeaf(child));
                });
            }

            return {
                nodes,
                childNodes
            };
        };

        const leaf = mapLeaf(this.root);

        return JSON.stringify({leaf}, null, 4);
    }
}

export class Leaf {
    constructor(parent, nodes, children) {
        this.parent = parent;
        this.children = children || [];

        if (nodes && nodes.length >= MAXIMUM_NODES) {
            throw new LeafException("Can't add unbalanced nodes to a leaf")
        }

        this.nodes = nodes || [];
    }

    tryAddNode(node, newRootCallback) {
        if (this.children.length == 0) {
            this.addNode(node, newRootCallback); // we can add the node if there are no children
            // means we've hit an available leaf
            // this may cause a balance
            return true;
        }

        // if there are children, then it is likely this isn't the correct place
        let childIndex = this.nodes.length; // we can set the childIndex to final value
        for (let i = 0; i < this.nodes.length; i++) {
            if (node.index > this.nodes[i].index) {
                // if the index is larger than this index
                // we can continue
                continue;
            }

            // we got to a point where the current index is at the right place.
            childIndex = i; // set the child index to the current
        }

        const child = this.children[childIndex]; // this should exist (all balancing gives subtrees either side)
        if (child === undefined || child === null) {
            // our algorithm is broken if we come to this point
            // and this should be an exceptional circumstance (even though tryDo methods shouldn't really throw)
            throw new LeafException('The leaf is not balanced');
        }

        child.tryAddNode(node, newRootCallback); // this could cause a balance
        // this will recursively call into the next level
        // and restart the search down the subtree.
        return true;
    }

    /**
     * Adds a node to the leaf or the a subtree in the leaf
     * @param {Leaf} node 
     * @param {function} newRootCallback - The callback used when a new root node is needed to be set in the tree
     */
    addNode(node, newRootCallback) {
        if (newRootCallback === undefined || !(typeof newRootCallback === 'function')) {
            throw new ArgumentNullException("newRootCallback needs to be defined and a function");
        }

        if (this.nodes.length === MAXIMUM_NODES) {
            // the leaf is full here so we need to perform a split
            // and restructure the tree... 

            const medianIndex = Math.floor(MAXIMUM_NODES / 2);

            // this median node now needs to be hoisted into the parent...
            let medianNode = this.nodes[medianIndex];

            let parent = this.parent; // we need the parent to hoist the median node up
            const isRootNode = this.parent === undefined || this.parent === null; // this will be used later to signal the newRootCallback
            if (isRootNode) { // we are a root node :)
                // we need to create the parent;
                parent = new Leaf(null, [medianNode], [this]);
            }
            this.parent = parent;

            // the right lot needs to go as new child to the parent
            let right = new Leaf(parent, this.nodes.slice(medianIndex + 1, MAXIMUM_NODES)); // put the upper half into the right
            parent.addChildren(right);

            // the left lot can stay in this leaf....
            this.nodes = this.nodes.slice(0, medianIndex); // put the lower half into the left

            // so now we need to set a new parent
            if (isRootNode) {
                newRootCallback(parent);
            }

            parent.addNode(medianNode, newRootCallback);
        } else {
            // need to order the nodes

            this.nodes.push(node);
            this.nodes.sort((a, b) => a.index > b.index); // simple sort because index are integers
        }
    }

    /**
     * This is only called on the parent, leafs shouldn't call this themselves.
     * This is because trees are built from the ground up, never from the top down....
     * @param {Leaf|Array} child 
     */
    addChildren(child) {
        if (!(child instanceof Array)) {
            child = [child];
        }

        this.children = this.children.concat(child);
    }
}

export class Node {
    constructor(index, data) {
        this.index = index;
        this.data = data;
    }
}

export class LeafException {
    constructor(message) {
        this.message = message;
        Error.captureStackTrace(this);
    }

    toString() {
        return this.message;
    }
}

export class ArgumentNullException {
    constructor(message) {
        this.message = message;
        Error.captureStackTrace(this);
    }

    toString() {
        return this.message;
    }
}