// app/page.js
'use client';

import { useState } from 'react';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export default function Home() {
  const [inputList, setInputList] = useState('');
  const [merkleRoot, setMerkleRoot] = useState('');
  const [merkleRootBuffer, setMerkleRootBuffer] = useState(null);
  const [proofInput, setProofInput] = useState('');
  const [proof, setProof] = useState('');
  const [merkleTree, setMerkleTree] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const leaves = inputList.split('\n').map(keccak256);
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    setMerkleTree(tree);
    const root = tree.getRoot().toString('hex');
    setMerkleRoot(root);
    setMerkleRootBuffer({
      type: 'Buffer',
      data: Array.from(tree.getRoot())
    });
  };

  const handleProof = (e) => {
    e.preventDefault();
    if (!merkleTree) return;
    const leaf = keccak256(proofInput);
    const proof = merkleTree.getProof(leaf);
    setProof(JSON.stringify(proof, null, 2));
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Merkle Tree Generator</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={inputList}
          onChange={(e) => setInputList(e.target.value)}
          placeholder="Enter items, one per line"
          className="w-full h-32 p-2 border rounded text-black"
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-black rounded">
          Generate Merkle Tree
        </button>
      </form>

      {merkleRoot && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Merkle Root:</h2>
          <p>String: {merkleRoot}</p>
          <p>Buffer:</p>
          <pre className="bg-gray-100 p-2 rounded text-black">
            {JSON.stringify(merkleRootBuffer, null, 4)}
          </pre>
        </div>
      )}

      <form onSubmit={handleProof} className="mb-4">
        <input
          type="text"
          value={proofInput}
          onChange={(e) => setProofInput(e.target.value)}
          placeholder="Enter item to get proof"
          className="w-full p-2 border rounded text-black"
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-black rounded">
          Get Proof
        </button>
      </form>

      {proof && (
        <div>
          <h2 className="text-xl font-semibold">Proof:</h2>
          <pre className="bg-gray-100 p-2 rounded text-black">{proof}</pre>
        </div>
      )}
    </main>
  );
}