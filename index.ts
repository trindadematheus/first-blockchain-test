import fastify from "fastify";

import { Blockchain } from "./entities/blockchain";

const app = fastify();
const blockchain = new Blockchain();

app.get("/mine_block", (_, reply) => {
  const previous_block = blockchain.get_previous_block();
  const previous_proof = previous_block.proof;
  const previous_hash = blockchain.hash(previous_block);
  const proof = blockchain.proof_of_work(previous_proof);

  const block = blockchain.create_block(proof, previous_hash);

  reply.send({ ...block });
});

app.get("/get_chain", (_, reply) => {
  reply.send({
    lenght: blockchain.chain.length,
    chain: blockchain.chain,
  });
});

app.listen({ port: 3000 }, (err) => {
  if (err) throw err;

  console.log(`server is running`);
});
