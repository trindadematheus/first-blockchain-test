import crypto from "crypto";

type Block = {
  index: number;
  timestamp: string;
  previous_hash: string;
  proof: number;
};

export class Blockchain {
  chain: Block[];

  constructor() {
    this.chain = [];
    this.create_block(1, "0");
  }

  create_block(proof: number, previous_hash: string) {
    const block = {
      index: this.chain.length + 1,
      timestamp: Date.now().toString(),
      previous_hash: previous_hash,
      proof: proof,
    };

    this.chain.push(block);

    return block;
  }

  get_previous_block() {
    return this.chain[this.chain.length - 1];
  }

  proof_of_work(previous_proof: number) {
    let new_proof = 1;
    let check_proof = false;

    while (check_proof === false) {
      let bet = (
        Math.pow(new_proof, 2) - Math.pow(previous_proof, 2)
      ).toString();

      let hash_operation = crypto
        .createHash("sha256")
        .update(bet)
        .digest("hex");

      console.log(`[MINE]  PROOF: ${new_proof} | HASH: ${hash_operation}`);

      if (hash_operation.startsWith("0000")) {
        check_proof = true;
      } else {
        new_proof += 1;
      }
    }

    return new_proof;
  }

  hash(block: Block) {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(block))
      .digest("hex");
  }

  is_chain_valid() {
    let previous_block = this.chain[0];
    let next_block_idx = 1;

    while (next_block_idx < this.chain.length) {
      let block = this.chain[next_block_idx];

      if (block.previous_hash !== this.hash(previous_block)) {
        return false;
      }

      let previous_proof = previous_block.proof;
      let current_proof = block.proof;
      let test = (
        Math.pow(current_proof, 2) - Math.pow(previous_proof, 2)
      ).toString();

      let hash_operation = crypto
        .createHash("sha256")
        .update(test)
        .digest("hex");

      if (!hash_operation.startsWith("0000")) {
        return false;
      }

      previous_block = block;
      next_block_idx += 1;
    }

    return true;
  }
}
