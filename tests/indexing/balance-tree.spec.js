import expect from 'expect';
import {Leaf, Node, BTree} from '../../lib/indexing/balance-tree-node';
import fs from 'fs';

describe('Given an empty tree', () => {

    describe('When populating', () => {

        it('it should add a node', () => {

            const tree = new BTree();
            tree.addNode(new Node());

            expect(tree.root.nodes.length).toBe(1);

        });

        it('it should order the nodes when adding multiple nodes', () => {

            const tree = new BTree();
            tree.addNode(new Node(2));
            tree.addNode(new Node(1));
            tree.addNode(new Node(4));
            tree.addNode(new Node(3));

            expect(tree.root.nodes.length).toBe(4);
            expect(tree.root.nodes[0].index).toBe(1);
            expect(tree.root.nodes[1].index).toBe(2);
            expect(tree.root.nodes[2].index).toBe(3);
            expect(tree.root.nodes[3].index).toBe(4);

        })

        it('it should balance correctly', () => {

            const tree = new BTree();
            tree.addNode(new Node(2));
            tree.addNode(new Node(3));
            tree.addNode(new Node(1));
            tree.addNode(new Node(5));
            tree.addNode(new Node(4));
            tree.addNode(new Node(6)); // have to add 6 because that's bigger than the minimum

            expect(tree.root.children.length).toBe(2, "root node has child leaves");

            expect(tree.root.children[0].parent).toBe(tree.root);
            expect(tree.root.children[0].nodes.length).toBe(2, "left leaf should have 2 nodes");

            expect(tree.root.children[1].parent).toBe(tree.root);
            expect(tree.root.children[1].nodes.length).toBe(2, "right leaf should have 2 nodes");

            expect(tree.root.nodes.length).toBe(1, "root leaf should have 1 node");
            expect(tree.root.nodes[0].index).toBe(3, "root leaf's node should be index 3");

        });

        it('it should print the correct json structure', () => {

            const tree = new BTree();
            
            for (let i = 0; i < 30; i++) {
                tree.addNode(new Node(i));
            }

            let jsonResult = tree.toJsonString();
            expect(jsonResult).toBeA('string');
            
            fs.writeFile('./tests/json-output.json', jsonResult, (err) => {
                if (err) {
                    console.error(err);
                }

                console.log('Written tree output file');
            })
        })

    });

});